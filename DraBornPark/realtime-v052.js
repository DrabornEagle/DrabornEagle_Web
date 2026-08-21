/* DraBornPark v0.5.2 — realtime-only bridge. Does not alter production layout. */
(function(){
  const SUPABASE_URL='https://xpdiwyxnnrmyvpcqwuyb.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_cu71JQGPiRusMw_YeZzUbg_6r9r13TG';
  const CONTACT_URL=SUPABASE_URL+'/functions/v1/drabornpark-public-contact';
  const CONTACT_PATH='/functions/v1/drabornpark-public-contact';
  const nativeFetch=window.fetch.bind(window);
  let client=null;
  let channel=null;
  let sessionToken='';
  let fallbackTimer=null;
  let refreshBusy=false;

  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const clock=value=>new Date(value||Date.now()).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});

  function renderMessages(messages){
    const box=document.getElementById('dbp47-messages');
    if(!box)return;
    box.innerHTML=(messages||[]).map(message=>`<div class="dbp47-bubble ${message.sender_role==='owner'?'is-owner':'is-visitor'}"><span>${message.sender_role==='owner'?'ARAÇ SAHİBİ':'SİZ'}</span><p>${esc(message.body_safe)}</p><small>${clock(message.created_at)}</small></div>`).join('');
    box.scrollTop=box.scrollHeight;
  }

  async function refreshChat(){
    if(!sessionToken||refreshBusy)return;
    refreshBusy=true;
    try{
      const response=await nativeFetch(CONTACT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'status',sessionToken})});
      if(!response.ok)return;
      const data=await response.json();
      renderMessages(data.messages||[]);
    }catch{}
    finally{refreshBusy=false;}
  }

  async function getClient(){
    if(client)return client;
    const module=await import('https://esm.sh/@supabase/supabase-js@2.112.3');
    client=module.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    return client;
  }

  async function connectRealtime(token){
    const clean=String(token||'').trim();
    if(!clean)return;
    sessionToken=clean;
    try{sessionStorage.setItem('dkd_drabornpark_session_v052',clean);}catch{}
    if(fallbackTimer){clearInterval(fallbackTimer);fallbackTimer=null;}
    fallbackTimer=setInterval(refreshChat,1500);
    try{
      const supabase=await getClient();
      if(channel){await supabase.removeChannel(channel);channel=null;}
      channel=supabase
        .channel(`drabornpark-session:${clean}`,{config:{private:false}})
        .on('broadcast',{event:'message'},()=>{void refreshChat();})
        .subscribe(status=>{
          if(status==='SUBSCRIBED')void refreshChat();
        });
    }catch{
      void refreshChat();
    }
  }

  function parseAction(init){
    try{
      if(typeof init?.body!=='string')return '';
      return String(JSON.parse(init.body)?.action||'');
    }catch{return '';}
  }

  window.fetch=async function(input,init){
    const response=await nativeFetch(input,init);
    try{
      const url=typeof input==='string'?input:String(input?.url||'');
      if(url.includes(CONTACT_PATH)){
        const action=parseAction(init);
        const data=await response.clone().json().catch(()=>null);
        if(response.ok&&action==='notify'&&data?.sessionToken)void connectRealtime(data.sessionToken);
        if(response.ok&&action==='status'&&Array.isArray(data?.messages))renderMessages(data.messages);
        if(response.ok&&action==='chat')setTimeout(()=>{void refreshChat();},0);
      }
    }catch{}
    return response;
  };

  window.addEventListener('focus',()=>{void refreshChat();});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void refreshChat();});
  window.addEventListener('beforeunload',()=>{if(fallbackTimer)clearInterval(fallbackTimer);});
})();
