const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup(responses) {
  const queue = [...responses];
  const req = new Proxy({}, { get: (_, key) => key === 'then'
    ? (resolve, reject) => Promise.resolve(queue.shift()).then(resolve, reject)
    : () => req });
  const context = { process: {env: {NEXT_PUBLIC_SUPABASE_URL:'https://test.supabase.co',NEXT_PUBLIC_SUPABASE_ANON_KEY:'x'.repeat(30)}},
    createClient: () => ({from: () => req}), initialArticles:[{id:'demo',title:'React',summary:'demo',category:'Frontend',likes_count:2}], initialComments:[] };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('lib/articles.js','utf8').replace(/^import .*;\r?\n/gm,'').replace(/export /g,''),context);
  return context;
}
test('empty real search stays empty', async () => {
  assert.equal((await setup([{data:[],error:null}]).getArticles({query:'React'})).length,0);
});
test('list and detail derive real like counts', async () => {
  const c=setup([{data:[{id:'a',likes:[{count:4}]}],error:null},{data:{id:'a',likes:[{count:4}]},error:null}]);
  assert.equal((await c.getArticles())[0].likes_count,4);
  assert.equal((await c.getArticleById('a')).likes_count,4);
});
test('missing real article is not replaced by a demo', async () => {
  assert.equal(await setup([{data:null,error:null}]).getArticleById('demo'),null);
});
test('like insertion failure is propagated', async () => {
  await assert.rejects(setup([{data:null,error:null},{error:new Error('RLS denied')}]).toggleLike('a','u'),/RLS denied/);
});
test('like deletion failure is propagated', async () => {
  await assert.rejects(setup([{data:{id:'l'},error:null},{error:new Error('delete denied')}]).toggleLike('a','u'),/delete denied/);
});
test('like read failure cannot trigger a write', async () => {
  await assert.rejects(setup([{data:null,error:new Error('read denied')}]).toggleLike('a','u'),/read denied/);
});
test('existing like and count are loaded', async () => {
  const state=await setup([{count:5,error:null},{data:{id:'l'},error:null}]).getArticleLikes('a','u');
  assert.equal(state.count,5); assert.equal(state.userHasLiked,true);
});
test('demo like can be added and removed', async () => {
  const c=setup([]); c.process.env={};
  assert.equal((await c.toggleLike('demo','u')).count,3);
  assert.equal((await c.getArticleLikes('demo','u')).userHasLiked,true);
  assert.equal((await c.toggleLike('demo','u')).count,2);
});
test('redirect only accepts internal destinations', async () => {
  const { safeRedirectPath }=await import('../lib/safe-redirect.js');
  for(const input of ['https://evil.example','//evil.example','/\\evil.example','javascript:alert(1)','/\nevil.example',null]) assert.equal(safeRedirectPath(input),'/profile');
  assert.equal(safeRedirectPath('/articles?q=React'),'/articles?q=React');
});
