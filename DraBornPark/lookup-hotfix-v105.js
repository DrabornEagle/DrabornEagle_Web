/* DraBornPark v1.0.5 — robust public tag lookup transport.
   Lookup requests bypass the layered fetch interceptors via XHR, are deduplicated,
   and time out instead of leaving the public page on the loading screen forever. */
(function(){
  const dkd_contact_part='/functions/v1/drabornpark-public-contact';
  const dkd_previous_fetch=window.fetch.bind(window);
  const dkd_lookup_cache=new Map();

  function dkd_parse_action(dkd_init){
    try{
      if(typeof dkd_init?.body!=='string')return '';
      return String(JSON.parse(dkd_init.body)?.action||'');
    }catch{return '';}
  }

  function dkd_lookup_key(dkd_init){
    try{
      const dkd_payload=JSON.parse(String(dkd_init?.body||'{}'));
      return String(dkd_payload?.tagCode||'').trim().toLowerCase();
    }catch{return '';}
  }

  function dkd_xhr_lookup(dkd_url,dkd_init){
    const dkd_key=dkd_lookup_key(dkd_init)||String(dkd_init?.body||'lookup');
    const dkd_now=Date.now();
    const dkd_cached=dkd_lookup_cache.get(dkd_key);
    if(dkd_cached&&dkd_now-dkd_cached.createdAt<5000)return dkd_cached.promise;

    const dkd_promise=new Promise((dkd_resolve,dkd_reject)=>{
      const dkd_xhr=new XMLHttpRequest();
      dkd_xhr.open('POST',dkd_url,true);
      dkd_xhr.timeout=12000;
      dkd_xhr.setRequestHeader('Content-Type','application/json');
      dkd_xhr.onload=()=>{
        const dkd_status=Number(dkd_xhr.status||0);
        const dkd_text=String(dkd_xhr.responseText||'');
        if(!dkd_status){dkd_reject(new TypeError('Etiket servisine ulaşılamadı.'));return;}
        dkd_resolve({status:dkd_status,statusText:dkd_xhr.statusText||'',text:dkd_text});
      };
      dkd_xhr.onerror=()=>dkd_reject(new TypeError('Etiket servisine bağlanılamadı.'));
      dkd_xhr.ontimeout=()=>dkd_reject(new TypeError('Etiket doğrulama zaman aşımına uğradı.'));
      try{dkd_xhr.send(String(dkd_init?.body||'{}'));}catch(dkd_error){dkd_reject(dkd_error);}
    });
    dkd_lookup_cache.set(dkd_key,{createdAt:dkd_now,promise:dkd_promise});
    dkd_promise.catch(()=>{const dkd_current=dkd_lookup_cache.get(dkd_key);if(dkd_current?.promise===dkd_promise)dkd_lookup_cache.delete(dkd_key);});
    return dkd_promise;
  }

  window.fetch=async function(dkd_input,dkd_init){
    const dkd_url=typeof dkd_input==='string'?dkd_input:String(dkd_input?.url||'');
    if(dkd_url.includes(dkd_contact_part)&&dkd_parse_action(dkd_init)==='lookup'){
      const dkd_result=await dkd_xhr_lookup(dkd_url,dkd_init);
      return new Response(dkd_result.text,{status:dkd_result.status,statusText:dkd_result.statusText,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
    }
    return dkd_previous_fetch(dkd_input,dkd_init);
  };
})();
