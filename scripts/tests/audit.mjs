import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const source=await readFile('dist/server/index.js','utf8');
const worker=(await import('../../dist/server/index.js?audit='+Date.now())).default;
for(const page of ['index','account']){const html=await readFile('web/'+page+'.html','utf8');for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'duplicate IDs '+page)}
const db=new DatabaseSync(':memory:');db.exec(await readFile('drizzle/0000_business_data.sql','utf8'));db.exec(await readFile('drizzle/0001_catalogs.sql','utf8'));db.exec(await readFile('drizzle/0002_catalog_assets.sql','utf8'));
const DB={prepare(sql){let args=[];return {bind(...values){args=values;return this},async first(){return db.prepare(sql).get(...args)||null},async all(){return {results:db.prepare(sql).all(...args)}},async run(){return db.prepare(sql).run(...args)}}},async batch(statements){return Promise.all(statements.map(s=>s.run()))}};
const admin={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'admin@example.invalid'},client={'oai-authenticated-user-id':'client-a','oai-authenticated-user-email':'test@example.invalid'};
const req=(path,headers={},method='GET',body)=>worker.fetch(new Request('https://test.local'+path,{method,headers:{...headers,...(body?{'Content-Type':'application/json',Origin:'https://test.local'}:{})},body:body&&JSON.stringify(body)}),{DB,ADMIN_EMAIL:'admin@example.invalid'});
assert.equal((await req('/')).status,200);assert.equal((await req('/brand-mark.png')).headers.get('content-type'),'image/png');assert.equal((await req('/missing')).status,404);
assert.equal((await req('/api/account')).status,401);assert.equal((await req('/admin',client)).status,403);assert.equal((await req('/api/admin/dashboard',client)).status,403);assert.equal((await req('/internal/import-examples',{},'POST')).status,401);
assert.equal((await req('/api/account',admin)).status,200);
const seeded=await req('/internal/import-examples',{...admin,Origin:'https://test.local'},'POST');assert.equal(seeded.status,200);await req('/internal/import-examples',{...admin,Origin:'https://test.local'},'POST');
const demo=await (await req('/api/admin/dashboard?origem=ficticio',admin)).json();assert.equal(demo.clients,60);assert.equal(demo.orders,90);assert.equal((await (await req('/api/admin/dashboard',admin)).json()).clients,0);
assert.equal((await req('/api/client/profile',client,'POST',{segmento:'Teste',cidade:'Teste',uf:'SP',origem_dado:'ficticio'})).status,201);assert.equal((await (await req('/api/client/profile',client)).json()).profile.origem_dado,'real');assert.equal((await (await req('/api/client/profile',{'oai-authenticated-user-id':'client-b'})).json()).profile,null);assert.equal((await (await req('/api/admin/dashboard',admin)).json()).clients,1);
const csv=await (await req('/api/admin/export?table=clientes&origem=ficticio',admin)).text();assert.equal(csv.trim().split('\r\n').length,61);assert.equal((await req('/api/admin/records?table=invalid',admin)).status,400);
assert.equal((await req('/api/chat',{},'POST',{messages:[{role:'user',text:'Quais os planos?'}]})).status,401);
console.log('PASS: scripts, routes, admin/client permissions, protected import, idempotent seeds, real/fictitious metrics, client isolation, CSV export.');

const draft={name:'Loja <teste>',headline:'Coleção',theme:'natural',whatsapp:'5511999999999',products:[{name:'Produto <b>',price:10,category:'Itens',image:'https://example.com/a.jpg',description:'Teste'}]};
let made=await req('/api/catalogs',client,'POST',{draft,example:true});assert.equal(made.status,201);const created=await made.json(),id=created.id;
assert.equal((await req('/catalogo/'+id,client)).status,404);assert.equal((await req('/catalogo/'+id+'?preview=1',client)).status,200);
const other={'oai-authenticated-user-id':'other'};assert.equal((await req('/api/catalogs/'+id,other)).status,404);assert.equal((await req('/catalogo/'+id+'?preview=1',other)).status,404);
assert.equal((await req('/api/catalogs/'+id+'/review',client,'POST',{action:'approve',revision:1})).status,403);
assert.equal((await req('/api/catalogs/'+id+'/review',admin,'POST',{action:'approve',revision:1})).status,200);
let published=await (await req('/catalogo/'+id,client)).text();assert(published.includes('Loja &lt;teste&gt;'));assert(!published.includes('<b>'));
assert.equal((await req('/api/catalogs/'+id,client,'POST',{draft:{...draft,name:'Versão nova'},revision:1})).status,200);
assert.equal((await req('/api/catalogs/'+id+'/review',admin,'POST',{action:'approve',revision:1})).status,409);
assert((await (await req('/catalogo/'+id,client)).text()).includes('Loja &lt;teste&gt;'));
assert.equal((await req('/api/catalogs/'+id+'/review',admin,'POST',{action:'changes',revision:2,feedback:'Ajustar capa'})).status,200);
assert.equal((await req('/api/catalogs/'+id+'/review',admin,'POST',{action:'approve',revision:2})).status,200);
assert((await (await req('/catalogo/'+id,client)).text()).includes('Versão nova'));
assert.equal((await req('/api/catalogs/'+id+'/review',admin,'POST',{action:'unpublish',revision:2})).status,200);assert.equal((await req('/catalogo/'+id,client)).status,404);
assert.equal((await (await req('/api/catalogs/'+id,client)).json()).catalog.origem_dado,'real');
assert.equal((await req('/api/catalogs',client,'POST',{draft:{...draft,products:[{name:'X',price:5,image:'javascript:alert(1)'}]}})).status,400);
const editor=await readFile('web/catalogs.html','utf8');for(const match of editor.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
console.log('PASS: catalog generation, previews, isolation, approval, revision conflicts, published snapshots, changes, unpublish, real origin and image validation.');

const objects=new Map();const BUCKET={async put(k,b){objects.set(k,b)},async get(k){const b=objects.get(k);return b?{body:b}:null},async delete(k){objects.delete(k)}};
const photo=new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0]);
const upload=async(headers={},data=photo,type='image/png')=>worker.fetch(new Request('https://test.local/api/uploads',{method:'POST',headers:{...headers,Origin:'https://test.local','Content-Type':type},body:data}),{DB,BUCKET,ADMIN_EMAIL:'admin@example.invalid'});
assert.equal((await upload()).status,401);assert.equal((await upload(client,new Uint8Array(12),'image/svg+xml')).status,415);assert.equal((await upload(client,new Uint8Array(12))).status,415);
const uploaded=await upload(client);assert.equal(uploaded.status,201);const image=(await uploaded.json()).url;
const media=(headers={})=>worker.fetch(new Request('https://test.local'+image,{headers}),{DB,BUCKET,ADMIN_EMAIL:'admin@example.invalid'});assert.equal((await media()).status,404);assert.equal((await media(client)).status,200);assert.equal((await media(other)).status,404);
assert.equal((await req('/api/catalogs',other,'POST',{draft:{...draft,logo:image}})).status,400);
const withImage=await(await req('/api/catalogs',client,'POST',{draft:{...draft,logo:image,products:[{...draft.products[0],image}]}})).json();
assert.equal((await req('/catalogo/'+withImage.id)).status,404);await req('/api/catalogs/'+withImage.id+'/review',admin,'POST',{action:'approve',revision:1});assert.equal((await req('/catalogo/'+withImage.id)).status,200);assert.equal((await req('/catalogo/'+withImage.id+'?preview=1')).status,404);assert.equal((await media()).status,200);await req('/api/catalogs/'+withImage.id+'/review',admin,'POST',{action:'unpublish',revision:1});assert.equal((await media()).status,404);
console.log('PASS: uploads, signatures, image ownership, anonymous approved catalog, draft protection, unpublish revokes media access.');
// The provider response is mocked; no real account is created by these tests.
const realFetch=globalThis.fetch;let lookupEmail='client@example.invalid',verified=true;
const now=Math.floor(Date.now()/1000);const makeToken=(sub,aud='strategia-content')=>Buffer.from(JSON.stringify({alg:'RS256'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({aud,iss:'https://securetoken.google.com/'+aud,sub,email_verified:true,exp:now+3600,iat:now,auth_time:now})).toString('base64url')+'.test';
globalThis.fetch=async(url,opts)=>{assert(String(url).startsWith('https://identitytoolkit.googleapis.com/v1/accounts:lookup'));const t=JSON.parse(opts.body).idToken;const sub=JSON.parse(Buffer.from(t.split('.')[1],'base64url').toString()).sub;return new Response(JSON.stringify({users:[{localId:sub,email:lookupEmail,emailVerified:verified,displayName:'Teste'}]}),{headers:{'Content-Type':'application/json'}})};
try{
const session=await req('/auth/session',{},'POST',{idToken:makeToken('firebase-client')});assert.equal(session.status,200);const cookie=session.headers.get('set-cookie');assert(cookie.includes('HttpOnly; Secure; SameSite=Lax'));const authHeaders={Cookie:cookie.split(';')[0]};const me=await(await req('/api/account',authHeaders)).json();assert.equal(me.provider,'firebase');assert.equal(me.role,'client');assert.equal((await req('/api/admin/dashboard',authHeaders)).status,403);
lookupEmail='admin@example.invalid';verified=false;assert.equal((await req('/auth/session',{},'POST',{idToken:makeToken('unverified')})).status,401);verified=true;const ownerSession=await req('/auth/session',{},'POST',{idToken:makeToken('firebase-owner')});assert.equal((await ownerSession.json()).role,'admin');assert.equal((await req('/auth/session',{},'POST',{idToken:makeToken('other-project','other-project')})).status,401);assert.equal((await req('/auth/session',{},'POST',{idToken:'invalid'})).status,401);
const csrf=await worker.fetch(new Request('https://test.local/auth/session',{method:'POST',headers:{Origin:'https://evil.invalid','Content-Type':'application/json'},body:JSON.stringify({idToken:makeToken('csrf')})}),{DB,ADMIN_EMAIL:'admin@example.invalid'});assert.equal(csrf.status,403);const out=await req('/auth/logout',{...authHeaders,Origin:'https://test.local'},'POST');assert.equal(out.status,200);assert(out.headers.get('set-cookie').includes('Max-Age=0'));
}finally{globalThis.fetch=realFetch}
for(const match of (await readFile('web/auth.html','utf8')).matchAll(/<script(?: type="module")?>([\s\S]*?)<\/script>/g)){const script=match[1].replace(/^import .+$/gm,'');if(script.includes('await ')){await import('data:text/javascript,'+encodeURIComponent('export default function(){ return async function(){'+script+'}; }'))}else new vm.Script(script)}
console.log('PASS: Firebase client/admin roles, verified email, wrong project rejection, malformed token rejection, CSRF and secure logout (provider mocked).');
