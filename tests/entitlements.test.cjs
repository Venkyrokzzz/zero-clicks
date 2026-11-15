const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const output = ts.transpileModule(fs.readFileSync('lib/entitlements.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context = {exports:{}}; vm.runInNewContext(output, context);
const access=context.exports.hasServiceAccess;
const now=Date.parse('2026-11-14T00:00:00Z');
assert.equal(access(null,now),false);
for(const plan of ['founding','standard','pro','starter']) {
 assert.equal(access({plan,subscription_status:'active'},now),true);
 for(const status of ['past_due','unpaid','canceled','incomplete',null]) assert.equal(access({plan,subscription_status:status},now),false);
 assert.equal(access({plan,subscription_status:'active',trial_paused:true},now),false);
}
assert.equal(access({plan:'trial',trial_ends_at:'2026-11-15T00:00:00Z'},now),true);
assert.equal(access({plan:'trial',trial_ends_at:'2026-11-14T00:00:00Z'},now),false);
assert.equal(access({plan:'trial',trial_ends_at:'bad-date'},now),false);
assert.equal(access({plan:'cancelled',subscription_status:'active'},now),false);
console.log('Passed: paid plans, unpaid states, paused accounts, trial expiry and malformed dates');

const googleContext={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/googleReviews.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,googleContext);
const g=googleContext.exports;
['ONE','TWO','THREE','FOUR','FIVE'].forEach((v,i)=>assert.equal(g.googleRating(v),i+1));
assert.equal(g.googleRating('ONE_STAR'),undefined);
assert.equal(g.googleReplyUrl('accounts/123','locations/456','accounts/123/locations/456/reviews/abc'),'https://mybusiness.googleapis.com/v4/accounts/123/locations/456/reviews/abc/reply');
assert.throws(()=>g.googleReplyUrl('123','456',''));
console.log('Passed: Google ratings, full resource names, reply URL and missing identifiers');

const businessContext={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/googleBusiness.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,businessContext);
const choose=businessContext.exports.chooseMatchingLocation;
const locations=[
 {accountId:'accounts/1',locationId:'locations/1',name:'The Old Fountain',address:'London'},
 {accountId:'accounts/2',locationId:'locations/2',name:'The Pineapple',address:'London'},
];
assert.equal(choose([locations[0]],''),locations[0]);
assert.equal(choose(locations,'the old fountain'),locations[0]);
assert.equal(choose(locations,'London'),null);
console.log('Passed: Google Business Profile location selection rules');
