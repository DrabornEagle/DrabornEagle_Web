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
    dkd_style.textContent='[aria-label="Sohbet odaları"],.dkd_anyela_chat_tabs{display:none!important}.dkd_anyela_chat_hero .dkd_anyela_chat_live_badge{display:none!important}.dkd_anyela_chat_section[aria-label="Canlı sohbet"],.dkd_anyela_forum_live_first{position:relative;width:100%!important;margin:14px 0 0!important;padding:16px!important;border-radius:30px!important;overflow:hidden!important;background:radial-gradient(circle at 0% 0%,rgba(255,43,214,.42),transparent 190px),radial-gradient(circle at 100% 0%,rgba(24,247,255,.36),transparent 190px),linear-gradient(160deg,rgba(21,5,72,.96),rgba(7,1,34,.96) 56%,rgba(7,45,72,.80))!important;border:1px solid rgba(255,255,255,.18)!important;box-shadow:0 22px 58px rgba(0,0,0,.45),0 0 28px rgba(255,43,214,.16),0 0 22px rgba(24,247,255,.12)!important;backdrop-filter:blur(14px)!important}.dkd_anyela_chat_section[aria-label="Canlı sohbet"]::before,.dkd_anyela_forum_live_first::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,rgba(255,255,255,.10),transparent 34%,transparent 70%,rgba(24,247,255,.07)),radial-gradient(circle at 50% 112%,rgba(255,208,95,.13),transparent 210px);opacity:.75}.dkd_anyela_chat_section[aria-label="Canlı sohbet"]::after,.dkd_anyela_forum_live_first::after{content:"";position:absolute;left:18px;right:18px;top:82px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);pointer-events:none}.dkd_anyela_live_head{position:relative;z-index:2;display:grid;grid-template-columns:56px minmax(0,1fr) auto;align-items:center;gap:11px;margin:0 0 14px;padding:12px;border-radius:24px;background:rgba(255,255,255,.105);border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.16)}.dkd_anyela_live_avatar{position:relative;width:56px;height:56px;border-radius:20px;background:linear-gradient(135deg,#ff2bd6 0%,#7a5cff 48%,#18f7ff 100%);display:grid;place-items:center;overflow:hidden;border:1px solid rgba(255,255,255,.30);box-shadow:0 0 24px rgba(255,43,214,.28)}.dkd_anyela_live_avatar::before{content:"AB";font-weight:1000;color:#fff;font-size:17px}.dkd_anyela_live_avatar::after{content:"";position:absolute;right:2px;bottom:2px;width:13px;height:13px;border-radius:999px;background:#35ff83;border:2px solid #080020;box-shadow:0 0 13px #35ff83}.dkd_anyela_live_avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.dkd_anyela_live_title_wrap{min-width:0}.dkd_anyela_live_title{display:flex;align-items:center;gap:7px;margin:0;color:#fff;font-size:clamp(20px,5vw,24px);line-height:1.08;letter-spacing:-.03em;font-weight:1000;text-shadow:0 0 18px rgba(24,247,255,.22)}.dkd_anyela_live_title_dot{width:9px;height:9px;border-radius:999px;background:#35ff83;box-shadow:0 0 16px #35ff83;flex:0 0 auto}.dkd_anyela_live_subtitle{margin:5px 0 0;color:rgba(255,255,255,.76);font-size:12px;line-height:1.35}.dkd_anyela_live_timer{min-width:76px;padding:9px 8px;border-radius:18px;background:rgba(53,255,131,.12);border:1px solid rgba(53,255,131,.30);text-align:center}.dkd_anyela_live_timer strong{display:block;color:#35ff83;font-size:18px;line-height:1;font-variant-numeric:tabular-nums;text-shadow:0 0 12px rgba(53,255,131,.44)}.dkd_anyela_live_timer span{display:block;margin-top:5px;color:rgba(255,255,255,.64);font-size:9px;font-weight:900;letter-spacing:.04em;text-transform:uppercase}.dkd_anyela_chat_section[aria-label="Canlı sohbet"]>.dkd_anyela_chat_section_title,.dkd_anyela_chat_section[aria-label="Canlı sohbet"]>.dkd_anyela_chat_section_hint{display:none!important}.dkd_anyela_chat_window{position:relative;z-index:2;min-height:330px!important;max-height:390px!important;overflow:auto!important;padding:12px!important;border-radius:24px!important;background:rgba(5,0,27,.42)!important;border:1px solid rgba(255,255,255,.10)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.045)!important}.dkd_anyela_chat_empty{padding:14px!important;border-radius:20px!important;font-size:14px!important;background:rgba(255,255,255,.075)!important;border:1px solid rgba(255,255,255,.10)!important;color:rgba(255,255,255,.82)!important}.dkd_anyela_chat_bubble{width:max-content!important;min-width:0!important;max-width:82%!important;margin:0 0 10px!important;padding:11px 12px!important;border-radius:18px!important;font-size:14px!important;line-height:1.38!important;box-shadow:0 10px 22px rgba(0,0,0,.18)!important}.dkd_anyela_chat_bubble strong{display:block!important;margin-bottom:4px!important;font-size:13px!important}.dkd_anyela_chat_bubble_anyela{margin-right:auto!important;background:linear-gradient(135deg,rgba(255,43,214,.24),rgba(122,92,255,.16))!important;border:1px solid rgba(255,43,214,.20)!important}.dkd_anyela_chat_bubble_member{margin-left:auto!important;background:linear-gradient(135deg,rgba(24,247,255,.18),rgba(53,255,131,.11))!important;border:1px solid rgba(24,247,255,.16)!important}.dkd_anyela_chat_meta{display:block!important;margin-top:6px!important;color:rgba(255,255,255,.52)!important;font-size:10.5px!important}.dkd_anyela_chat_input{position:relative;z-index:2;width:calc(100% - 92px)!important;margin-top:14px!important;min-height:54px!important;border-radius:21px!important;padding:0 15px!important;background:rgba(255,255,255,.09)!important;border:1px solid rgba(255,255,255,.15)!important;color:#fff!important}.dkd_anyela_chat_send{position:relative;z-index:2;width:82px!important;min-height:54px!important;margin-top:14px!important;border-radius:21px!important;font-size:15px!important;background:linear-gradient(135deg,#ff2bd6 0%,#7a5cff 52%,#18f7ff 100%)!important;box-shadow:0 14px 26px rgba(255,43,214,.22),0 0 20px rgba(24,247,255,.13)!important}.dkd_anyela_chat_input:disabled,.dkd_anyela_chat_send:disabled{opacity:.55!important}@media(max-width:390px){.dkd_anyela_chat_section[aria-label="Canlı sohbet"],.dkd_anyela_forum_live_first{padding:14px!important;border-radius:28px!important}.dkd_anyela_live_head{grid-template-columns:52px minmax(0,1fr);gap:10px}.dkd_anyela_live_avatar{width:52px;height:52px}.dkd_anyela_live_timer{grid-column:1/3;width:100%;display:flex;align-items:center;justify-content:center;gap:8px}.dkd_anyela_live_timer span{margin-top:0}.dkd_anyela_chat_window{min-height:320px!important;max-height:370px!important}.dkd_anyela_chat_input{width:100%!important;margin-top:12px!important}.dkd_anyela_chat_send{width:100%!important;margin-top:10px!important}.dkd_anyela_chat_bubble{max-width:88%!important}}';
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
    dkd_head.innerHTML='<div class="dkd_anyela_live_avatar" id="dkd_anyela_live_avatar" aria-label="Anyela profil resmi"></div><div class="dkd_anyela_live_title_wrap"><h2 class="dkd_anyela_live_title"><span class="dkd_anyela_live_title_dot"></span>Anyela Şuanda Aktif</h2><p class="dkd_anyela_live_subtitle">İlk mesajın ücretsiz. Canlı sohbet hazır.</p></div><div class="dkd_anyela_live_timer" aria-label="Paket süresi"><strong id="dkd_anyela_live_timer_value">--:--</strong><span id="dkd_anyela_live_timer_label">Paket</span></div>';
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
