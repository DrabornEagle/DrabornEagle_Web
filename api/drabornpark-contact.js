const DKD_CONTACT_URL='https://xpdiwyxnnrmyvpcqwuyb.supabase.co/functions/v1/drabornpark-public-contact';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method==='OPTIONS'){res.status(204).end();return;}
  if(req.method!=='POST'&&req.method!=='GET'){res.status(405).json({error:'method_not_allowed'});return;}
  try{
    let payload=req.method==='POST'?(req.body||{}):{action:'lookup',tagCode:String(req.query?.tag||'')};
    if(typeof payload==='string'){try{payload=JSON.parse(payload);}catch{payload={};}}
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    const upstream=await fetch(DKD_CONTACT_URL,{method:'POST',headers:{'Content-Type':'application/json','User-Agent':'DraBornPark-Web-Proxy/1.0.5'},body:JSON.stringify(payload),signal:controller.signal});
    clearTimeout(timeout);
    const text=await upstream.text();
    res.status(upstream.status).send(text||'{}');
  }catch(error){
    const timedOut=String(error?.name||'')==='AbortError';
    res.status(timedOut?504:502).json({error:timedOut?'upstream_timeout':'upstream_unavailable'});
  }
}
