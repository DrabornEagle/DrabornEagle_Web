(function dkdAnyelaForumRoomsScope(){
  'use strict';

  const dkdForumSupabaseUrl='https://ztxlcfcwuwerxrhwfmte.supabase.co';
  const dkdForumSupabaseKey='sb_publishable_GSd5xFBwG9pioOY8N6MRQw_C2n7RLYa';
  const dkdForumScriptSrc='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  let dkdForumClient=null;
  let dkdForumTimerInterval=null;

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
    dkd_style.textContent='[aria-label="Sohbet odaları"],.dkd_anyela_chat_tabs{display:none!important}.dkd_anyela_chat_hero .dkd_anyela_chat_live_badge{display:none!important}.dkd_anyela_chat_section[aria-label="Canlı sohbet"],.dkd_anyela_forum_live_first{width:calc(100% + 16px)!important;margin-left:-8px!important;margin-right:-8px!important;padding:20px!important;border-radius:30px!important;background:radial-gradient(circle at 12% 0%,rgba(255,43,214,.25),transparent 15rem),radial-gradient(circle at 88% 4%,rgba(24,247,255,.22),transparent 16rem),rgba(14,2,55,.9)!important;box-shadow:0 22px 60px rgba(0,0,0,.34),0 0 36px rgba(255,43,214,.12)!important}.dkd_anyela_live_head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;margin-bottom:10px}.dkd_anyela_live_avatar{position:relative;width:58px;height:58px;border-radius:22px;background:linear-gradient(135deg,#ff2bd6,#18f7ff);display:grid;place-items:center;box-shadow:0 0 26px rgba(255,43,214,.30),0 0 22px rgba(24,247,255,.18);overflow:hidden;border:1px solid rgba(255,255,255,.25)}.dkd_anyela_live_avatar::before{content:"AB";font-weight:950;color:#fff;font-size:18px}.dkd_anyela_live_avatar::after{content:"";position:absolute;right:2px;bottom:2px;width:13px;height:13px;border-radius:999px;background:#36ff83;border:2px solid #090026;box-shadow:0 0 14px #36ff83}.dkd_anyela_live_avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.dkd_anyela_live_title_wrap{min-width:0}.dkd_anyela_live_title{display:flex;align-items:center;gap:8px;margin:0;color:#fff;font-size:clamp(20px,5.2vw,26px);line-height:1.04;letter-spacing:-.03em;font-weight:950}.dkd_anyela_live_title_dot{width:9px;height:9px;border-radius:999px;background:#36ff83;box-shadow:0 0 16px #36ff83;flex:0 0 auto}.dkd_anyela_live_subtitle{margin:5px 0 0;color:rgba(255,255,255,.72);font-size:12px;line-height:1.35}.dkd_anyela_live_timer{min-width:86px;padding:10px 10px;border-radius:18px;background:rgba(54,255,131,.11);border:1px solid rgba(54,255,131,.28);text-align:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}.dkd_anyela_live_timer strong{display:block;color:#36ff83;font-size:18px;line-height:1;font-variant-numeric:tabular-nums}.dkd_anyela_live_timer span{display:block;margin-top:5px;color:rgba(255,255,255,.62);font-size:10px;font-weight:850;letter-spacing:.04em}.dkd_anyela_chat_section[aria-label="Canlı sohbet"]>.dkd_anyela_chat_section_title,.dkd_anyela_chat_section[aria-label="Canlı sohbet"]>.dkd_anyela_chat_section_hint{display:none!important}.dkd_anyela_chat_window{max-height:480px!important}.dkd_anyela_chat_empty{font-size:14px}@media(max-width:390px){.dkd_anyela_live_head{grid-template-columns:auto 1fr}.dkd_anyela_live_timer{grid-column:1/3;width:100%}.dkd_anyela_live_timer strong{font-size:20px}}';
    document.head.appendChild(dkd_style);
  }

  function dkdForumHideOldRoomUi(){
    const dkd_rooms=document.querySelector('[aria-label="Sohbet odaları"]');
    if(dkd_rooms){dkd_rooms.style.display='none';}
    const dkd_tabs=document.querySelector('.dkd_anyela_chat_tabs');
    if(dkd_tabs){dkd_tabs.style.display='none';}
  }

  function dkdForumFindLiveSection(){
    return document.querySelector('[aria-label="Canlı sohbet"],[aria-label="Sohbet önizlemesi"]');
  }

  function dkdForumBuildLiveHeader(){
    const dkd_live=dkdForumFindLiveSection();
    if(!dkd_live||document.getElementById('dkd_anyela_live_head')){return;}
    dkd_live.setAttribute('aria-label','Canlı sohbet');
    dkd_live.classList.add('dkd_anyela_forum_live_first');
    const dkd_title=dkd_live.querySelector('.dkd_anyela_chat_section_title');
    const dkd_hint=dkd_live.querySelector('.dkd_anyela_chat_section_hint');
    if(dkd_title){dkd_title.textContent='Anyela Şuanda Aktif';}
    if(dkd_hint){dkd_hint.textContent='Anyela ile Hemen konuşmaya başla ilk mesajın ücretsiz.';}
    const dkd_head=document.createElement('div');
    dkd_head.id='dkd_anyela_live_head';
    dkd_head.className='dkd_anyela_live_head';
    dkd_head.innerHTML='<div class="dkd_anyela_live_avatar" id="dkd_anyela_live_avatar" aria-label="Anyela profil resmi"></div><div class="dkd_anyela_live_title_wrap"><h2 class="dkd_anyela_live_title"><span class="dkd_anyela_live_title_dot"></span>Anyela Şuanda Aktif</h2><p class="dkd_anyela_live_subtitle">Anyela ile Hemen konuşmaya başla ilk mesajın ücretsiz.</p></div><div class="dkd_anyela_live_timer" aria-label="Paket süresi"><strong id="dkd_anyela_live_timer_value">--:--</strong><span id="dkd_anyela_live_timer_label">Paket</span></div>';
    dkd_live.insertBefore(dkd_head,dkd_live.firstChild);
  }

  function dkdForumFormatSeconds(dkd_seconds){
    const dkd_safe_seconds=Math.max(0,Number(dkd_seconds||0));
    const dkd_minutes=Math.floor(dkd_safe_seconds/60);
    const dkd_second_part=Math.floor(dkd_safe_seconds%60);
    return String(dkd_minutes).padStart(2,'0')+':'+String(dkd_second_part).padStart(2,'0');
  }

  function dkdForumSetTimer(dkd_seconds,dkd_label){
    const dkd_value=document.getElementById('dkd_anyela_live_timer_value');
    const dkd_label_node=document.getElementById('dkd_anyela_live_timer_label');
    if(dkd_value){dkd_value.textContent=dkd_seconds>0?dkdForumFormatSeconds(dkd_seconds):'--:--';}
    if(dkd_label_node){dkd_label_node.textContent=dkd_label||'Paket';}
  }

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
    dkdForumTimerInterval=window.setInterval(function(){
      if(dkd_remaining>0){dkd_remaining-=1;}
      dkdForumSetTimer(dkd_remaining,dkd_label);
    },1000);
  }

  function dkdForumApplyAnyelaAvatar(){
    const dkd_avatar=document.getElementById('dkd_anyela_live_avatar');
    if(!dkd_avatar){return;}
    const dkd_candidates=[
      '/AnyelaBorn/Profile/assets/dkd_anyela_profile.png',
      '/AnyelaBorn/Home/assets/dkd_anyela_home_character.png',
      '/AnyelaBorn/Packages/assets/dkd_anyela_packages_miami_offer_20260531.jpg',
      '/AnyelaBorn/Login/assets/dkd_anyela_login_9935_20260529.png'
    ];
    let dkd_index=0;
    function dkd_try_next(){
      if(dkd_index>=dkd_candidates.length){return;}
      const dkd_image=new Image();
      dkd_image.onload=function(){dkd_avatar.innerHTML='<img src="'+dkd_candidates[dkd_index]+'" alt="Anyela profil resmi">';};
      dkd_image.onerror=function(){dkd_index+=1;dkd_try_next();};
      dkd_image.src=dkd_candidates[dkd_index];
    }
    dkd_try_next();
  }

  function dkdForumInit(){
    if(window.location.pathname.indexOf('/AnyelaBorn/ChatRoom/')===-1){return;}
    dkdForumInjectStyle();
    dkdForumHideOldRoomUi();
    dkdForumBuildLiveHeader();
    dkdForumApplyAnyelaAvatar();
    dkdForumEnsureSupabase(dkdForumLoadTimer);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',dkdForumInit);
  }else{
    dkdForumInit();
  }
})();
