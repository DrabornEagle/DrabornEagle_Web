import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/banana-edits/[route].js';
const response = () => ({ headers:{}, setHeader(key,value){this.headers[key]=value;}, status(code){this.code=code;return this;}, json(body){this.body=body;return this;}, send(body){this.body=body;return this;},end(){return this;} });
test('Pages can preflight the API; unrelated origins cannot reach the backend', async () => {
  let result=response();
  await handler({method:'OPTIONS',query:{route:'gemini-generate'},headers:{origin:'https://www.draborneagle.com',host:'draborneagleweb.vercel.app'}},result);
  assert.equal(result.code,204);
  assert.equal(result.headers['Access-Control-Allow-Origin'],'https://www.draborneagle.com');
  assert.equal(result.headers['Access-Control-Allow-Headers'],'Authorization, Content-Type');
  assert.equal(result.headers['Access-Control-Allow-Credentials'],undefined);
  result=response();
  await handler({method:'POST',query:{route:'gemini-generate'},headers:{origin:'https://unrelated.example.invalid',host:'draborneagleweb.vercel.app'}},result);
  assert.equal(result.code,403);
  assert.equal(result.headers['Access-Control-Allow-Origin'],undefined);
});
test('unconfigured web workspace opens locally and never submits AI requests', async () => {
  const previous=process.env.BANANA_WORKSPACE_ORIGIN; delete process.env.BANANA_WORKSPACE_ORIGIN;
  try {
    let result=response(); await handler({method:'GET',query:{route:'workspace-config'},headers:{}},result);
    assert.equal(result.code,200);assert.deepEqual(result.body,{mode:'browser'});
    result=response(); await handler({method:'POST',query:{route:'openai-image-enqueue'},headers:{},body:{}},result);
    assert.equal(result.code,503);assert.equal(result.body.code,'BANANA_SETUP_REQUIRED');
    result=response(); await handler({method:'POST',query:{route:'arbitrary-admin-action'},headers:{}},result);assert.equal(result.code,404);
    result=response(); await handler({method:'PATCH',query:{route:'workspace-config'},headers:{}},result);assert.equal(result.code,405);
  } finally {if(previous===undefined)delete process.env.BANANA_WORKSPACE_ORIGIN;else process.env.BANANA_WORKSPACE_ORIGIN=previous;}
});
test('cloud bridge uses only its fixed HTTPS origin and rejects redirects', async () => {
  const previous=process.env.BANANA_WORKSPACE_ORIGIN, originalFetch=globalThis.fetch;
  try {
    process.env.BANANA_WORKSPACE_ORIGIN='http://example.invalid';let result=response();await handler({method:'GET',query:{route:'workspace-config'},headers:{}},result);assert.equal(result.code,502);
    process.env.BANANA_WORKSPACE_ORIGIN='https://example.invalid';let captured;
    globalThis.fetch=async(url,options)=>{captured={url:url.href,options};return new Response('{}',{status:200,headers:{'content-type':'application/json'}});};
    result=response();await handler({method:'GET',query:{route:'fal-status',requestId:'safe id'},headers:{host:'www.example.invalid',authorization:'Bearer synthetic-user-token'}},result);
    assert.equal(captured.url,'https://example.invalid/api/fal-status?requestId=safe+id');assert.equal(captured.options.redirect,'error');assert.equal(captured.options.headers.Authorization,'Bearer synthetic-user-token');assert.equal(result.code,200);
  } finally {globalThis.fetch=originalFetch;if(previous===undefined)delete process.env.BANANA_WORKSPACE_ORIGIN;else process.env.BANANA_WORKSPACE_ORIGIN=previous;}
});
