const SUPABASE_URL='https://xpdiwyxnnrmyvpcqwuyb.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_cu71JQGPiRusMw_YeZzUbg_6r9r13TG';
const REQUEST_URL=`${SUPABASE_URL}/functions/v1/drabornpark-public-request`;
const DELETE_URL=`${SUPABASE_URL}/functions/v1/drabornpark-account-delete`;
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
async function api(url,body,headers={}){const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});const data=await response.json().catch(()=>({}));if(!response.ok){const error=new Error(data.error||'İstek işlenemedi.');error.status=response.status;error.data=data;throw error}return data}

async function webDeleteLogin(event){
  event.preventDefault();const status=$('#delete-status');if(status)status.innerHTML='';
  const email=$('#delete-email')?.value.trim();const password=$('#delete-password')?.value;
  try{
    const auth=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const session=await auth.json();if(!auth.ok||!session.access_token)throw new Error('Giriş bilgileri doğrulanamadı.');
    if(!confirm('DraBornPark hesabı ve hesaba bağlı kullanıcı verileri kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam edilsin mi?'))return;
    await api(DELETE_URL,{confirm:true},{apikey:PUBLISHABLE_KEY,Authorization:`Bearer ${session.access_token}`});
    if(status)status.innerHTML='<div class="message ok">Hesabınız ve hesaba bağlı DraBornPark kullanıcı verileri kalıcı olarak silindi.</div>';event.target.reset();
  }catch(error){if(status)status.innerHTML=`<div class="message error">${esc(error.message||'Silme işlemi tamamlanamadı.')}</div>`;}
}

async function deletionRequest(event){
  event.preventDefault();const status=$('#request-status');
  try{await api(REQUEST_URL,{action:'account_deletion_request',email:$('#request-email')?.value,reason:$('#request-reason')?.value});if(status)status.innerHTML='<div class="message ok">Hesap silme talebiniz alındı.</div>';event.target.reset();}
  catch{if(status)status.innerHTML='<div class="message error">Talep gönderilemedi. Lütfen daha sonra tekrar deneyin.</div>';}
}

async function supportRequest(event){
  event.preventDefault();const status=$('#support-status');
  try{await api(REQUEST_URL,{action:'support',email:$('#support-email')?.value,subject:$('#support-subject')?.value,body:$('#support-body')?.value});if(status)status.innerHTML='<div class="message ok">Destek talebiniz alındı.</div>';event.target.reset();}
  catch{if(status)status.innerHTML='<div class="message error">Destek talebi gönderilemedi. Lütfen daha sonra tekrar deneyin.</div>';}
}

document.addEventListener('DOMContentLoaded',()=>{
  $('#delete-login-form')?.addEventListener('submit',webDeleteLogin);
  $('#delete-request-form')?.addEventListener('submit',deletionRequest);
  $('#support-form')?.addEventListener('submit',supportRequest);
});