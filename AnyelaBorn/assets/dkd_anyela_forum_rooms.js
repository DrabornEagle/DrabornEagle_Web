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
    dkd_style.textContent='[aria-label="Sohbet odaları"],.dkd_anyela_chat_tabs{display:none!important}.dkd_anyela_chat_hero .dkd_anyela_chat_live_badge{display:none!important}.dkd_anyela_chat_section[aria-label="Canlı sohbet"],.dkd_anyela_forum_live_first{position:relative;width:calc(100% + 22px)!important;margin-left:-11px!important;margin-right:-11px!important;min-height:620px!important;padding:24px 20px 26px!important;border-radius:34px!important;overflow:hidden!important;background:radial-gradient(circle at 10% -6%,rgba(255,43,214,.52),transparent 16rem),radial-gradient(circle at 92% 0%,rgba(24,247,255,.44),transparent 17rem),radial-gradient(circle at 50% 105%,rgba(255,208,95,.18),transparent 19rem),linear-gradient(160deg,rgba(16,3,64,.98),rgba(4,0,24,.94) 58%,rgba(12,44,82,.72))!important;border:1px solid rgba(255,255,255,.18)!important;box-shadow:0 30px 90px rgba(0,0,0,.52),0 0 46px rgba(255,43,214,.22),0 0 34px rgba(24,247,255,.15),inset 0 1px 0 rgba(255,255,255,.22)!important;backdrop-filter:blur(18px)}.dkd_anyela_chat_section[aria-label="Canlı sohbet"]::before,.dkd_anyela_forum_live_first::before{content:"";position:absolute;inset:-40% -30% auto auto;width:260px;height:260px;border-radius:999px;background:conic-gradient(from 180deg,rgba(255,43,214,.32),rgba(24,247,255,.28),rgba(255,208,95,.20),rgba(255,43,214,.32));filter:blur(8px);opacity:.85;pointer-events:none}.dkd_anyela_chat_section[aria-label="Canlı sohbet"]::after,.dkd_anyela_forum_live_first::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,transparent 0 42%,rgba(255,255,255,.07) 48%,transparent 56% 100%),repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 1px,transparent 1px 34px);mix-blend-mode:screen}.dkd_anyela_live_head{position:relative;z-index:2;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:14px;margin-bottom:18px;padding:14px;border-radius:28px;background:linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.045));border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 16px 42px rgba(0,0,0,.20)}.dkd_anyela_live_avatar{position:relative;width:66px;height:66px;border-radius:24px;background:linear-gradient(135deg,#ff2bd6,#18f7ff 58%,#ffd05f);display:grid;place-items:center;box-shadow:0 0 34px rgba(255,43,214,.44),0 0 28px rgba(24,247,255,.24);overflow:hidden;border:1px solid rgba(255,255,255,.34)}.dkd_anyela_live_avatar::before{content:"AB";font-weight:950;color:#fff;font-size:19px;text-shadow:0 0 14px rgba(255,255,255,.38)}.dkd_anyela_live_avatar::after{content:"";position:absolute;right:3px;bottom:3px;width:15px;height:15px;border-radius:999px;background:#36ff83;border:2px solid #090026;box-shadow:0 0 16px #36ff83}.dkd_anyela_live_avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.dkd_anyela_live_title_wrap{min-width:0}.dkd_anyela_live_title{display:flex;align-items:center;gap:8px;margin:0;color:#fff;font-size:clamp(22px,5.6vw,29px);line-height:1.03;letter-spacing:-.04em;font-weight:1000;text-shadow:0 0 22px rgba(24,247,255,.28)}.dkd_anyela_live_title_dot{width:10px;height:10px;border-radius:999px;background:#36ff83;box-shadow:0 0 18px #36ff83;flex:0 0 auto}.dkd_anyela_live_subtitle{margin:7px 0 0;color:rgba(255,255,255,.78);font-size:12.5px;line-height:1.38}.dkd_anyela_live_timer{min-width:94px;padding:12px 11px;border-radius:20px;background:linear-gradient(135deg,rgba(54,255,131,.18),rgba(24,247,255,.12));border:1px solid rgba(54,255,131,.34);text-align:center;box-shadow:0 0 25px rgba(54,255,131,.13),inset 0 0 0 1px rgba(255,255,255,.08)}.dkd_anyela_live_timer strong{display:block;color:#36ff83;font-size:21px;line-height:1;font-variant-numeric:tabular-nums;text-shadow:0 0 16px rgba(54,255,131,.50)}.dkd_anyela_live_timer span{display:block;margin-top:6px;color:rgba(255,255,255,.68);font-size:10px;font-weight:900;letter-spacing:.05em;text-transform:uppercase}.dkd_anyela_chat_section[aria-label="Canlı sohbet"]>.dkd_anyela_chat_section_title,.dkd_anyela_chat_section[aria-label="Canlı sohbet"]>.dkd_anyela_chat_section_hint{display:none!important}.dkd_anyela_chat_window{position:relative;z-index:2;min-height:390px!important;max-height:520px!important;overflow:auto!important;padding:14px!important;border-radius:26px!important;background:rgba(5,0,26,.42)!important;border:1px solid rgba(255,255,255,.10)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.055)}.dkd_anyela_chat_empty{font-size:14px!important;border-radius:22px!important;background:rgba(255,255,255,.08)!important}.dkd_anyela_chat_bubble{border-radius:22px!important;padding:13px 14px!important;box-shadow:0 12px 26px rgba(0,0,0,.18)!important}.dkd_anyela_chat_bubble_anyela{background:linear-gradient(135deg,rgba(255,43,214,.22),rgba(24,247,255,.12))!important;border:1px solid rgba(255,255,255,.12)!important}.dkd_anyela_chat_bubble_member{background:linear-gradient(135deg,rgba(24,247,255,.16),rgba(54,255,131,.10))!important;border:1px solid rgba(255,255,255,.10)!important}.dkd_anyela_chat_input{position:relative;z-index:2;margin-top:14px!important;border-radius:24px!important;min-height:58px!important;background:rgba(255,255,255,.075)!important;border:1px solid rgba(255,255,255,.14)!important}.dkd_anyela_chat_send{position:relative;z-index:2;min-height:54px!important;border-radius:22px!important;background:linear-gradient(135deg,#ff2bd6,#812bff 45%,#18f7ff)!important;box-shadow:0 16px 34px rgba(255,43,214,.22),0 0 26px rgba(24,247,255,.14)!important}@media(max-width:390px){.dkd_anyela_chat_section[aria-label="Canlı sohbet"],.dkd_anyela_forum_live_first{min-height:650px!important;padding:22px 16px 24px!important}.dkd_anyela_live_head{grid-template-columns:auto 1fr}.dkd_anyela_live_timer{grid-column:1/3;width:100%}.dkd_anyela_live_timer strong{font-size:22px}.dkd_anyela_chat_window{min-height:410px!important}}';
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
