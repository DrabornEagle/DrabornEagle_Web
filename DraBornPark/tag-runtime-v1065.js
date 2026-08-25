(()=>{
  'use strict';
  const dkdTag=String(globalThis.DKDBP_PATH_TAG||'').trim();
  if(!dkdTag)return;
  const dkdTtl=30*60*1000;
  const dkdSessionKey=`dbp-contact-v106:${dkdTag}`;
  const dkdMetaKey=`dbp-contact-v106-meta:${dkdTag}`;
  const dkdLegacyKeys=[`dbp-contact-v105:${dkdTag}`,`dbp-contact-v104:${dkdTag}`,`dbp-contact-v103:${dkdTag}`];
  const dkdOriginalSet=Storage.prototype.setItem;
  const dkdOriginalRemove=Storage.prototype.removeItem;
  let dkdExpiryTimer=0;

  function dkdReadMeta(){
    try{
      const dkdRaw=localStorage.getItem(dkdMetaKey);
      if(!dkdRaw)return null;
      const dkdMeta=JSON.parse(dkdRaw);
      const dkdExpiresAt=Number(dkdMeta?.expiresAt||0);
      return Number.isFinite(dkdExpiresAt)&&dkdExpiresAt>0?{expiresAt:dkdExpiresAt}:null;
    }catch{return null;}
  }
  function dkdWriteMeta(dkdExpiresAt){
    try{dkdOriginalSet.call(localStorage,dkdMetaKey,JSON.stringify({expiresAt:dkdExpiresAt,ttlMs:dkdTtl}));}catch{}
  }
  function dkdClearSession(dkdReload=false){
    try{dkdOriginalRemove.call(localStorage,dkdSessionKey);dkdOriginalRemove.call(localStorage,dkdMetaKey);}catch{}
    if(dkdExpiryTimer)clearTimeout(dkdExpiryTimer);
    dkdExpiryTimer=0;
    if(dkdReload){
      const dkdUrl=location.pathname+location.search+location.hash;
      location.replace(dkdUrl);
    }
  }
  function dkdScheduleExpiry(){
    if(dkdExpiryTimer)clearTimeout(dkdExpiryTimer);
    const dkdMeta=dkdReadMeta();
    if(!dkdMeta)return;
    const dkdRemaining=dkdMeta.expiresAt-Date.now();
    if(dkdRemaining<=0){dkdClearSession(true);return;}
    dkdExpiryTimer=setTimeout(()=>dkdClearSession(true),Math.min(dkdRemaining,2147483647));
  }
  function dkdEnsureMeta(){
    const dkdMeta=dkdReadMeta();
    if(dkdMeta&&dkdMeta.expiresAt>Date.now()){dkdScheduleExpiry();return dkdMeta.expiresAt;}
    const dkdExpiresAt=Date.now()+dkdTtl;
    dkdWriteMeta(dkdExpiresAt);
    dkdScheduleExpiry();
    return dkdExpiresAt;
  }

  try{for(const dkdKey of dkdLegacyKeys)localStorage.removeItem(dkdKey);}catch{}
  try{
    const dkdExisting=localStorage.getItem(dkdSessionKey);
    const dkdMeta=dkdReadMeta();
    if(dkdExisting&&(!dkdMeta||dkdMeta.expiresAt<=Date.now()))dkdClearSession(false);
    else if(dkdExisting)dkdScheduleExpiry();
  }catch{}

  Storage.prototype.setItem=function(dkdKey,dkdValue){
    const dkdResult=dkdOriginalSet.call(this,dkdKey,dkdValue);
    if(this===localStorage&&dkdKey===dkdSessionKey)dkdEnsureMeta();
    return dkdResult;
  };
  Storage.prototype.removeItem=function(dkdKey){
    const dkdResult=dkdOriginalRemove.call(this,dkdKey);
    if(this===localStorage&&dkdKey===dkdSessionKey){
      try{dkdOriginalRemove.call(localStorage,dkdMetaKey);}catch{}
      if(dkdExpiryTimer)clearTimeout(dkdExpiryTimer);
      dkdExpiryTimer=0;
    }
    return dkdResult;
  };

  function dkdFormatRemaining(){
    const dkdMeta=dkdReadMeta();
    if(!dkdMeta)return '30:00';
    const dkdSeconds=Math.max(0,Math.ceil((dkdMeta.expiresAt-Date.now())/1000));
    const dkdMinutes=Math.floor(dkdSeconds/60);
    const dkdRemainder=String(dkdSeconds%60).padStart(2,'0');
    return `${dkdMinutes}:${dkdRemainder}`;
  }
  function dkdSetText(dkdNode,dkdValue){if(dkdNode&&dkdNode.textContent!==dkdValue)dkdNode.textContent=dkdValue;}
  function dkdArrangeComposer(){
    const dkdSuccess=document.getElementById('dp-success');
    if(dkdSuccess){
      if(!dkdSuccess.hidden)dkdSuccess.hidden=true;
      if(dkdSuccess.getAttribute('aria-hidden')!=='true')dkdSuccess.setAttribute('aria-hidden','true');
    }
    const dkdHistory=document.querySelector('.dp-direct-history');
    const dkdTextarea=document.getElementById('dp-direct-text');
    if(dkdHistory&&dkdTextarea&&dkdTextarea.parentNode&&dkdHistory.nextElementSibling!==dkdTextarea){
      dkdTextarea.parentNode.insertBefore(dkdHistory,dkdTextarea);
    }
    const dkdHead=dkdHistory?.querySelector('.dp-direct-history-head');
    if(dkdHead){
      const dkdTitle=dkdHead.querySelector('span');
      dkdSetText(dkdTitle,'GÜVENLİ MESAJLAŞMA');
      let dkdCountdown=dkdHead.querySelector('.dkd-session-countdown');
      if(!dkdCountdown){dkdCountdown=document.createElement('b');dkdCountdown.className='dkd-session-countdown';dkdHead.appendChild(dkdCountdown);}
      const dkdHasSession=Boolean(localStorage.getItem(dkdSessionKey));
      dkdSetText(dkdCountdown,dkdHasSession?`OTURUM ${dkdFormatRemaining()}`:'30 DK OTURUM');
    }
  }

  const dkdObserver=new MutationObserver(dkdArrangeComposer);
  dkdObserver.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  document.addEventListener('DOMContentLoaded',dkdArrangeComposer,{once:true});
  addEventListener('pageshow',()=>{
    const dkdMeta=dkdReadMeta();
    if(dkdMeta&&dkdMeta.expiresAt<=Date.now()){dkdClearSession(true);return;}
    dkdScheduleExpiry();dkdArrangeComposer();
  });
  setInterval(()=>{
    const dkdMeta=dkdReadMeta();
    if(dkdMeta&&dkdMeta.expiresAt<=Date.now()){dkdClearSession(true);return;}
    dkdArrangeComposer();
  },1000);
})();
