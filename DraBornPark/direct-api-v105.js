/* DraBornPark v1.0.5 — force public tag traffic directly to Supabase Edge Function.
   The custom draborneagle.com host serves static files and does not expose Vercel /api functions. */
(function(){
  const DKD_LOCAL_API='/api/drabornpark-contact';
  const DKD_PUBLIC_API='https://xpdiwyxnnrmyvpcqwuyb.supabase.co/functions/v1/drabornpark-public-contact';
  const dkd_open=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(method,url){
    const args=Array.from(arguments);
    if(String(url||'').includes(DKD_LOCAL_API))args[1]=DKD_PUBLIC_API;
    return dkd_open.apply(this,args);
  };
})();
