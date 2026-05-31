(function dkdAnyelaAuthGuardScope(){
  'use strict';

  const dkdAnyelaAuthScript=document.currentScript;
  const dkdAnyelaAuthMode=dkdAnyelaAuthScript&&dkdAnyelaAuthScript.getAttribute('data-dkd-anyela-auth-mode')?dkdAnyelaAuthScript.getAttribute('data-dkd-anyela-auth-mode'):'protected';
  const dkdAnyelaAuthHomePath='/AnyelaBorn/Home/';
  const dkdAnyelaAuthLoginPath='/AnyelaBorn/Login/';
  const dkdAnyelaLiveSupabaseUrl='https://ztxlcfcwuwerxrhwfmte.supabase.co';
  const dkdAnyelaLiveSupabasePublishableKey='sb_publishable_GSd5xFBwG9pioOY8N6MRQw_C2n7RLYa';
  const dkdAnyelaLiveSupabaseScriptSrc='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  let dkdAnyelaLiveSupabaseClient=null;

  function dkdAnyelaAuthReadStorage(dkdAnyelaAuthKey){try{return window.localStorage.getItem(dkdAnyelaAuthKey);}catch(dkdAnyelaAuthStorageError){return null;}}
  function dkdAnyelaAuthHasGuestAccess(){return dkdAnyelaAuthReadStorage('dkd_anyela_guest_login_active')==='true'||dkdAnyelaAuthReadStorage('dkd_anyela_auth_mode')==='guest';}
  function dkdAnyelaAuthHasSupabaseSession(){
    const dkdAnyelaAuthSessionValue=dkdAnyelaAuthReadStorage('dkd_anyela_auth_session');
    if(!dkdAnyelaAuthSessionValue){return false;}
    if(dkdAnyelaAuthSessionValue.indexOf('access_token')!==-1){return true;}
    try{const dkdAnyelaAuthParsedSession=JSON.parse(dkdAnyelaAuthSessionValue);const dkdAnyelaAuthSessionBody=dkdAnyelaAuthParsedSession&&dkdAnyelaAuthParsedSession.session?dkdAnyelaAuthParsedSession.session:dkdAnyelaAuthParsedSession;return Boolean(dkdAnyelaAuthSessionBody&&dkdAnyelaAuthSessionBody.access_token);}catch(dkdAnyelaAuthParseError){return false;}
  }
  function dkdAnyelaAuthHasSavedAccountAccess(){const dkdAnyelaAuthAccessFlag=dkdAnyelaAuthReadStorage('dkd_anyela_auth_access');const dkdAnyelaAuthAccountOnceFlag=dkdAnyelaAuthReadStorage('dkd_anyela_account_login_once');const dkdAnyelaAuthModeFlag=dkdAnyelaAuthReadStorage('dkd_anyela_auth_mode');return dkdAnyelaAuthAccountOnceFlag==='true'||(dkdAnyelaAuthAccessFlag==='allowed'&&dkdAnyelaAuthModeFlag==='member');}
  function dkdAnyelaAuthHasAccountAccess(){if(dkdAnyelaAuthHasSupabaseSession()){return true;}if(dkdAnyelaAuthHasGuestAccess()){return false;}return dkdAnyelaAuthHasSavedAccountAccess();}
  function dkdAnyelaAuthHasProtectedAccess(){return dkdAnyelaAuthHasAccountAccess()||dkdAnyelaAuthHasGuestAccess();}
  function dkdAnyelaAuthRedirect(dkdAnyelaAuthTargetPath){if(window.location.pathname!==dkdAnyelaAuthTargetPath){window.location.replace(dkdAnyelaAuthTargetPath);}}

  const dkdAnyelaAuthAccountGranted=dkdAnyelaAuthHasAccountAccess();
  const dkdAnyelaAuthProtectedGranted=dkdAnyelaAuthHasProtectedAccess();
  if(dkdAnyelaAuthMode==='login'){if(dkdAnyelaAuthAccountGranted){dkdAnyelaAuthRedirect(dkdAnyelaAuthHomePath);}return;}
  if(dkdAnyelaAuthMode==='entry'){dkdAnyelaAuthRedirect(dkdAnyelaAuthAccountGranted?dkdAnyelaAuthHomePath:dkdAnyelaAuthLoginPath);return;}
  if(dkdAnyelaAuthMode==='account'){if(!dkdAnyelaAuthAccountGranted){dkdAnyelaAuthRedirect(dkdAnyelaAuthLoginPath);}}
  else if(!dkdAnyelaAuthProtectedGranted){dkdAnyelaAuthRedirect(dkdAnyelaAuthLoginPath);}

  function dkdAnyelaLiveEnsureSupabase(dkdAnyelaLiveCallback){
    if(window.supabase&&window.supabase.createClient){dkdAnyelaLiveCallback();return;}
    const dkdAnyelaLiveExistingScript=Array.from(document.scripts).find(function dkdAnyelaLiveFindScript(dkdAnyelaLiveScriptItem){return dkdAnyelaLiveScriptItem.src===dkdAnyelaLiveSupabaseScriptSrc;});
    if(dkdAnyelaLiveExistingScript){dkdAnyelaLiveExistingScript.addEventListener('load',dkdAnyelaLiveCallback,{once:true});return;}
    const dkdAnyelaLiveScript=document.createElement('script');
    dkdAnyelaLiveScript.src=dkdAnyelaLiveSupabaseScriptSrc;
    dkdAnyelaLiveScript.onload=dkdAnyelaLiveCallback;
    document.head.appendChild(dkdAnyelaLiveScript);
  }
  function dkdAnyelaLiveGetClient(){
    if(dkdAnyelaLiveSupabaseClient){return dkdAnyelaLiveSupabaseClient;}
    if(!window.supabase||!window.supabase.createClient){return null;}
    dkdAnyelaLiveSupabaseClient=window.supabase.createClient(dkdAnyelaLiveSupabaseUrl,dkdAnyelaLiveSupabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'dkd_anyela_auth_session'}});
    return dkdAnyelaLiveSupabaseClient;
  }
  function dkdAnyelaLiveSetText(dkdAnyelaLiveNode,dkdAnyelaLiveText){if(dkdAnyelaLiveNode){dkdAnyelaLiveNode.textContent=dkdAnyelaLiveText;}}
  function dkdAnyelaLiveEscape(dkdAnyelaLiveValue){return String(dkdAnyelaLiveValue||'').replace(/[&<>"']/g,function dkdAnyelaLiveEscapeMatch(dkdAnyelaLiveChar){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[dkdAnyelaLiveChar];});}
  function dkdAnyelaLiveDate(dkdAnyelaLiveValue){try{return dkdAnyelaLiveValue?new Date(dkdAnyelaLiveValue).toLocaleString('tr-TR'):'';}catch(dkdAnyelaLiveDateError){return '';}}

  function dkdAnyelaLiveProfileActivity(){
    if(window.location.pathname.indexOf('/AnyelaBorn/Profile/')===-1){return;}
    const dkdAnyelaLiveActivitySection=document.querySelector('[aria-label="Aktivite özeti"]');
    if(!dkdAnyelaLiveActivitySection){return;}
    const dkdAnyelaLiveStatNodes=dkdAnyelaLiveActivitySection.querySelectorAll('.dkd_anyela_profile_stat strong');
    if(dkdAnyelaLiveStatNodes.length>=3){dkdAnyelaLiveStatNodes[0].id='dkd_anyela_profile_chat_count';dkdAnyelaLiveStatNodes[1].id='dkd_anyela_profile_package_count';dkdAnyelaLiveStatNodes[2].id='dkd_anyela_profile_notification_count';dkdAnyelaLiveSetText(dkdAnyelaLiveStatNodes[0],'…');dkdAnyelaLiveSetText(dkdAnyelaLiveStatNodes[1],'…');dkdAnyelaLiveSetText(dkdAnyelaLiveStatNodes[2],'…');}
    dkdAnyelaLiveSetText(dkdAnyelaLiveActivitySection.querySelector('.dkd_anyela_profile_section_hint'),'Sohbet, paket ve bildirim durumunu gerçek Supabase verisinden takip et.');
    dkdAnyelaLiveEnsureSupabase(async function dkdAnyelaLiveProfileReady(){const dkdAnyelaLiveClient=dkdAnyelaLiveGetClient();if(!dkdAnyelaLiveClient){return;}const dkdAnyelaLiveSessionResult=await dkdAnyelaLiveClient.auth.getSession();const dkdAnyelaLiveSession=dkdAnyelaLiveSessionResult&&dkdAnyelaLiveSessionResult.data?dkdAnyelaLiveSessionResult.data.session:null;if(!dkdAnyelaLiveSession){return;}const dkdAnyelaLiveSummaryResult=await dkdAnyelaLiveClient.rpc('dkd_anyela_get_activity_summary');if(dkdAnyelaLiveSummaryResult.error){return;}const dkdAnyelaLiveSummary=dkdAnyelaLiveSummaryResult.data||{};dkdAnyelaLiveSetText(document.getElementById('dkd_anyela_profile_chat_count'),String(Number(dkdAnyelaLiveSummary.dkd_chat_count||0)));dkdAnyelaLiveSetText(document.getElementById('dkd_anyela_profile_package_count'),String(Number(dkdAnyelaLiveSummary.dkd_package_count||0)));dkdAnyelaLiveSetText(document.getElementById('dkd_anyela_profile_notification_count'),String(Number(dkdAnyelaLiveSummary.dkd_notification_count||0)));});
  }

  function dkdAnyelaLiveInjectChatStyle(){
    if(document.getElementById('dkd_anyela_live_chat_style')){return;}
    const dkdAnyelaLiveStyle=document.createElement('style');
    dkdAnyelaLiveStyle.id='dkd_anyela_live_chat_style';
    dkdAnyelaLiveStyle.textContent='.dkd_anyela_chat_live_dot{background:#36ff83!important;box-shadow:0 0 18px #36ff83!important}.dkd_anyela_chat_window{max-height:420px;overflow:auto;padding-right:2px}.dkd_anyela_chat_empty{padding:14px;border-radius:20px;background:rgba(54,255,131,.10);border:1px solid rgba(54,255,131,.24);color:rgba(255,255,255,.9);line-height:1.45}.dkd_anyela_chat_meta{display:block;margin-top:6px;color:rgba(255,255,255,.58);font-size:11px}.dkd_anyela_chat_send:disabled,.dkd_anyela_chat_input:disabled{opacity:.62;cursor:not-allowed}';
    document.head.appendChild(dkdAnyelaLiveStyle);
  }

  function dkdAnyelaLiveChatRoom(){
    if(window.location.pathname.indexOf('/AnyelaBorn/ChatRoom/')===-1){return;}
    dkdAnyelaLiveInjectChatStyle();
    const dkdAnyelaLiveHeroBadge=document.querySelector('.dkd_anyela_chat_live_badge');
    if(dkdAnyelaLiveHeroBadge){dkdAnyelaLiveHeroBadge.innerHTML='<span class="dkd_anyela_chat_live_dot"></span>Canlı Oda';}
    const dkdAnyelaLivePreviewSection=document.querySelector('[aria-label="Sohbet önizlemesi"],[aria-label="Canlı sohbet"]');
    if(!dkdAnyelaLivePreviewSection){return;}
    dkdAnyelaLivePreviewSection.setAttribute('aria-label','Canlı sohbet');
    const dkdAnyelaLiveTitle=dkdAnyelaLivePreviewSection.querySelector('.dkd_anyela_chat_section_title');
    const dkdAnyelaLiveHint=dkdAnyelaLivePreviewSection.querySelector('.dkd_anyela_chat_section_hint');
    if(dkdAnyelaLiveTitle){dkdAnyelaLiveTitle.innerHTML='<span class="dkd_anyela_chat_live_dot" aria-hidden="true" style="display:inline-block;margin-right:8px;vertical-align:middle"></span>Anyela Şuanda Aktif';}
    dkdAnyelaLiveSetText(dkdAnyelaLiveHint,'Anyela ile Hemen konuşmaya başla ilk mesajın ücretsiz.');
    const dkdAnyelaLiveWindow=dkdAnyelaLivePreviewSection.querySelector('.dkd_anyela_chat_window');
    const dkdAnyelaLiveInput=dkdAnyelaLivePreviewSection.querySelector('.dkd_anyela_chat_input');
    const dkdAnyelaLiveSendButton=dkdAnyelaLivePreviewSection.querySelector('.dkd_anyela_chat_send');
    if(dkdAnyelaLiveWindow){dkdAnyelaLiveWindow.id='dkd_anyela_live_chat_window';dkdAnyelaLiveWindow.innerHTML='<div class="dkd_anyela_chat_empty">Canlı Sohbet yükleniyor...</div>';}
    if(dkdAnyelaLiveInput){dkdAnyelaLiveInput.id='dkd_anyela_live_chat_input';dkdAnyelaLiveInput.placeholder='Anyela için mesaj yaz...';}
    if(dkdAnyelaLiveSendButton){dkdAnyelaLiveSendButton.id='dkd_anyela_live_chat_send';dkdAnyelaLiveSetText(dkdAnyelaLiveSendButton,'Gönder');}
    dkdAnyelaLiveEnsureSupabase(async function dkdAnyelaLiveChatReady(){
      const dkdAnyelaLiveClient=dkdAnyelaLiveGetClient();
      let dkdAnyelaLiveMessages=[];
      let dkdAnyelaLiveUserId='';
      let dkdAnyelaLiveChannel=null;
      function dkdAnyelaLiveRenderMessages(){if(!dkdAnyelaLiveWindow){return;}if(!dkdAnyelaLiveMessages.length){dkdAnyelaLiveWindow.innerHTML='<div class="dkd_anyela_chat_empty">Anyela ile Hemen konuşmaya başla ilk mesajın ücretsiz.</div>';return;}dkdAnyelaLiveWindow.innerHTML=dkdAnyelaLiveMessages.map(function dkdAnyelaLiveRenderMessage(dkdAnyelaLiveMessage){const dkdAnyelaLiveIsAdmin=dkdAnyelaLiveMessage.dkd_sender_role==='admin'||dkdAnyelaLiveMessage.dkd_sender_role==='system'||dkdAnyelaLiveMessage.dkd_sender_role==='anyela';const dkdAnyelaLiveClassName=dkdAnyelaLiveIsAdmin?'dkd_anyela_chat_bubble_anyela':'dkd_anyela_chat_bubble_member';const dkdAnyelaLiveName=dkdAnyelaLiveIsAdmin?'Anyela':(dkdAnyelaLiveMessage.dkd_sender_name||'Üye');return '<div class="dkd_anyela_chat_bubble '+dkdAnyelaLiveClassName+'"><strong>'+dkdAnyelaLiveEscape(dkdAnyelaLiveName)+'</strong>'+dkdAnyelaLiveEscape(dkdAnyelaLiveMessage.dkd_message_body)+'<span class="dkd_anyela_chat_meta">'+dkdAnyelaLiveEscape(dkdAnyelaLiveDate(dkdAnyelaLiveMessage.dkd_created_at))+'</span></div>';}).join('');dkdAnyelaLiveWindow.scrollTop=dkdAnyelaLiveWindow.scrollHeight;}
      async function dkdAnyelaLiveLoadMessages(){const dkdAnyelaLiveResult=await dkdAnyelaLiveClient.from('dkd_anyela_chat_messages').select('dkd_id, dkd_sender_role, dkd_sender_name, dkd_message_body, dkd_created_at').eq('dkd_user_id',dkdAnyelaLiveUserId).order('dkd_created_at',{ascending:true}).limit(80);if(dkdAnyelaLiveResult.error){if(dkdAnyelaLiveWindow){dkdAnyelaLiveWindow.innerHTML='<div class="dkd_anyela_chat_empty">Canlı sohbet yüklenemedi: '+dkdAnyelaLiveEscape(dkdAnyelaLiveResult.error.message)+'</div>';}return;}dkdAnyelaLiveMessages=dkdAnyelaLiveResult.data||[];dkdAnyelaLiveRenderMessages();}
      async function dkdAnyelaLiveSendMessage(){const dkdAnyelaLiveText=dkdAnyelaLiveInput&&dkdAnyelaLiveInput.value?dkdAnyelaLiveInput.value.trim():'';if(!dkdAnyelaLiveText){return;}if(dkdAnyelaLiveSendButton){dkdAnyelaLiveSendButton.disabled=true;}const dkdAnyelaLiveResult=await dkdAnyelaLiveClient.rpc('dkd_anyela_user_insert_chat_message',{dkd_message_text:dkdAnyelaLiveText});if(dkdAnyelaLiveSendButton){dkdAnyelaLiveSendButton.disabled=false;}if(dkdAnyelaLiveResult.error){alert('Mesaj gönderilemedi: '+dkdAnyelaLiveResult.error.message);return;}if(dkdAnyelaLiveInput){dkdAnyelaLiveInput.value='';}await dkdAnyelaLiveLoadMessages();}
      if(!dkdAnyelaLiveClient){return;}
      const dkdAnyelaLiveSessionResult=await dkdAnyelaLiveClient.auth.getSession();
      const dkdAnyelaLiveSession=dkdAnyelaLiveSessionResult&&dkdAnyelaLiveSessionResult.data?dkdAnyelaLiveSessionResult.data.session:null;
      const dkdAnyelaLiveUser=dkdAnyelaLiveSession&&dkdAnyelaLiveSession.user?dkdAnyelaLiveSession.user:null;
      if(!dkdAnyelaLiveUser){if(dkdAnyelaLiveWindow){dkdAnyelaLiveWindow.innerHTML='<div class="dkd_anyela_chat_empty">Canlı sohbet için hesabınla giriş yap. Anyela ile Hemen konuşmaya başla ilk mesajın ücretsiz.</div>';}if(dkdAnyelaLiveInput){dkdAnyelaLiveInput.disabled=true;dkdAnyelaLiveInput.placeholder='Canlı sohbet için giriş yap';}if(dkdAnyelaLiveSendButton){dkdAnyelaLiveSendButton.disabled=true;}return;}
      dkdAnyelaLiveUserId=dkdAnyelaLiveUser.id;
      await dkdAnyelaLiveLoadMessages();
      if(dkdAnyelaLiveSendButton){dkdAnyelaLiveSendButton.addEventListener('click',dkdAnyelaLiveSendMessage);}
      if(dkdAnyelaLiveInput){dkdAnyelaLiveInput.addEventListener('keydown',function dkdAnyelaLiveChatEnter(dkdAnyelaLiveEvent){if(dkdAnyelaLiveEvent.key==='Enter'){dkdAnyelaLiveEvent.preventDefault();dkdAnyelaLiveSendMessage();}});}
      dkdAnyelaLiveChannel=dkdAnyelaLiveClient.channel('dkd_anyela_live_chat_'+dkdAnyelaLiveUserId).on('postgres_changes',{event:'INSERT',schema:'public',table:'dkd_anyela_chat_messages',filter:'dkd_user_id=eq.'+dkdAnyelaLiveUserId},function dkdAnyelaLiveOnInsert(dkdAnyelaLivePayload){const dkdAnyelaLiveNewMessage=dkdAnyelaLivePayload&&dkdAnyelaLivePayload.new?dkdAnyelaLivePayload.new:null;if(!dkdAnyelaLiveNewMessage){return;}if(dkdAnyelaLiveMessages.some(function dkdAnyelaLiveHasMessage(dkdAnyelaLiveMessage){return dkdAnyelaLiveMessage.dkd_id===dkdAnyelaLiveNewMessage.dkd_id;})){return;}dkdAnyelaLiveMessages.push(dkdAnyelaLiveNewMessage);dkdAnyelaLiveRenderMessages();}).subscribe();
      window.addEventListener('beforeunload',function dkdAnyelaLiveLeave(){if(dkdAnyelaLiveChannel){dkdAnyelaLiveClient.removeChannel(dkdAnyelaLiveChannel);}});
    });
  }

  function dkdAnyelaLoadForumModule(){
    if(window.location.pathname.indexOf('/AnyelaBorn/ChatRoom/')===-1||document.getElementById('dkd_anyela_forum_rooms_script')){return;}
    const dkdAnyelaForumScript=document.createElement('script');
    dkdAnyelaForumScript.id='dkd_anyela_forum_rooms_script';
    dkdAnyelaForumScript.src='/AnyelaBorn/assets/dkd_anyela_forum_rooms.js?v=20260531b';
    document.body.appendChild(dkdAnyelaForumScript);
  }

  document.addEventListener('DOMContentLoaded',function dkdAnyelaLiveStart(){
    dkdAnyelaLiveProfileActivity();
    dkdAnyelaLiveChatRoom();
    dkdAnyelaLoadForumModule();
  });
})();
