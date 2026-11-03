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
test('redirect only accepts internal destinations', async () => {
  const { safeRedirectPath }=await import('../lib/safe-redirect.js');
  for(const input of ['https://evil.example','//evil.example','/\\evil.example','javascript:alert(1)','/\nevil.example',null]) assert.equal(safeRedirectPath(input),'/profile');
  assert.equal(safeRedirectPath('/articles?q=React'),'/articles?q=React');
});

function callback(exchange) {
  const context = { URL, NextResponse: { redirect: (url) => url.toString() },
    safeRedirectPath: (path, fallback = '/') => typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? path : fallback,
    createClient: async () => ({auth: {exchangeCodeForSession: exchange}}) };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app/auth/callback/route.js','utf8').replace(/^import .*;\r?\n/gm,'').replace(/export /g,''), context);
  return (query = '') => context.GET({url: 'http://localhost:3001/auth/callback' + query});
}
test('direct callback opens login without false error', async () => {
  const result = new URL(await callback(() => {throw new Error('must not exchange');})());
  assert.equal(result.pathname, '/login'); assert.equal(result.searchParams.has('error'), false);
});
test('provider denial is shown as a login error', async () => {
  const result = new URL(await callback(() => {})('?error=access_denied'));
  assert.equal(result.searchParams.get('error'), 'auth_callback');
});
test('session exchange failure does not open profile', async () => {
  const result = new URL(await callback(async () => ({error: new Error('expired code')}))('?code=test&next=/profile'));
  assert.equal(result.pathname, '/login'); assert.equal(result.searchParams.get('error'), 'auth_callback');
});
test('successful exchange returns to requested internal page', async () => {
  const result = new URL(await callback(async () => ({error: null}))('?code=test&next=/articles/new'));
  assert.equal(result.pathname, '/articles/new');
});
