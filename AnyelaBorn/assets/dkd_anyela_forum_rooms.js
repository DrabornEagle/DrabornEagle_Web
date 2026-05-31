(function dkdAnyelaForumRoomsScope(){
  'use strict';

  const dkdForumSupabaseUrl='https://ztxlcfcwuwerxrhwfmte.supabase.co';
  const dkdForumSupabaseKey='sb_publishable_GSd5xFBwG9pioOY8N6MRQw_C2n7RLYa';
  const dkdForumScriptSrc='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  const dkdForumPackagesUrl='https://www.draborneagle.com/AnyelaBorn/ChatRoom/';
  const dkdForumAvatarDataUrl='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAk0klEQVR42u28eZBk13Xe+Tv33rdlvszKrK2regG6sRINEqQEgRQXsSHZkihRY8saFSSKlkRqxlJ4bEWYnvEsGtvFCodt2maMw6EZOLxIY0ZIQQ1KHoY8kocSFSRKorgKIACSTRBEA92NXmuvXN9yl/njVdOkIhQzBhqL7MmIjKruqK7O/PKc833nO+deeI08VkCvrKxoRL7971dW9MrKil5dRfH/P/7Ux7eCk58+3r3je++/93bA/ImfkxXQf+LnX9WHvNovYBXUGvi7+unb548e/RsLc7NvyzvdxeWjxyRNk89pW35w89qVg87c0tV//CsfvUTwf/L1h/8sAVxdRX3+83dEH//4s+X9tx374dvuPPVbi4tLxjsL3rF97SpGHKNpxf5wTK/XG/dnOk9949y5f621+dxnnr501nvPysqKXl9fd//ZALiysqIfeeQRLyIB4L77jrTvXLjjubnFhcVrl16o8ZXZ3t5lNJliPaFyjnaaqMRoBpOSWAuzMzO+1e088u8/8+T7gBLQq6uEtTX8f9IArq6ibrzJP/fA698605t9a7sz84Ct7U9evXTeh3qstvcGTCpPlsbUPhB8QCSQGRMmtfOt2LA4k6l+tysHg8EXl4/Mf+Ajn3jsj258OK90NMorGXnr6+vu+9/8hh/vzy1+wHn/tul4QNbKqao6RNRy7fp1ru8NqZ0niQ1FWVM7TyuJcD6QaqHbihECV3eGvhVHqp8ndNqt3108essv/frv/uHjrzSI+pUE711vvve/Wphf+LUgnNja3g5bu3tud2cnGC1K6ZiD4ZjRtMQjtNKEnYMx7VZGbT1ppGglBusVT1/ZwwZEae23DsaI93cszvfff+Yd333+33z0N59cWVnRZ8+eDf9JALi6uqoefvhh//3f9brXnzx1228EMdH169f93t6uLotStVotlUQxw+GQ/dGI854sSZhWNc6D1ppjC3MMpjVBNLWtybOE3eFUjI6k8sGO9nfN8sLsj739rW8597//+iNPnjlzxly4cOFlr4nqlSgRx48fz+49fe8jC4sLvdHgAIU37TRhpp1RFSVlWeJsjVKabjulncQ4WzPbaTOZTpkWJfvjgroqORgMyOKYSVnTzWJOLnY5Ptsx7TQJl58/F6rB9i+v/MB3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';
  let dkdForumClient=null;
  let dkdForumTimerInterval=null;
  let dkdForumAccessState={dkd_can_send_message:true,dkd_free_message_remaining:5};

  function dkdForumEnsureSupabase(dkd_callback){
    if(window.supabase&&window.supabase.createClient){dkd_callback();return;}
    const dkd_existing=Array.from(document.scripts).find(function(dkd_script){return dkd_script.src===dkdForumScriptSrc;});
    if(dkd_existing){dkd_existing.addEventListener('load',dkd_callback,{once:true});return;}
    const dkd_script=document.createElement('script');
    dkd_script.src=dkdForumScriptSrc;
    dkd_script.onload=dkd_callback;
    document.head.appendChild(dkd_script);
  }

  function dkdForumGetClient(){
    if(dkdForumClient){return dkdForumClient;}
    if(!window.supabase||!window.supabase.createClient){return null;}
    dkdForumClient=window.supabase.createClient(dkdForumSupabaseUrl,dkdForumSupabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'dkd_anyela_auth_session'}});
    return dkdForumClient;
  }

  function dkdForumInjectStyle(){
    if(document.getElementById('dkd_anyela_forum_rooms_style')){return;}
    const dkd_style=document.createElement('style');
    dkd_style.id='dkd_anyela_forum_rooms_style';
    dkd_style.textContent='[aria-label="Sohbet odaları"],.dkd_anyela_chat_tabs{display:none!important}.dkd_anyela_chat_hero .dkd_anyela_chat_live_badge{display:none!important}.dkd_anyela_chat_section[aria-label="Canlı sohbet"],.dkd_anyela_forum_live_first{width:calc(100% + 16px)!important;margin-left:-8px!important;margin-right:-8px!important;padding:20px!important;border-radius:30px!important;background:radial-gradient(circle at 12% 0%,rgba(255,43,214,.25),transparent 15rem),radial-gradient(circle at 88% 4%,rgba(24,247,255,.22),transparent 16rem),rgba(14,2,55,.9)!important;box-shadow:0 22px 60px rgba(0,0,0,.34),0 0 36px rgba(255,43,214,.12)!important}.dkd_anyela_live_head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;margin-bottom:10px}.dkd_anyela_live_avatar{position:relative;width:58px;height:58px;border-radius:22px;background:linear-gradient(135deg,#ff2bd6,#18f7ff);display:grid;place-items:center;box-shadow:0 0 26px rgba(255,43,214,.30),0 0 22px rgba(24,247,255,.18);overflow:hidden;border:1px solid rgba(255,255,255,.25)}.dkd_anyela_live_avatar::before{content:"AB";font-weight:950;color:#fff;font-size:18px}.dkd_anyela_live_avatar::after{content:"";position:absolute;right:2px;bottom:2px;width:13px;height:13px;border-radius:999px;background:#36ff83;border:2px solid #090026;box-shadow:0 0 14px #36ff83}.dkd_anyela_live_avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.dkd_anyela_live_title_wrap{min-width:0}.dkd_anyela_live_title{display:flex;align-items:center;gap:8px;margin:0;color:#fff;font-size:clamp(20px,5.2vw,26px);line-height:1.04;letter-spacing:-.03em;font-weight:950}.dkd_anyela_live_title_dot{width:9px;height:9px;border-radius:999px;background:#36ff83;box-shadow:0 0 16px #36ff83;flex:0 0 auto}.dkd_anyela_live_subtitle{margin:5px 0 0;color:rgba(255,255,255,.72);font-size:12px;line-height:1.35}.dkd_anyela_live_timer{min-width:86px;padding:10px 10px;border-radius:18px;background:rgba(54,255,131,.11);border:1px solid rgba(54,255,131,.28);text-align:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}.dkd_anyela_live_timer strong{display:block;color:#36ff83;font-size:18px;line-height:1;font-variant-numeric:tabular-nums}.dkd_anyela_live_timer span{display:block;margin-top:5px;color:rgba(255,255,255,.62);font-size:10px;font-weight:850;letter-spacing:.04em}.dkd_anyela_free_rights{grid-column:1/4;margin-top:8px;display:flex;justify-content:center;gap:8px;flex-wrap:wrap}.dkd_anyela_rights_pill{padding:8px 11px;border-radius:999px;background:rgba(24,247,255,.12);border:1px solid rgba(24,247,255,.24);color:#9efffb;font-size:12px;font-weight:900}.dkd_anyela_gate_box{margin:10px 0 12px;padding:12px 13px;border-radius:18px;background:rgba(255,43,214,.13);border:1px solid rgba(255,43,214,.25);color:#fff;line-height:1.42;font-size:13px}.dkd_anyela_gate_box a{display:inline-block;margin-top:6px;color:#9efffb;text-decoration:underline;font-weight:950}.dkd_anyela_chat_section[aria-label="Canlı sohbet"]>.dkd_anyela_chat_section_title,.dkd_anyela_chat_section[aria-label="Canlı sohbet"]>.dkd_anyela_chat_section_hint{display:none!important}.dkd_anyela_chat_window{max-height:480px!important}.dkd_anyela_chat_empty{font-size:14px}@media(max-width:390px){.dkd_anyela_live_head{grid-template-columns:auto 1fr}.dkd_anyela_live_timer{grid-column:1/3;width:100%}.dkd_anyela_free_rights{grid-column:1/3}.dkd_anyela_live_timer strong{font-size:20px}}';
    document.head.appendChild(dkd_style);
  }

  function dkdForumHideOldRoomUi(){
    const dkd_rooms=document.querySelector('[aria-label="Sohbet odaları"]');
    if(dkd_rooms){dkd_rooms.style.display='none';}
    const dkd_tabs=document.querySelector('.dkd_anyela_chat_tabs');
    if(dkd_tabs){dkd_tabs.style.display='none';}
  }

  function dkdForumFindLiveSection(){return document.querySelector('[aria-label="Canlı sohbet"],[aria-label="Sohbet önizlemesi"]');}

  function dkdForumBuildLiveHeader(){
    const dkd_live=dkdForumFindLiveSection();
    if(!dkd_live){return;}
    dkd_live.setAttribute('aria-label','Canlı sohbet');
    dkd_live.classList.add('dkd_anyela_forum_live_first');
    const dkd_title=dkd_live.querySelector('.dkd_anyela_chat_section_title');
    const dkd_hint=dkd_live.querySelector('.dkd_anyela_chat_section_hint');
    if(dkd_title){dkd_title.textContent='Anyela Born';}
    if(dkd_hint){dkd_hint.textContent='Anyela ile Hemen konuşmaya başla ilk 5 mesajın ücretsiz.';}
    if(document.getElementById('dkd_anyela_live_head')){dkdForumApplyText();return;}
    const dkd_head=document.createElement('div');
    dkd_head.id='dkd_anyela_live_head';
    dkd_head.className='dkd_anyela_live_head';
    dkd_head.innerHTML='<div class="dkd_anyela_live_avatar" id="dkd_anyela_live_avatar" aria-label="Anyela profil resmi"><img src="'+dkdForumAvatarDataUrl+'" alt="Anyela Born profil resmi"></div><div class="dkd_anyela_live_title_wrap"><h2 class="dkd_anyela_live_title"><span class="dkd_anyela_live_title_dot"></span>Anyela Born</h2><p class="dkd_anyela_live_subtitle">Anyela ile Hemen konuşmaya başla ilk 5 mesajın ücretsiz.</p></div><div class="dkd_anyela_live_timer" aria-label="Paket süresi"><strong id="dkd_anyela_live_timer_value">--:--</strong><span id="dkd_anyela_live_timer_label">Paket</span></div><div class="dkd_anyela_free_rights"><span class="dkd_anyela_rights_pill" id="dkd_anyela_free_rights_text">5 ücretsiz mesaj hakkın var</span></div>';
    dkd_live.insertBefore(dkd_head,dkd_live.firstChild);
  }

  function dkdForumApplyText(){
    const dkd_live=dkdForumFindLiveSection();
    if(!dkd_live){return;}
    const dkd_title=dkd_live.querySelector('.dkd_anyela_chat_section_title');
    const dkd_hint=dkd_live.querySelector('.dkd_anyela_chat_section_hint');
    const dkd_live_title=dkd_live.querySelector('.dkd_anyela_live_title');
    const dkd_live_subtitle=dkd_live.querySelector('.dkd_anyela_live_subtitle');
    if(dkd_title){dkd_title.textContent='Anyela Born';}
    if(dkd_hint){dkd_hint.textContent='Anyela ile Hemen konuşmaya başla ilk 5 mesajın ücretsiz.';}
    if(dkd_live_title){dkd_live_title.innerHTML='<span class="dkd_anyela_live_title_dot"></span>Anyela Born';}
    if(dkd_live_subtitle){dkd_live_subtitle.textContent='Anyela ile Hemen konuşmaya başla ilk 5 mesajın ücretsiz.';}
    Array.from(document.querySelectorAll('.dkd_anyela_chat_empty')).forEach(function(dkd_node){dkd_node.textContent=dkd_node.textContent.replace('ilk mesajın ücretsiz','ilk 5 mesajın ücretsiz');});
  }

  function dkdForumFormatSeconds(dkd_seconds){const dkd_safe_seconds=Math.max(0,Number(dkd_seconds||0));const dkd_minutes=Math.floor(dkd_safe_seconds/60);const dkd_second_part=Math.floor(dkd_safe_seconds%60);return String(dkd_minutes).padStart(2,'0')+':'+String(dkd_second_part).padStart(2,'0');}
  function dkdForumSetTimer(dkd_seconds,dkd_label){const dkd_value=document.getElementById('dkd_anyela_live_timer_value');const dkd_label_node=document.getElementById('dkd_anyela_live_timer_label');if(dkd_value){dkd_value.textContent=dkd_seconds>0?dkdForumFormatSeconds(dkd_seconds):'--:--';}if(dkd_label_node){dkd_label_node.textContent=dkd_label||'Paket';}}

  async function dkdForumLoadTimer(){
    const dkd_client=dkdForumGetClient();
    if(!dkd_client){dkdForumSetTimer(0,'Paket');return;}
    const dkd_session_result=await dkd_client.auth.getSession();
    const dkd_session=dkd_session_result&&dkd_session_result.data?dkd_session_result.data.session:null;
    if(!dkd_session){dkdForumSetTimer(0,'Giriş gerekli');return;}
    const dkd_result=await dkd_client.rpc('dkd_anyela_chat_timer_summary');
    if(dkd_result.error){dkdForumSetTimer(0,'Paket');return;}
    const dkd_data=dkd_result.data||{};
    let dkd_remaining=Number(dkd_data.dkd_remaining_seconds||0);
    const dkd_has_package=Boolean(dkd_data.dkd_has_package);
    const dkd_label=dkd_has_package?'Süre':'Paket bekleniyor';
    dkdForumSetTimer(dkd_remaining,dkd_label);
    if(dkdForumTimerInterval){window.clearInterval(dkdForumTimerInterval);}
    dkdForumTimerInterval=window.setInterval(function(){if(dkd_remaining>0){dkd_remaining-=1;}dkdForumSetTimer(dkd_remaining,dkd_label);},1000);
  }

  function dkdForumSetAccessUi(dkd_access){
    dkdForumAccessState=dkd_access||dkdForumAccessState;
    const dkd_rights=document.getElementById('dkd_anyela_free_rights_text');
    const dkd_input=document.getElementById('dkd_anyela_live_chat_input');
    const dkd_send=document.getElementById('dkd_anyela_live_chat_send');
    const dkd_live=dkdForumFindLiveSection();
    const dkd_remaining=Number(dkdForumAccessState.dkd_free_message_remaining||0);
    const dkd_can_send=Boolean(dkdForumAccessState.dkd_can_send_message);
    const dkd_has_package=Boolean(dkdForumAccessState.dkd_has_active_package);
    const dkd_is_admin=Boolean(dkdForumAccessState.dkd_is_admin);
    if(dkd_rights){dkd_rights.textContent=dkd_is_admin?'Admin sohbet erişimi':(dkd_has_package?'Paket aktif':('Ücretsiz mesaj hakkın: '+dkd_remaining+'/5'));}
    let dkd_gate=document.getElementById('dkd_anyela_gate_box');
    if(!dkd_can_send){
      if(!dkd_gate&&dkd_live){
        dkd_gate=document.createElement('div');
        dkd_gate.id='dkd_anyela_gate_box';
        dkd_gate.className='dkd_anyela_gate_box';
        const dkd_window=dkd_live.querySelector('.dkd_anyela_chat_window');
        dkd_live.insertBefore(dkd_gate,dkd_window||dkd_live.firstChild);
      }
      if(dkd_gate){dkd_gate.innerHTML='Benimle Sohbete devam etmek için bir Paket Seç<br><a href="'+dkdForumPackagesUrl+'">'+dkdForumPackagesUrl+'</a>';}
      if(dkd_input){dkd_input.disabled=true;dkd_input.placeholder='Paket seçtikten sonra sohbete devam edebilirsin';}
      if(dkd_send){dkd_send.disabled=true;}
    }else{
      if(dkd_gate){dkd_gate.remove();}
      if(dkd_input){dkd_input.disabled=false;dkd_input.placeholder='Anyela için mesaj yaz...';}
      if(dkd_send){dkd_send.disabled=false;}
    }
  }

  async function dkdForumLoadAccess(){
    const dkd_client=dkdForumGetClient();
    if(!dkd_client){return;}
    const dkd_session_result=await dkd_client.auth.getSession();
    const dkd_session=dkd_session_result&&dkd_session_result.data?dkd_session_result.data.session:null;
    if(!dkd_session){return;}
    const dkd_result=await dkd_client.rpc('dkd_anyela_chat_access_summary');
    if(!dkd_result.error){dkdForumSetAccessUi(dkd_result.data||{});}
  }

  function dkdForumApplyAnyelaAvatar(){
    const dkd_avatar=document.getElementById('dkd_anyela_live_avatar');
    if(dkd_avatar){dkd_avatar.innerHTML='<img src="'+dkdForumAvatarDataUrl+'" alt="Anyela Born profil resmi">';}
  }

  function dkdForumBindSendGuards(){
    document.addEventListener('click',function(dkd_event){
      const dkd_target=dkd_event.target;
      if(dkd_target&&dkd_target.id==='dkd_anyela_live_chat_send'&&!dkdForumAccessState.dkd_can_send_message){dkd_event.preventDefault();dkd_event.stopImmediatePropagation();dkdForumSetAccessUi(dkdForumAccessState);}
      if(dkd_target&&dkd_target.id==='dkd_anyela_live_chat_send'){window.setTimeout(dkdForumLoadAccess,900);window.setTimeout(dkdForumApplyText,950);}
    },true);
    document.addEventListener('keydown',function(dkd_event){
      const dkd_target=dkd_event.target;
      if(dkd_target&&dkd_target.id==='dkd_anyela_live_chat_input'&&dkd_event.key==='Enter'){
        if(!dkdForumAccessState.dkd_can_send_message){dkd_event.preventDefault();dkd_event.stopImmediatePropagation();dkdForumSetAccessUi(dkdForumAccessState);return;}
        window.setTimeout(dkdForumLoadAccess,900);window.setTimeout(dkdForumApplyText,950);
      }
    },true);
  }

  function dkdForumInit(){
    if(window.location.pathname.indexOf('/AnyelaBorn/ChatRoom/')===-1){return;}
    dkdForumInjectStyle();
    dkdForumHideOldRoomUi();
    dkdForumBuildLiveHeader();
    dkdForumApplyAnyelaAvatar();
    dkdForumApplyText();
    dkdForumBindSendGuards();
    dkdForumEnsureSupabase(function(){dkdForumLoadTimer();dkdForumLoadAccess();});
    window.setTimeout(dkdForumApplyText,600);
    window.setTimeout(dkdForumLoadAccess,1200);
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',dkdForumInit);}else{dkdForumInit();}
})();