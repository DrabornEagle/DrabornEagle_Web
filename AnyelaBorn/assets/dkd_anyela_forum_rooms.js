(function dkdAnyelaForumRoomsScope(){
  'use strict';

  const dkdForumSupabaseUrl='https://ztxlcfcwuwerxrhwfmte.supabase.co';
  const dkdForumSupabaseKey='sb_publishable_GSd5xFBwG9pioOY8N6MRQw_C2n7RLYa';
  const dkdForumScriptSrc='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  const dkdForumRooms={
    general:{dkd_title:'Genel Sohbet',dkd_hint:'Tanışma, günlük mesajlar ve Miami vibe konuşmaları.',dkd_icon:'💬'},
    vip:{dkd_title:'VIP Paket Odası',dkd_hint:'Özel paket kullanıcıları için seçkin forum alanı.',dkd_icon:'💎'},
    miami_live:{dkd_title:'Miami Live Plan',dkd_hint:'Canlı yayın, içerik planı ve etkinlik duyuruları.',dkd_icon:'🌴'}
  };
  let dkdForumClient=null;
  let dkdForumActiveRoom='general';
  let dkdForumChannel=null;
  let dkdForumMessages=[];
  let dkdForumHasSession=false;

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

  function dkdForumEscape(dkd_value){
    return String(dkd_value||'').replace(/[&<>"']/g,function(dkd_char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[dkd_char];});
  }

  function dkdForumDate(dkd_value){
    try{return dkd_value?new Date(dkd_value).toLocaleString('tr-TR'):'-';}catch(dkd_error){return '-';}
  }

  function dkdForumInjectStyle(){
    if(document.getElementById('dkd_anyela_forum_rooms_style')){return;}
    const dkd_style=document.createElement('style');
    dkd_style.id='dkd_anyela_forum_rooms_style';
    dkd_style.textContent='.dkd_anyela_forum_live_first{margin-top:16px!important}.dkd_anyela_forum_room_active{border-color:rgba(54,255,131,.55)!important;box-shadow:0 0 24px rgba(54,255,131,.16),inset 0 0 0 1px rgba(54,255,131,.22)!important}.dkd_anyela_forum_room_active .dkd_anyela_chat_room_count{color:#36ff83!important}.dkd_anyela_chat_room{cursor:pointer;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.dkd_anyela_chat_room:active{transform:scale(.985)}.dkd_anyela_forum_panel{margin-top:12px;padding:14px;border-radius:24px;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.12)}.dkd_anyela_forum_head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px}.dkd_anyela_forum_head h3{margin:0;font-size:18px}.dkd_anyela_forum_head p{margin:4px 0 0;color:rgba(255,255,255,.68);font-size:12px;line-height:1.4}.dkd_anyela_forum_badge{padding:7px 10px;border-radius:999px;color:#36ff83;background:rgba(54,255,131,.12);border:1px solid rgba(54,255,131,.28);font-size:12px;font-weight:950;white-space:nowrap}.dkd_anyela_forum_messages{display:grid;gap:10px;max-height:340px;overflow:auto;padding-right:2px}.dkd_anyela_forum_post{padding:12px 13px;border-radius:18px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.1)}.dkd_anyela_forum_post strong{display:block;color:#fff;margin-bottom:4px}.dkd_anyela_forum_post span{display:block;color:rgba(255,255,255,.84);font-size:13px;line-height:1.45}.dkd_anyela_forum_post small{display:block;margin-top:6px;color:rgba(255,255,255,.52);font-size:11px}.dkd_anyela_forum_empty{padding:13px;border-radius:18px;color:rgba(255,255,255,.84);background:rgba(24,247,255,.10);border:1px solid rgba(24,247,255,.18);line-height:1.45}.dkd_anyela_forum_form{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:12px}.dkd_anyela_forum_input{width:100%;min-height:48px;border:1px solid rgba(255,255,255,.15);outline:none;border-radius:18px;background:rgba(6,0,27,.72);color:#fff;padding:12px 13px}.dkd_anyela_forum_send{min-width:66px;border-radius:18px;color:#fff;font-weight:950;background:linear-gradient(135deg,#ff2bd6,#18f7ff);box-shadow:0 0 24px rgba(24,247,255,.24);cursor:pointer}.dkd_anyela_forum_send:disabled,.dkd_anyela_forum_input:disabled{opacity:.6;cursor:not-allowed}@media(max-width:420px){.dkd_anyela_forum_form{grid-template-columns:1fr}.dkd_anyela_forum_send{min-height:48px}}';
    document.head.appendChild(dkd_style);
  }

  function dkdForumMoveLiveChatUp(){
    const dkd_live=document.querySelector('[aria-label="Canlı sohbet"],[aria-label="Sohbet önizlemesi"]');
    const dkd_rooms=document.querySelector('[aria-label="Sohbet odaları"]');
    if(dkd_live&&dkd_rooms&&dkd_rooms.parentNode&&dkd_live.previousElementSibling!==dkd_rooms){
      dkd_live.classList.add('dkd_anyela_forum_live_first');
      dkd_rooms.parentNode.insertBefore(dkd_live,dkd_rooms);
    }
  }

  function dkdForumPrepareRooms(){
    const dkd_cards=Array.from(document.querySelectorAll('[aria-label="Sohbet odaları"] .dkd_anyela_chat_room'));
    const dkd_keys=['general','vip','miami_live'];
    dkd_cards.forEach(function(dkd_card,dkd_index){
      const dkd_key=dkd_keys[dkd_index];
      if(!dkd_key){return;}
      dkd_card.setAttribute('data-dkd-forum-room',dkd_key);
      dkd_card.setAttribute('role','button');
      dkd_card.setAttribute('tabindex','0');
      dkd_card.addEventListener('click',function(){dkdForumSelectRoom(dkd_key);});
      dkd_card.addEventListener('keydown',function(dkd_event){if(dkd_event.key==='Enter'||dkd_event.key===' '){dkd_event.preventDefault();dkdForumSelectRoom(dkd_key);}});
    });
  }

  function dkdForumEnsurePanel(){
    let dkd_panel=document.getElementById('dkd_anyela_forum_panel');
    if(dkd_panel){return dkd_panel;}
    const dkd_rooms_section=document.querySelector('[aria-label="Sohbet odaları"]');
    if(!dkd_rooms_section){return null;}
    dkd_panel=document.createElement('div');
    dkd_panel.id='dkd_anyela_forum_panel';
    dkd_panel.className='dkd_anyela_forum_panel';
    dkd_panel.innerHTML='<div class="dkd_anyela_forum_head"><div><h3 id="dkd_anyela_forum_title">Genel Sohbet</h3><p id="dkd_anyela_forum_hint">Forum yükleniyor...</p></div><span class="dkd_anyela_forum_badge">Forum Aktif</span></div><div class="dkd_anyela_forum_messages" id="dkd_anyela_forum_messages"><div class="dkd_anyela_forum_empty">Forum mesajları yükleniyor...</div></div><div class="dkd_anyela_forum_form"><input class="dkd_anyela_forum_input" id="dkd_anyela_forum_input" placeholder="Bu odaya forum mesajı yaz..." aria-label="Forum mesajı yaz"><button class="dkd_anyela_forum_send" id="dkd_anyela_forum_send" type="button">Paylaş</button></div>';
    dkd_rooms_section.appendChild(dkd_panel);
    const dkd_send=document.getElementById('dkd_anyela_forum_send');
    const dkd_input=document.getElementById('dkd_anyela_forum_input');
    if(dkd_send){dkd_send.addEventListener('click',dkdForumSendPost);}
    if(dkd_input){dkd_input.addEventListener('keydown',function(dkd_event){if(dkd_event.key==='Enter'){dkd_event.preventDefault();dkdForumSendPost();}});}
    return dkd_panel;
  }

  function dkdForumRenderRoomActive(){
    Array.from(document.querySelectorAll('[data-dkd-forum-room]')).forEach(function(dkd_card){
      const dkd_is_active=dkd_card.getAttribute('data-dkd-forum-room')===dkdForumActiveRoom;
      dkd_card.classList.toggle('dkd_anyela_forum_room_active',dkd_is_active);
    });
    const dkd_room=dkdForumRooms[dkdForumActiveRoom]||dkdForumRooms.general;
    const dkd_title=document.getElementById('dkd_anyela_forum_title');
    const dkd_hint=document.getElementById('dkd_anyela_forum_hint');
    if(dkd_title){dkd_title.textContent=dkd_room.dkd_icon+' '+dkd_room.dkd_title;}
    if(dkd_hint){dkd_hint.textContent=dkd_room.dkd_hint+' Forum gibi çalışır: üyeler mesaj paylaşır, yeni mesajlar canlı düşer.';}
  }

  function dkdForumRenderMessages(){
    const dkd_body=document.getElementById('dkd_anyela_forum_messages');
    if(!dkd_body){return;}
    if(!dkdForumMessages.length){dkd_body.innerHTML='<div class="dkd_anyela_forum_empty">Bu odada henüz mesaj yok. İlk forum mesajını sen paylaş.</div>';return;}
    dkd_body.innerHTML=dkdForumMessages.map(function(dkd_post){
      return '<article class="dkd_anyela_forum_post"><strong>'+dkdForumEscape(dkd_post.dkd_sender_name||'Üye')+'</strong><span>'+dkdForumEscape(dkd_post.dkd_message_body)+'</span><small>'+dkdForumEscape(dkdForumDate(dkd_post.dkd_created_at))+'</small></article>';
    }).join('');
    dkd_body.scrollTop=dkd_body.scrollHeight;
  }

  async function dkdForumLoadSummary(){
    const dkd_client=dkdForumGetClient();
    if(!dkd_client){return;}
    const dkd_result=await dkd_client.rpc('dkd_anyela_forum_room_summary');
    if(dkd_result.error){return;}
    const dkd_summary=dkd_result.data||{};
    const dkd_map={general:dkd_summary.general,vip:dkd_summary.vip,miami_live:dkd_summary.miami_live};
    Array.from(document.querySelectorAll('[data-dkd-forum-room]')).forEach(function(dkd_card){
      const dkd_key=dkd_card.getAttribute('data-dkd-forum-room');
      const dkd_count=dkd_card.querySelector('.dkd_anyela_chat_room_count');
      if(dkd_count){dkd_count.textContent=String(Number(dkd_map[dkd_key]||0));}
    });
  }

  async function dkdForumLoadMessages(){
    const dkd_client=dkdForumGetClient();
    const dkd_body=document.getElementById('dkd_anyela_forum_messages');
    if(!dkd_client||!dkd_body){return;}
    dkd_body.innerHTML='<div class="dkd_anyela_forum_empty">Forum mesajları yükleniyor...</div>';
    const dkd_result=await dkd_client.from('dkd_anyela_forum_posts').select('dkd_id,dkd_room_key,dkd_sender_name,dkd_message_body,dkd_created_at').eq('dkd_room_key',dkdForumActiveRoom).eq('dkd_is_hidden',false).order('dkd_created_at',{ascending:true}).limit(80);
    if(dkd_result.error){dkd_body.innerHTML='<div class="dkd_anyela_forum_empty">Forum yüklenemedi: '+dkdForumEscape(dkd_result.error.message)+'</div>';return;}
    dkdForumMessages=dkd_result.data||[];
    dkdForumRenderMessages();
  }

  async function dkdForumSendPost(){
    const dkd_input=document.getElementById('dkd_anyela_forum_input');
    const dkd_send=document.getElementById('dkd_anyela_forum_send');
    const dkd_text=dkd_input&&dkd_input.value?dkd_input.value.trim():'';
    if(!dkd_text){return;}
    if(!dkdForumHasSession){alert('Forum mesajı paylaşmak için hesabınla giriş yapmalısın.');return;}
    const dkd_client=dkdForumGetClient();
    if(!dkd_client){return;}
    if(dkd_send){dkd_send.disabled=true;}
    const dkd_result=await dkd_client.rpc('dkd_anyela_forum_insert_post',{dkd_room_key_value:dkdForumActiveRoom,dkd_message_text:dkd_text});
    if(dkd_send){dkd_send.disabled=false;}
    if(dkd_result.error){alert('Forum mesajı gönderilemedi: '+dkd_result.error.message);return;}
    dkd_input.value='';
    await dkdForumLoadMessages();
    await dkdForumLoadSummary();
  }

  function dkdForumStartRealtime(){
    const dkd_client=dkdForumGetClient();
    if(!dkd_client){return;}
    if(dkdForumChannel){dkd_client.removeChannel(dkdForumChannel);dkdForumChannel=null;}
    dkdForumChannel=dkd_client.channel('dkd_anyela_forum_room_'+dkdForumActiveRoom).on('postgres_changes',{event:'INSERT',schema:'public',table:'dkd_anyela_forum_posts',filter:'dkd_room_key=eq.'+dkdForumActiveRoom},function(dkd_payload){
      const dkd_post=dkd_payload&&dkd_payload.new?dkd_payload.new:null;
      if(!dkd_post||dkd_post.dkd_is_hidden){return;}
      if(dkdForumMessages.some(function(dkd_item){return dkd_item.dkd_id===dkd_post.dkd_id;})){return;}
      dkdForumMessages.push(dkd_post);
      dkdForumRenderMessages();
      dkdForumLoadSummary();
    }).subscribe();
  }

  async function dkdForumSelectRoom(dkd_room_key){
    dkdForumActiveRoom=dkd_room_key;
    dkdForumRenderRoomActive();
    await dkdForumLoadMessages();
    dkdForumStartRealtime();
  }

  async function dkdForumInit(){
    if(window.location.pathname.indexOf('/AnyelaBorn/ChatRoom/')===-1){return;}
    dkdForumInjectStyle();
    dkdForumMoveLiveChatUp();
    dkdForumPrepareRooms();
    dkdForumEnsurePanel();
    dkdForumEnsureSupabase(async function(){
      const dkd_client=dkdForumGetClient();
      if(!dkd_client){return;}
      const dkd_session_result=await dkd_client.auth.getSession();
      dkdForumHasSession=Boolean(dkd_session_result&&dkd_session_result.data&&dkd_session_result.data.session);
      const dkd_input=document.getElementById('dkd_anyela_forum_input');
      if(dkd_input&&!dkdForumHasSession){dkd_input.placeholder='Forum için hesabınla giriş yap';}
      await dkdForumLoadSummary();
      await dkdForumSelectRoom('general');
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',dkdForumInit);
  }else{
    dkdForumInit();
  }
})();
