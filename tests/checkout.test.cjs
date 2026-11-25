const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

test('pricing checkout preserves trial and founding gates and uses the correct Stripe prices', async () => {
  const routePath = resolve(__dirname, '../app/api/checkout/route.ts');
  const { outputText } = ts.transpileModule(readFileSync(routePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  });
  const post = {};
  let userId;
  let profile = { business_name: 'Fixture Arms', plan: 'trial', stripe_customer_id: 'cus_fixture' };
  let publishedCount = 0;
  let subscriptions = [];
  let openSessions = [];
  const sessions = [];
  class FakeStripe {
    subscriptions = { list: async () => ({ data: subscriptions }) };
    checkout = {
      sessions: {
        list: async () => ({ data: openSessions }),
        create: async (args, options) => {
          sessions.push(args);
          assert.match(options.idempotencyKey, /^checkout-fixture-/);
          return { url: 'https://checkout.stripe.com/c/pay/fixture' };
        },
      },
    };
  }
  const supabase = {
    from(table) {
      const query = {
        select: () => query,
        eq: (_, owner) => { assert.equal(owner, 'fixture'); return query; },
        single: async () => ({ data: profile }),
        maybeSingle: async () => ({ data: profile }),
        not: async () => {
          assert.equal(table, 'reviews');
          return { count: publishedCount };
        },
      };
      return query;
    },
  };
  const dependencies = {
    '@clerk/nextjs/server': { auth: async () => ({ userId }), currentUser: async () => ({}) },
    'next/server': { NextResponse: Response },
    stripe: FakeStripe,
    '@/lib/supabase': { supabase },
    '@/lib/stripe-portal': {
      createCustomerPortal: async () => ({ url: 'https://billing.stripe.com/p/session/fixture' }),
    },
    '@/lib/foundingConfig': { FOUNDING_OPEN: true },
  };
  vm.runInNewContext(outputText, {
    exports: post,
    require: name => dependencies[name] ?? assert.fail(name),
    process: { env: { NEXT_PUBLIC_SITE_URL: 'https://zero-clicks.test', STRIPE_SECRET_KEY: 'mock-key' } },
    console,
  });
  const checkout = (plan, startPaidPlanNow) => post.POST(new Request('https://zero-clicks.test/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan, startPaidPlanNow }),
  }));

  assert.equal((await checkout('standard')).status, 401);
  userId = 'fixture';
  assert.equal((await checkout(['standard'])).status, 400);
  profile = null;
  assert.equal((await (await checkout('standard')).json()).code, 'ONBOARDING_REQUIRED');
  profile = { business_name: 'Fixture Arms', plan: 'trial', stripe_customer_id: 'cus_fixture', trial_ends_at: '2099-01-01' };
  assert.equal((await (await checkout('standard')).json()).kind, 'trial_active');
  assert.equal((await (await checkout('founding', true)).json()).kind, 'trial_active');
  assert.equal(sessions.length, 0);
  assert.equal((await (await checkout('standard', true)).json()).kind, 'checkout');
  profile.trial_ends_at = '2025-01-01';
  assert.equal((await (await checkout('founding')).json()).code, 'FIRST_REPLY_REQUIRED');
  assert.deepEqual(JSON.parse(JSON.stringify(sessions[0].line_items)), [
    { price: 'price_1TdrHfFkh5HZgB7WbtJAkjKC', quantity: 1 },
    { price: 'price_1TdrRSFkh5HZgB7WDd9Dr30i', quantity: 1 },
  ]);
  assert.equal(sessions[0].cancel_url, 'https://zero-clicks.test/pricing#pricing');
  publishedCount = 1;
  openSessions = [{ mode: 'subscription', metadata: { plan: 'standard' }, url: 'https://checkout.stripe.com/c/pay/previous' }];
  assert.equal((await (await checkout('founding')).json()).code, 'OTHER_CHECKOUT_OPEN');
  assert.match((await (await checkout('standard')).json()).url, /previous$/);
  openSessions = [];
  assert.equal((await (await checkout('founding')).json()).kind, 'checkout');
  assert.deepEqual(JSON.parse(JSON.stringify(sessions[1].line_items)), [
    { price: 'price_1TdrIeFkh5HZgB7Wnk8RozCn', quantity: 1 },
  ]);
  subscriptions = [{ status: 'active' }];
  assert.equal((await (await checkout('standard')).json()).kind, 'portal');
  assert.equal(sessions.length, 2);
});
