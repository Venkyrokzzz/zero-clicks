const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto');
const root=process.env.ZC_TEST_REPO||path.resolve(__dirname,'..');
const ts=require(root+'/node_modules/typescript');
function fixture(inactive=0,active=1){
 let offset=0,failSave=false,planFailure=false;const rows=[],profiles=[],connections=[],replies=new Map();let writes=0;
 for(let i=0;i<inactive+active;i++){
  const user='user-'+i,resource=`accounts/${i}/locations/${i}/reviews/r1`;
  profiles.push({clerk_user_id:user,plan:'founding',subscription_status:i<inactive?'canceled':'active'});
  connections.push({clerk_user_id:user,account_id:'accounts/'+i,location_id:'locations/'+i,access_token:'fake',refresh_token:'fake',access_token_expires_at:new Date(Date.now()+86400000).toISOString()});
  rows.push({id:String(i).padStart(5,'0'),clerk_user_id:user,google_review_resource:resource,draft_response:'Thank you for visiting.',status:'approved',publication_blocked:false,posted_to_google_at:null,publish_claim_id:null,publish_claim_until:null});
 }
 const tables={reviews:rows,profiles,google_connections:connections};
 const supabase={from(name){let patch,limit=Infinity;const filters=[],orders=[];let columns;const q={
 select(c){columns=c;return q},eq(k,v){filters.push(r=>r[k]===v);return q},in(k,v){filters.push(r=>v.includes(r[k]));return q},is(k,v){filters.push(r=>(r[k]??null)===v);return q},
 or(exp){const [a,b]=exp.split(',');const field=a.split('.')[0],threshold=b.slice((field+'.lt.').length);filters.push(r=>r[field]==null||r[field]<threshold);return q},
 order(k,opt={}){orders.push([k,opt]);return q},limit(n){limit=n;return q},update(p){patch=p;return q},
 then(resolve){if(name==='profiles'&&planFailure)return Promise.resolve(resolve({data:null,error:{message:'fixture plan outage'}}));
 let data=tables[name].filter(r=>filters.every(f=>f(r)));data.sort((a,b)=>{for(const [k,opt] of orders){if(a[k]===b[k])continue;if(a[k]==null)return opt.nullsFirst?-1:1;if(b[k]==null)return opt.nullsFirst?1:-1;return (a[k]<b[k]?-1:1)*(opt.ascending===false?-1:1)}return 0});data=data.slice(0,limit);
 if(patch?.posted_to_google_at&&failSave){failSave=false;return Promise.resolve(resolve({data:null,error:{message:'fixture save outage'}}))}
 if(patch)data.forEach(r=>Object.assign(r,patch));
 // Copy returned values so concurrent requests cannot mutate another worker's snapshot.
 return Promise.resolve(resolve({data:data.map(r=>({...r})),error:null}));},single(){return q.maybeSingle()},async maybeSingle(){const r=await q;return {data:r.data?.[0]??null,error:r.error}}};return q;}};
 class Clock extends Date{constructor(...a){super(...(a.length?a:[Date.now()+offset]))}static now(){return Date.now()+offset}}
 const cache={};function load(file){if(cache[file])return cache[file];const exports={};cache[file]=exports;
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(root+'/'+file+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{
 exports,Buffer,AbortSignal,URL,URLSearchParams,Date:Clock,process:{env:{CRON_SECRET:'fake-cron'}},
 fetch:async(input,opt={})=>{assert.ok(input.startsWith('https://mybusiness.googleapis.com/v4/'));const resource=input.split('/v4/')[1].replace(/\/reply$/,'');if(opt.method==='PUT'){assert.equal(replies.has(resource),false,'duplicate write');writes++;const reply={comment:JSON.parse(opt.body).comment,reviewReplyState:'PENDING'};replies.set(resource,reply);return Response.json(reply)}return Response.json({name:resource,reviewReply:replies.get(resource)})},
 require(id){if(id==='next/server')return {NextResponse:Response};if(id==='server-only')return {};if(id==='crypto'||id==='node:crypto')return crypto;if(id==='@/lib/supabase'||id==='./supabase')return {supabase};if(id.startsWith('@/'))return load(id.slice(2));if(id.startsWith('./'))return load(path.posix.join(path.posix.dirname(file),id));throw Error(id)}
 });return exports}
 const fn=load('app/api/cron/post-replies/route').GET;
 return {rows,profiles,replies,get writes(){return writes},advance:n=>offset+=n,failSave:()=>failSave=true,failPlan:()=>planFailure=true,restorePlan:()=>planFailure=false,run:async()=>{const response=await fn(new Request('https://fixture.test/api/cron/post-replies',{headers:{authorization:'Bearer fake-cron'}}));return {status:response.status,...await response.json()}}};
}
test('20 inactive entries cannot hide an eligible approved reply',async()=>{const f=fixture(20,1),r=await f.run();assert.equal(r.status,200);assert.equal(r.posted,1);assert.equal(r.deferred,20);assert.equal(f.writes,1);assert.ok(f.rows.slice(0,20).every(x=>x.status==='approved'&&x.publish_claim_until&&x.publication_message.includes('Subscription inactive')))});
test('scan limit bounds work and later invocation reaches the eligible tail',async()=>{const f=fixture(250,1);const a=await f.run();assert.equal(a.total,200);assert.equal(a.stop_reason,'scan_limit');assert.equal(a.posted,0);const b=await f.run();assert.equal(b.posted,1);assert.equal(b.deferred,50);assert.equal(f.writes,1)});
test('two publishers drain a 25-reply backlog without duplicate writes',async()=>{const f=fixture(0,25);const r=await Promise.all([f.run(),f.run()]);assert.ok(r.every(x=>x.status===200&&x.attempts<=20));assert.equal(f.writes,25);assert.equal(f.rows.filter(x=>x.status==='sent').length,25)});
test('Google acceptance followed by save failure recovers without republishing',async()=>{const f=fixture();f.failSave();assert.equal((await f.run()).status,502);assert.equal(f.rows[0].status,'approved');f.advance(121000);assert.equal((await f.run()).posted,1);assert.equal(f.writes,1)});
test('subscription lookup failure defers safely, then recovers',async()=>{const f=fixture();f.failPlan();assert.equal((await f.run()).status,502);assert.equal(f.writes,0);assert.equal(f.rows[0].status,'approved');f.restorePlan();f.advance(301000);assert.equal((await f.run()).posted,1)});
test('inactive subscription reactivation resumes after deferral',async()=>{const f=fixture(1,0);assert.equal((await f.run()).deferred,1);f.profiles[0].subscription_status='active';f.advance(3601000);assert.equal((await f.run()).posted,1);assert.equal(f.writes,1)});
