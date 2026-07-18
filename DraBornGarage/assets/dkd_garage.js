(() => {
  'use strict';
  const d=window.DKD;
  let refreshTimer=null;

  async function syncSession(session){
    d.state.session=session;
    if(session?.user){
      await d.loadWorkspace();
      installRealtime();
    }else{
      d.clearRealtime();
      d.state.profile=null;d.state.memberships=[];d.state.workshops=[];d.state.workshop=null;d.state.membership=null;d.state.customerWorkshops=[];d.state.customerWorkshop=null;
    }
  }

  function installRealtime(){
    d.clearRealtime();
    const w=d.state.workshop;
    if(!w?.id)return;
    const refresh=()=>{
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(()=>{
        if(location.pathname.startsWith(`${d.BASE}/panel`)) d.renderRoute(true).catch(d.handleFatal);
      },450);
    };
    const channel=d.client.channel(`draborngarage-web-${w.id}-${d.state.session.user.id}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'work_orders',filter:`workshop_id=eq.${w.id}`},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'appointments',filter:`workshop_id=eq.${w.id}`},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'payments',filter:`workshop_id=eq.${w.id}`},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'workshop_members',filter:`workshop_id=eq.${w.id}`},async()=>{await d.loadWorkspace(w.id);refresh();})
      .subscribe();
    d.addRealtime(channel);
  }

  async function boot(){
    try{
      const {data,error}=await d.client.auth.getSession();
      if(error)throw error;
      await syncSession(data.session);
      d.state.ready=true;
      await d.renderRoute(true);
      d.client.auth.onAuthStateChange(async(event,session)=>{
        await syncSession(session);
        if(event==='SIGNED_OUT')d.navigate('/',true);
        else if(['SIGNED_IN','USER_UPDATED','TOKEN_REFRESHED'].includes(event)&&location.pathname.includes('/giris'))d.navigate('/panel',true);
      });
    }catch(error){d.state.ready=true;d.handleFatal(error);}
  }

  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'&&d.state.session&&location.pathname.startsWith(`${d.BASE}/panel`))d.renderRoute(true).catch(()=>{});
  });
  window.addEventListener('online',()=>d.toast('Bağlantı geri geldi','Veriler yenileniyor.','success'));
  window.addEventListener('offline',()=>d.toast('İnternet bağlantısı yok','Kayıt işlemleri bağlantı gelene kadar çalışmayabilir.','error'));
  boot();
})();
