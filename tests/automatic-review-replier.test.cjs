const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve, dirname } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');
const { Webhook } = require('svix');
const Stripe = require('stripe');

const root = resolve(__dirname, '..');
const site = 'https://zero-clicks.test';
const reviewUrl = 'https://mybusiness.googleapis.com/v4/accounts/123/locations/456/reviews';
const tokenHeaders = { authorization: 'Bearer fixture-cron-secret' };

test('new customer signs up, activates Founding, connects, and publishes an approved reply without n8n', async () => {
  const tables = {
    profiles: [
      { clerk_user_id: 'other', business_name: 'Corner Deli', plan: 'founding', subscription_status: 'active' },
    ],
    google_connections: [{
      id: 'other-connection', clerk_user_id: 'other',
      account_id: 'accounts/222', location_id: 'locations/777',
      access_token: 'other-access', refresh_token: 'other-refresh',
      access_token_expires_at: new Date(Date.now() + 3600000).toISOString(),
    }],
    reviews: [],
    settings: [],
  };
  let failPublicationStamp = true;
  const supabase = {
    from(table) {
      const rows = tables[table];
      const predicates = [];
      let patch;
      let insert;
      let limit = Infinity;
      let countOnly = false;
      const query = {
        select: (_, options) => { countOnly = options?.head && options?.count === "exact"; return query; },
        eq: (key, value) => { predicates.push(row => row[key] === value); return query; },
        in: (key, values) => { predicates.push(row => values.includes(row[key])); return query; },
        is: (key, value) => { predicates.push(row => (row[key] ?? null) === value); return query; },
        not: (key, op, value) => {
          assert.equal(op, 'is');
          predicates.push(row => (row[key] ?? null) !== value);
          return query;
        },
        limit: value => { limit = value; return query; },
        order: () => query,
        or(expression) {
          const [nullCheck, lessThan] = expression.split(',');
          const field = nullCheck.split('.')[0];
          assert.equal(nullCheck, field + '.is.null');
          const threshold = lessThan.slice((field + '.lt.').length);
          predicates.push(row => row[field] == null || row[field] < threshold);
          return query;
        },
        update: value => { patch = value; return query; },
        upsert(value, options) {
          insert = { value, options };
          return query;
        },
        then(resolveResult) {
          if (insert) {
            const { value, options } = insert;
            const columns = options.onConflict.split(',');
            const previous = rows.find(row => columns.every(column => row[column] === value[column]));
            if (previous && options.ignoreDuplicates) return Promise.resolve(resolveResult({ data: [], error: null }));
            const row = previous ?? { id: `fixture-${rows.length + 1}` };
            if (table === 'reviews' && !previous) row.publication_blocked = false;
            Object.assign(row, value);
            if (!previous) rows.push(row);
            return Promise.resolve(resolveResult({ data: [row], error: null }));
          }
          if (patch?.posted_to_google_at && failPublicationStamp) {
            failPublicationStamp = false;
            return Promise.resolve(resolveResult({ data: null, error: { message: 'Mock write failure' } }));
          }
          const data = rows.filter(row => predicates.every(match => match(row))).slice(0, limit);
          if (patch) data.forEach(row => Object.assign(row, patch));
          return Promise.resolve(resolveResult(countOnly ? { data: null, error: null, count: data.length } : { data, error: null }));
        },
        async maybeSingle() { const { data, error } = await query; return { data: data?.[0] ?? null, error }; },
        single() { return query.maybeSingle(); },
      };
      return query;
    },
  };

  const env = {
    NEXT_PUBLIC_SITE_URL: site, OAUTH_STATE_SECRET: 'fixture-state',
    GOOGLE_CLIENT_ID: 'fixture-client', GOOGLE_CLIENT_SECRET: 'fixture-secret',
    GOOGLE_REDIRECT_URI: site + '/api/auth/google/callback',
    CRON_SECRET: 'fixture-cron-secret', ZERO_CLICKS_OWNER_CLERK_ID: 'admin',
    GOOGLE_REVIEW_PUBLISHING_ENABLED: 'true',
    CLERK_WEBHOOK_SECRET: 'whsec_' + Buffer.from('fixture-clerk-signing-secret').toString('base64'),
    STRIPE_WEBHOOK_SECRET: 'whsec_fixture', STRIPE_SECRET_KEY: 'sk_test_fixture',
  };
  let clerkHeaders;
  const stripe = new Stripe('sk_test_fixture');
  let nonce = '';
  let postedReply;
  let attempts = 0;
  let draftCalls = 0;
  let geminiUnavailable = false;
  let tokenRevoked = false;
  let temporaryTokenError = false;
  let oauthFixture = 'ok';
  let clockOffset = 0;
  class TestDate extends Date {
    constructor(...values) { super(...(values.length ? values : [Date.now() + clockOffset])); }
    static now() { return Date.now() + clockOffset; }
  }
  let incomingReviewId = 'r1';
  let incomingGoogleReply;
  let actor = { userId: 'fixture' };
  let googleRejects = true;
  const draft = 'Thanks for the five stars! We’re glad you stopped by and hope to see you again soon.';
  const fourStarFallback = 'Really glad you enjoyed the food. Thanks for coming in!';
  const geminiDraft = 'Glad you enjoyed the food at the Fixture Arms. Hope to see you again soon!';
  const mocks = {
    crypto,
    'server-only': {},
    'next/server': { NextResponse: Response },
    'next/navigation': { redirect: destination => { throw new Error(destination); } },
    'next/headers': {
      headers: () => clerkHeaders,
      cookies: () => ({ set: (_, value) => { nonce = value; }, get: () => ({ value: nonce }) }),
    },
    svix: { Webhook },
    stripe: { __esModule: true, default: class {
      webhooks = stripe.webhooks;
      billingPortal = {
        configurations: { list: async () => ({ data: [{ id: "bpc_fixture", metadata: { workspace: "zero_clicks_workspace" } }] }) },
        sessions: { create: async ({ customer, configuration, return_url }) => {
          assert.equal(customer, 'cus_fixture');
          assert.equal(configuration, 'bpc_fixture');
          assert.equal(return_url, site + '/dashboard/billing');
          return { url: 'https://billing.stripe.com/p/session/fixture' };
        } },
      };
      subscriptions = { list: async ({ customer }) => {
        assert.equal(customer, 'cus_fixture');
        return { data: [{ status: 'active', metadata: { clerk_user_id: 'fixture', plan: 'founding' }, items: { data: [{ current_period_end: 1800000000 }] } }] };
      } };
    } },
    '@clerk/nextjs/server': {
      auth: async () => actor,
      clerkMiddleware: handler => handler,
      createRouteMatcher: patterns => request => patterns.some(pattern => {
        const route = request.nextUrl.pathname;
        return pattern.endsWith('(.*)') ? route.startsWith(pattern.slice(0, -4)) : route === pattern;
      }),
      currentUser: async () => ({
        id: actor.userId, createdAt: Date.now() - 86400000,
        primaryEmailAddress: { emailAddress: 'venue-owner@example.test' },
      }),
    },
    '@/lib/supabase': { supabase },
    '@/lib/rateLimit': { checkRateLimit: () => ({ allowed: true }) },
  };

  async function fakeFetch(input, options = {}) {
    const url = new URL(input);
    if (url.origin === 'https://generativelanguage.googleapis.com') {
      draftCalls++;
      assert.equal(url.pathname, '/v1beta/models/fixture-gemini:generateContent');
      assert.equal(options.headers['x-goog-api-key'], 'fixture-gemini-key');
      assert.match(JSON.parse(options.body).contents[0].parts[0].text, /Great food/);
      await new Promise(resolve => setImmediate(resolve));
      if (geminiUnavailable) return Response.json({}, { status: 429 });
      return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ reply: geminiDraft, assessment: 'routine_praise' }) }] } }] });
    }
    if (url.href === 'https://oauth2.googleapis.com/token') {
      if (options.body.get('grant_type') === 'authorization_code') {
        if (oauthFixture === 'invalid_client') return Response.json({ error: 'invalid_client' }, { status: 401 });
        if (oauthFixture === 'invalid_grant') return Response.json({ error: 'invalid_grant' }, { status: 400 });
        if (oauthFixture === 'no_refresh') return Response.json({ access_token: 'fake-access', expires_in: 3600 });
        if (oauthFixture === 'no_scope') return Response.json({ access_token: 'fake-access', refresh_token: 'fake-refresh', expires_in: 3600, scope: 'email' });
      }
      if (temporaryTokenError) return Response.json({ error: 'temporarily_unavailable' }, { status: 503 });
      if (tokenRevoked) return Response.json({ error: 'invalid_grant' }, { status: 400 });
      return Response.json({ access_token: 'fake-access', refresh_token: 'fake-refresh', expires_in: 3600 });
    }
    if (url.href === 'https://www.googleapis.com/oauth2/v2/userinfo') return Response.json({ email: 'fake@example.test' });
    if (url.href === 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts') return Response.json({ accounts: [{ name: 'accounts/123' }] });
    if (url.origin === 'https://mybusinessbusinessinformation.googleapis.com') {
      assert.equal(url.pathname, '/v1/accounts/123/locations');
      assert.equal(url.searchParams.get('readMask'), 'name,title,storefrontAddress');
      return Response.json({ locations: [{ name: 'locations/456', title: 'Fixture Arms' }] });
    }
    if (url.href.startsWith(reviewUrl + '?')) {
      assert.equal(options.headers.Authorization, 'Bearer fake-access');
      return Response.json({ reviews: [{
        name: 'accounts/123/locations/456/reviews/' + incomingReviewId, reviewId: incomingReviewId,
        starRating: incomingReviewId === 'r1' ? 'FIVE' : 'FOUR', comment: 'Great food', reviewer: { displayName: 'Test guest' },
        reviewReply: incomingGoogleReply,
      }] });
    }
    if (url.href.startsWith('https://mybusiness.googleapis.com/v4/accounts/222/locations/777/reviews?')) {
      assert.equal(options.headers.Authorization, 'Bearer other-access');
      return Response.json({ reviews: [] });
    }
    if (url.href === reviewUrl + '/r1') return Response.json({
      name: 'accounts/123/locations/456/reviews/r1',
      reviewReply: postedReply && { comment: postedReply, reviewReplyState: 'PENDING' },
    });
    if (url.href === reviewUrl + '/r2') return Response.json({
      name: 'accounts/123/locations/456/reviews/r2',
      reviewReply: { comment: 'An owner replied first.' },
    });
    if (url.href === reviewUrl + '/r1/reply') {
      assert.equal(options.method, 'PUT');
      assert.equal(options.headers.Authorization, 'Bearer fake-access');
      attempts++;
      if (googleRejects) return new Response('Temporary upstream error', { status: 503 });
      postedReply = JSON.parse(options.body).comment;
      return Response.json({ comment: postedReply, reviewReplyState: 'PENDING' });
    }
    assert.fail(`Unexpected mock URL: ${url}`);
  }

  function load(path) {
    const file = resolve(root, path + '.ts');
    const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    const exports = {};
    vm.runInNewContext(outputText, {
      exports, process: { env }, fetch: fakeFetch, crypto, Buffer, URL, URLSearchParams, AbortSignal, Date: TestDate, console,
      require(name) {
        if (name in mocks) return mocks[name];
        if (name === 'node:crypto') return crypto;
        if (name === './supabase') return mocks['@/lib/supabase'];
        if (name.startsWith('@/')) return load(name.slice(2));
        if (name.startsWith('./')) return load(resolve(dirname(file), name));
        assert.fail(`Unexpected import: ${name}`);
      },
    }, { filename: file });
    return exports;
  }

  assert.equal(tables.profiles.some(row => row.clerk_user_id === 'fixture'), false);
  const signup = JSON.stringify({
    type: 'user.created',
    data: { id: 'fixture', email_addresses: [{ email_address: 'owner@example.test' }] },
  });
  const signupAt = new Date();
  clerkHeaders = new Headers({
    'svix-id': 'msg_fixture',
    'svix-timestamp': String(Math.floor(signupAt.getTime() / 1000)),
    'svix-signature': new Webhook(env.CLERK_WEBHOOK_SECRET).sign('msg_fixture', signupAt, signup),
  });
  const signupResult = await load('app/api/webhooks/clerk/route').POST(new Request(site, { method: 'POST', body: signup }));
  assert.equal(signupResult.status, 200);
  const profile = tables.profiles.find(row => row.clerk_user_id === 'fixture');
  assert.equal(profile.plan, 'trial');
  assert.ok(Date.parse(profile.trial_ends_at) > signupAt.getTime());
  assert.equal(tables.settings[0].auto_send_positive, false);

  const paymentEvent = JSON.stringify({ type: 'checkout.session.completed', data: { object: { customer: 'cus_fixture' } } });
  const stripeResult = await load('app/api/webhooks/stripe/route').POST(new Request(site, {
    method: 'POST', body: paymentEvent,
    headers: { 'stripe-signature': stripe.webhooks.generateTestHeaderString({ payload: paymentEvent, secret: env.STRIPE_WEBHOOK_SECRET }) },
  }));
  assert.equal(stripeResult.status, 200);
  assert.equal(profile.plan, 'founding');
  assert.equal(profile.subscription_status, 'active');

  const startSetup = load('app/start/page').default;
  async function expectSetup(destination) {
    await assert.rejects(startSetup(), { message: destination });
  }
  actor = {};
  await expectSetup('/sign-in?redirect_url=%2Fstart');
  actor = { userId: 'missing-profile' };
  await expectSetup('/onboarding');
  actor = { userId: 'fixture' };
  profile.business_name = 'Fixture Arms';
  await expectSetup('/connect');

  const startGoogle = load('app/api/auth/google/route').GET;
  const finishGoogle = load('app/api/auth/google/callback/route').GET;
  const begin = async () => new URL((await startGoogle(new Request(site + '/api/auth/google'))).headers.get('location'));
  const makeCallback = consent => {
    const url = new URL(site + '/api/auth/google/callback');
    url.searchParams.set('code', 'fixture-code');
    url.searchParams.set('state', consent.searchParams.get('state'));
    return new Request(url);
  };
  const canonical = await startGoogle(new Request('https://alternate.zero-clicks.test/api/auth/google'));
  assert.equal(canonical.headers.get('location'), site + '/api/auth/google');
  assert.equal(nonce, '');
  for (const [fixture, expected] of [
    ['invalid_client', 'google_client_rejected'],
    ['invalid_grant', 'google_code_expired'],
    ['no_refresh', 'google_refresh_missing'],
    ['no_scope', 'google_scope'],
  ]) {
    oauthFixture = fixture;
    const denied = await finishGoogle(makeCallback(await begin()));
    assert.equal(denied.headers.get('location'), site + '/connect?error=' + expected);
    assert.equal(tables.google_connections.some(row => row.clerk_user_id === 'fixture'), false);
  }
  const movedSession = makeCallback(await begin());
  actor = { userId: 'other' };
  assert.equal((await finishGoogle(movedSession)).headers.get('location'), site + '/connect?error=invalid_state');
  actor = { userId: 'fixture' };

  oauthFixture = 'ok';
  // The normal entry point stores venue details in /api/profile before OAuth.
  profile.business_name = 'Fixture Arms';
  const consent = await begin();
  assert.equal(consent.searchParams.get('prompt'), 'select_account consent');
  assert.equal(consent.searchParams.get('redirect_uri'), env.GOOGLE_REDIRECT_URI);
  const callback = await finishGoogle(makeCallback(consent));
  assert.match(callback.headers.get('location'), /location=ready$/);
  const venue = tables.google_connections.find(row => row.clerk_user_id === 'fixture');
  assert.equal(venue.location_id, 'locations/456');
  assert.equal(profile.business_name, 'Fixture Arms');
  // A customer can finish venue selection after the initial OAuth access token expires.
  const integration = load('app/api/integrations/google/route');
  const pickerRequest = body => new Request(site + '/api/integrations/google', {
    method: 'POST', body: JSON.stringify(body),
  });
  await expectSetup('/dashboard');
  venue.account_id = null;
  venue.location_id = null;
  await expectSetup('/connect/success?location=select');

  venue.access_token = 'expired-access';
  venue.access_token_expires_at = new Date(0).toISOString();
  const listed = await integration.POST(pickerRequest({ action: 'list' }));
  assert.equal(listed.status, 200);
  assert.equal((await listed.json()).locations[0].locationId, 'locations/456');
  assert.equal(venue.access_token, 'fake-access');
  assert.equal(venue.location_id, null);

  venue.access_token = 'expired-again';
  venue.access_token_expires_at = new Date(0).toISOString();
  const saved = await integration.POST(pickerRequest({
    accountId: 'accounts/123', locationId: 'locations/456',
  }));
  assert.equal(saved.status, 200);
  assert.equal(venue.access_token, 'fake-access');
  assert.equal(venue.location_id, 'locations/456');
  const connection = await (await load('app/api/integrations/google/route').GET()).json();
  assert.equal(connection.connected, true);
  assert.equal(connection.connection.google_email, 'fake@example.test');
  assert.equal('access_token' in connection.connection, false);

  const cron = (route) => load('app/api/cron/' + route + '/route').GET(new Request(site, { headers: tokenHeaders }));
  const poller = load('app/api/cron/poll-reviews/route');
  assert.equal((await poller.GET(new Request(site))).status, 401);
  const parallelPolls = await Promise.all([cron('poll-reviews'), cron('poll-reviews')]);
  let newReviews = 0;
  for (const response of parallelPolls) {
    assert.equal(response.status, 200);
    newReviews += (await response.json()).results.find(row => row.clerk_user_id === 'fixture').new_reviews;
  }
  assert.equal(newReviews, 1);
  assert.equal(tables.reviews.length, 1);
  assert.equal(draftCalls, 0, 'Default drafting does not call a model provider');
  const secondPoll = await cron('poll-reviews');
  assert.equal(secondPoll.status, 200);
  assert.equal((await secondPoll.json()).results.find(row => row.clerk_user_id === 'fixture').new_reviews, 0);
  assert.equal(tables.reviews.length, 1);
  const reviews = load('app/api/reviews/route');
  const listing = await (await reviews.GET(new Request(site))).json();
  const [review] = listing.reviews;
  assert.equal(review.draft_response, draft);
  assert.equal(review.status, 'pending');
  assert.equal(review.reviewer_name, 'Test guest');
  assert.equal(review.review_text, 'Great food');
  assert.equal(review.rating, 5);
  assert.equal(review.sentiment, 'POSITIVE');
  assert.deepEqual(listing.metrics, { totalReviews: 1, negativeCount: 0, pendingCount: 1, sentCount: 0 });

  const adminClients = load('app/api/admin/clients/route');
  const adminReviews = load('app/api/admin/client/reviews/route');
  const adminRequest = { nextUrl: new URL(site + '/api/admin/client/reviews?id=fixture') };
  const workspace = load('lib/workspaceAccess');
  const middleware = load('middleware').default;
  const runMiddleware = path => middleware(
    Object.assign(async () => actor, { protect: async () => assert.ok(actor.userId) }),
    { url: site + path, nextUrl: new URL(site + path), headers: new Headers() },
  );
  actor = { userId: 'admin' };
  assert.equal((await runMiddleware('/sign-in')).headers.get('location'), site + '/admin');
  assert.equal(await runMiddleware('/admin'), undefined);
  actor = { userId: 'fixture', sessionClaims: { metadata: { role: 'admin' } } };
  assert.equal((await runMiddleware('/sign-in')).headers.get('location'), site + '/dashboard');
  assert.equal((await runMiddleware('/admin')).headers.get('location'), site + '/dashboard');
  assert.equal((await runMiddleware('/sign-in?redirect_url=%2Fconnect')).headers.get('location'), site + '/connect');
  assert.equal((await runMiddleware('/sign-in?redirect_url=https%3A%2F%2Fother.test')).headers.get('location'), site + '/dashboard');
  assert.equal(workspace.workspaceHome('admin'), '/admin');
  assert.equal(workspace.workspaceHome('fixture'), '/dashboard');
  delete env.ZERO_CLICKS_OWNER_CLERK_ID;
  assert.equal(workspace.isWorkspaceOwner('admin'), false);
  env.ZERO_CLICKS_OWNER_CLERK_ID = 'admin';

  // A stale Clerk admin claim cannot grant a different user access.
  actor = { userId: 'fixture', sessionClaims: { metadata: { role: 'admin' } } };
  assert.equal((await adminClients.GET()).status, 403);
  assert.equal((await adminReviews.GET(adminRequest)).status, 403);
  const billing = load('app/api/billing/route');
  const billingRequest = (suffix = '') => ({ nextUrl: new URL(site + '/api/billing' + suffix) });
  assert.equal((await billing.GET(billingRequest('?client=other'))).status, 403);
  actor = { userId: 'admin' };
  assert.equal(workspace.isWorkspaceOwner(actor.userId), true);
  assert.equal((await adminReviews.GET(adminRequest)).status, 200);

  // A portal URL can only be minted by the signed-in billing customer.
  actor = {};
  assert.equal((await billing.GET(billingRequest())).status, 401);
  assert.equal((await billing.POST(billingRequest())).status, 401);
  actor = { userId: 'other' };
  assert.equal((await billing.GET(billingRequest('?client=fixture'))).status, 403);
  assert.equal((await billing.POST(billingRequest('?client=fixture'))).status, 403);
  assert.equal((await billing.POST(billingRequest())).status, 409);
  actor = { userId: 'fixture' };
  const ownerBilling = await billing.GET(billingRequest());
  assert.match(ownerBilling.headers.get('cache-control'), /no-store/);
  const own = await ownerBilling.json();
  assert.equal(own.subscription.status, 'active');
  assert.equal(own.subscription.periodEnd, 1800000000);
  assert.equal(own.dashboardUrl, undefined);
  assert.match((await (await billing.POST(billingRequest())).json()).url, /^https:\/\/billing\.stripe\.com/);
  actor = { userId: 'admin' };
  assert.match((await (await billing.GET(billingRequest('?client=fixture'))).json()).dashboardUrl, /test\/customers\/cus_fixture$/);
  assert.equal((await billing.POST(billingRequest('?client=fixture'))).status, 403);

  const { clients } = await (await adminClients.GET()).json();
  const fixture = clients.find(client => client.clerk_user_id === 'fixture');
  assert.equal(fixture.business_name, 'Fixture Arms');
  assert.equal(fixture.plan, 'founding');
  assert.equal(fixture.google_connected, true);
  assert.equal(fixture.reviews_count, 1);
  assert.equal(clients.find(client => client.clerk_user_id === 'other').reviews_count, 0);
  assert.ok(Date.parse(fixture.last_synced_at) > 0);
  assert.equal((await (await adminReviews.GET(adminRequest)).json()).reviews[0].draft_response, draft);
  const adminEdit = (update) => adminReviews.PATCH(new Request(site, {
    method: 'PATCH', body: JSON.stringify({ review_id: review.id, ...update }),
  }));
  assert.equal((await adminEdit({ status: 'sent' })).status, 400);
  assert.equal((await adminEdit({ status: 'approved' })).status, 400);
  assert.equal((await cron('post-replies')).status, 200);
  assert.equal(attempts, 0);

  const update = (status, reply) => reviews.PUT(new Request(site, {
    method: 'PUT', body: JSON.stringify({ id: review.id, status, draft_response: reply }),
  }));
  actor = { userId: 'other' };
  assert.equal((await (await reviews.GET(new Request(site))).json()).reviews.length, 0);
  assert.equal((await update('approved', 'Different customer')).status, 409);
  assert.equal(tables.reviews[0].status, 'pending');
  assert.equal(attempts, 0);
  actor = { userId: 'fixture' };
  const regenerate = () => load('app/api/reviews/regenerate/route').POST(new Request(site, {
    method: 'POST', body: JSON.stringify({ id: review.id }),
  }));
  assert.equal((await (await regenerate()).json()).draft, draft);
  env.GEMINI_API_KEY = 'fixture-gemini-key';
  env.GEMINI_REVIEW_MODEL = 'fixture-gemini';
  assert.equal((await (await regenerate()).json()).draft, draft);
  assert.equal(draftCalls, 0, 'five-star defaults never call the AI provider');
  tables.reviews[0].rating = 4;
  assert.equal((await (await regenerate()).json()).draft, geminiDraft);
  geminiUnavailable = true;
  assert.equal((await (await regenerate()).json()).draft, fourStarFallback);
  tables.reviews[0].rating = 5;
  assert.equal(draftCalls, 2);
  assert.equal((await update('sent', draft)).status, 400);
  assert.equal((await update('approved', '   ')).status, 400);
  const approvedReply = 'Thanks for stopping by the Fixture Arms. Glad you enjoyed the food! — The team';
  delete env.GOOGLE_REVIEW_PUBLISHING_ENABLED;
  assert.equal((await update('approved', approvedReply)).status, 409);
  assert.equal((await (await reviews.GET(new Request(site))).json()).publishingEnabled, false);
  tables.reviews[0].status = 'approved';
  assert.equal((await (await cron('post-replies')).json()).skipped, 'draft_only');
  assert.equal(attempts, 0, 'the pilot cannot publish old queued replies');
  assert.equal((await update(undefined, approvedReply)).status, 200);
  tables.reviews[0].status = 'pending';
  env.GOOGLE_REVIEW_PUBLISHING_ENABLED = 'true';
  assert.equal((await update('approved', approvedReply)).status, 200);
  assert.equal((await update('approved', 'Changed after approval')).status, 409);
  assert.equal((await (await reviews.GET(new Request(site))).json()).reviews[0].status, 'approved');
  actor = { userId: 'admin' };
  assert.equal((await adminEdit({ draft_response: 'Edited after approval' })).status, 409);
  actor = { userId: 'fixture' };
  const originalLocation = venue.location_id;
  venue.location_id = 'locations/999';
  assert.equal((await cron('post-replies')).status, 502);
  assert.match(tables.reviews[0].publication_message, /different Google venue/);
  assert.equal(attempts, 0);
  venue.location_id = originalLocation;
  clockOffset += 1000;
  const expiresAt = venue.access_token_expires_at;
  venue.access_token_expires_at = new Date(0).toISOString();
  temporaryTokenError = true;
  assert.equal((await cron('post-replies')).status, 502);
  assert.equal(venue.needs_reconnect, false);
  assert.equal(attempts, 0);
  temporaryTokenError = false;
  tokenRevoked = true;
  clockOffset += 1000;
  assert.equal((await cron('post-replies')).status, 502);
  assert.equal(venue.needs_reconnect, true);
  assert.equal(tables.reviews[0].status, 'approved');
  assert.equal(attempts, 0);
  assert.equal((await (await load('app/api/integrations/google/route').GET()).json()).needs_reconnect, true);
  tokenRevoked = false;
  venue.needs_reconnect = false;
  venue.access_token_expires_at = expiresAt;
  clockOffset += 1000;
  assert.equal((await cron('post-replies')).status, 502);
  assert.equal(tables.reviews[0].status, 'approved');
  assert.equal(tables.reviews[0].posted_to_google_at, undefined);
  googleRejects = false;
  clockOffset += 1000;
  const workers = await Promise.all([cron('post-replies'), cron('post-replies')]);
  assert.deepEqual(workers.map(worker => worker.status).sort(), [200, 502]);
  assert.equal(postedReply, approvedReply);
  assert.equal(tables.reviews[0].status, 'approved');
  assert.equal(attempts, 2);
  clockOffset += 121000;
  assert.equal((await cron('post-replies')).status, 200);
  assert.equal(postedReply, approvedReply);
  assert.equal(tables.reviews[0].status, 'sent');
  assert.ok(tables.reviews[0].posted_to_google_at);
  assert.ok(tables.reviews[0].sent_at);
  assert.equal(tables.reviews[0].google_reply_state, 'pending');
  const published = await (await reviews.GET(new Request(site))).json();
  assert.equal(published.metrics.sentCount, 1);
  assert.ok(published.reviews[0].posted_to_google_at);
  actor = { userId: 'admin' };
  assert.equal((await (await adminReviews.GET(adminRequest)).json()).reviews[0].status, 'sent');
  assert.equal((await cron('post-replies')).status, 200);
  assert.equal(attempts, 2);
  incomingGoogleReply = { comment: approvedReply, reviewReplyState: 'APPROVED' };
  assert.equal((await cron('poll-reviews')).status, 200);
  assert.equal(tables.reviews[0].google_reply_state, 'approved');
  incomingGoogleReply = undefined;

  // A second review proves draft claims with the optional paid call enabled.
  env.GEMINI_API_KEY = 'fixture-gemini-key';
  env.GEMINI_REVIEW_MODEL = 'fixture-gemini';
  geminiUnavailable = false;
  incomingReviewId = 'r2';
  const beforeOverlap = draftCalls;
  const scopedPoll = () => poller.GET(new Request(site + '/?customer=fixture', { headers: tokenHeaders }));
  for (const response of await Promise.all([scopedPoll(), scopedPoll()])) {
    assert.equal(response.status, 200);
    assert.equal((await response.json()).processed, 1);
  }
  assert.equal(draftCalls - beforeOverlap, 1);
  assert.equal(tables.reviews.length, 2);
  const second = tables.reviews.find(row => row.external_id === 'r2');
  assert.equal(second.draft_response, geminiDraft);
  actor = { userId: 'fixture' };
  assert.equal((await reviews.PUT(new Request(site, {
    method: 'PUT', body: JSON.stringify({ id: second.id, status: 'approved', draft_response: geminiDraft }),
  }))).status, 200);
  assert.equal((await cron('post-replies')).status, 502);
  assert.equal(second.publication_blocked, true);
  assert.match(second.publication_message, /Already replied on Google/);
  assert.equal(attempts, 2);
  assert.equal((await cron('post-replies')).status, 200);
  // Venue setup can recover when Clerk's signup event has not created a profile.
  actor = { userId: 'missing-profile' };
  const saveProfile = load('app/api/profile/route').PUT;
  const venueDetails = { business_name: 'New Test Venue', phone: '00000000000' };
  const saveVenue = values => saveProfile(new Request(site + '/api/profile', {
    method: 'PUT', body: JSON.stringify(values),
  }));
  assert.equal((await saveVenue(venueDetails)).status, 200);
  const recovered = tables.profiles.find(row => row.clerk_user_id === actor.userId);
  assert.equal(recovered.email, 'venue-owner@example.test');
  assert.equal(recovered.business_name, venueDetails.business_name);
  assert.equal(recovered.plan, 'trial');
  const recoveredSettings = tables.settings.find(row => row.clerk_user_id === actor.userId);
  assert.equal(recoveredSettings.auto_send_positive, false);
  recovered.plan = 'founding';
  recoveredSettings.tone = 'casual';
  assert.equal((await saveVenue({ business_name: 'Renamed Test Venue' })).status, 200);
  assert.equal(recovered.business_name, 'Renamed Test Venue');
  assert.equal(recovered.plan, 'founding');
  assert.equal(recoveredSettings.tone, 'casual');

  // A delayed duplicate signup event must preserve billing and settings.
  assert.equal((await load('app/api/webhooks/clerk/route').POST(new Request(site, {
    method: 'POST', body: signup,
  }))).status, 200);
  assert.equal(profile.plan, 'founding');

  delete env.GEMINI_API_KEY;
  delete env.GEMINI_REVIEW_MODEL;
  const draftReply = load('lib/generateReviewDraft').generateReviewDraft;
  const sampleContext = { business_name: 'Fixture Arms', manager_name: 'Manager',
    business_type: 'pub', location: 'Bath', tone: 'warm-professional', reviewer_name: 'Guest' };
  for (const [rating, review_text, expected] of [
    [1, 'A member of staff was rude.', /way you were treated/],
    [2, 'The mains arrived cold.', /food was cold/],
    [3, 'We waited 40 minutes.', /wait 40 minutes/],
    [4, 'Great food.', /enjoyed the food/],
  ]) {
    assert.match((await draftReply({ ...sampleContext, rating, review_text })).text, expected);
    assert.ok((await draftReply({ ...sampleContext, rating, review_text: '' })).text.trim());
  }
  assert.equal((await draftReply({ ...sampleContext, rating: 5, review_text: '' })).text, draft);
  assert.equal((await draftReply({ ...sampleContext, rating: 5, review_text: 'Lovely roast.' })).text, draft);

});
