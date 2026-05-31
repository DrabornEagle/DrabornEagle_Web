(function(){
'use strict';

const dkdUrl='https://ztxlcfcwuwerxrhwfmte.supabase.co';
const dkdKey='sb_publishable_GSd5xFBwG9pioOY8N6MRQw_C2n7RLYa';

const dkdClient=window.supabase.createClient(dkdUrl,dkdKey,{
  auth:{
    persistSession:true,
    autoRefreshToken:true,
    detectSessionInUrl:true,
    storageKey:'dkd_anyela_auth_session'
  }
});

let dkdPayments=[];
let dkdUsers=[];

const dkdById=(dkd_id)=>document.getElementById(dkd_id);
const dkdMoney=(dkd_value)=>new Intl.NumberFormat('tr-TR').format(Number(dkd_value||0))+' TL';
const dkdDate=(dkd_value)=>dkd_value?new Date(dkd_value).toLocaleString('tr-TR'):'-';

function dkdNote(dkd_message,dkd_bad){
  const dkd_box=dkdById('dkd_note');
  dkd_box.textContent=dkd_message;
  dkd_box.style.color=dkd_bad?'#ffb4ea':'#9efffb';
}

function dkdBadge(dkd_status){
  const dkd_names={pending:'Bekleyen',approved:'Onaylandı',rejected:'Reddedildi'};
  return '<span class="dkd_badge dkd_'+dkd_status+'">'+(dkd_names[dkd_status]||dkd_status)+'</span>';
}

async function dkdCheckAdmin(){
  const dkd_session_result=await dkdClient.auth.getSession();
  const dkd_session=dkd_session_result.data&&dkd_session_result.data.session;

  if(!dkd_session){
    dkdById('dkd_login_box').style.display='flex';
    dkdNote('Admin hesabınla giriş yapmalısın.',true);
    return false;
  }

  const dkd_admin_result=await dkdClient.rpc('dkd_anyela_is_admin');

  if(dkd_admin_result.error||!dkd_admin_result.data){
    dkdById('dkd_login_box').style.display='none';
    dkdNote('Bu hesap admin değil. Supabase profil rolünü admin yapmalısın.',true);
    return false;
  }

  dkdById('dkd_login_box').style.display='none';
  dkdNote('Admin yetkisi doğrulandı. Canlı veriler yüklendi.',false);
  return true;
}

async function dkdLoadData(){
  const dkd_is_admin=await dkdCheckAdmin();
  if(!dkd_is_admin){return;}

  const dkd_payments_result=await dkdClient
    .from('dkd_anyela_admin_payment_summary')
    .select('*')
    .order('dkd_created_at',{ascending:false});

  const dkd_users_result=await dkdClient
    .from('dkd_anyela_profiles')
    .select('*')
    .order('dkd_created_at',{ascending:false});

  if(dkd_payments_result.error){
    dkdNote('Ödemeler alınamadı: '+dkd_payments_result.error.message,true);
    return;
  }

  if(dkd_users_result.error){
    dkdNote('Kullanıcılar alınamadı: '+dkd_users_result.error.message,true);
    return;
  }

  dkdPayments=dkd_payments_result.data||[];
  dkdUsers=dkd_users_result.data||[];
  dkdRender();
}

function dkdFilteredRows(){
  const dkd_query=dkdById('dkd_search').value.toLowerCase().trim();
  const dkd_status=dkdById('dkd_status').value;
  const dkd_kind=dkdById('dkd_kind').value;

  return dkdPayments.filter((dkd_row)=>{
    const dkd_hay=[
      dkd_row.dkd_id,
      dkd_row.dkd_email,
      dkd_row.dkd_package_title,
      dkd_row.dkd_status,
      dkd_row.dkd_package_key
    ].join(' ').toLowerCase();

    return (!dkd_query||dkd_hay.includes(dkd_query))
      &&(dkd_status==='all'||dkd_row.dkd_status===dkd_status)
      &&(dkd_kind==='all'||dkd_row.dkd_payment_kind===dkd_kind);
  });
}

async function dkdOpenReceipt(dkd_path){
  if(!dkd_path){
    alert('Dekont yolu yok.');
    return;
  }

  const dkd_result=await dkdClient
    .storage
    .from('dkd-anyela-receipts')
    .createSignedUrl(dkd_path,600);

  if(dkd_result.error){
    alert('Dekont açılamadı: '+dkd_result.error.message);
    return;
  }

  window.open(dkd_result.data.signedUrl,'_blank');
}

async function dkdMarkPayment(dkd_id,dkd_status){
  const dkd_note=prompt(dkd_status==='approved'?'Onay notu':'Red notu','Admin panel');

  const dkd_result=await dkdClient.rpc('dkd_anyela_mark_payment',{
    dkd_payment_id:dkd_id,
    dkd_next_status:dkd_status,
    dkd_note:dkd_note||''
  });

  if(dkd_result.error){
    alert('İşlem başarısız: '+dkd_result.error.message);
    return;
  }

  await dkdLoadData();
}

function dkdShowDetail(dkd_id){
  const dkd_row=dkdPayments.find((dkd_item)=>dkd_item.dkd_id===dkd_id);
  dkdById('dkd_detail_box').textContent=dkd_row?JSON.stringify(dkd_row,null,2):'Kayıt bulunamadı.';
}

function dkdRender(){
  const dkd_rows=dkdFilteredRows();

  dkdById('dkd_stat_total').textContent=dkdPayments.length;
  dkdById('dkd_stat_pending').textContent=dkdPayments.filter((dkd_item)=>dkd_item.dkd_status==='pending').length;
  dkdById('dkd_stat_approved').textContent=dkdMoney(
    dkdPayments
      .filter((dkd_item)=>dkd_item.dkd_status==='approved')
      .reduce((dkd_sum,dkd_item)=>dkd_sum+Number(dkd_item.dkd_amount_tl||0),0)
  );
  dkdById('dkd_stat_users').textContent=dkdUsers.length;

  dkdById('dkd_payments_body').innerHTML=dkd_rows.map((dkd_row)=>{
    const dkd_offer=dkd_row.dkd_offer_payload&&Object.keys(dkd_row.dkd_offer_payload).length
      ? '<br><span class="dkd_mini">Teklif: '+JSON.stringify(dkd_row.dkd_offer_payload)+'</span>'
      : '';

    return '<tr>'
      +'<td>'+dkdDate(dkd_row.dkd_created_at)+'<br><span class="dkd_mini">'+dkd_row.dkd_id+'</span></td>'
      +'<td><b>'+String(dkd_row.dkd_email||'-')+'</b><br><span class="dkd_mini">'+String(dkd_row.dkd_display_name||'-')+' / '+String(dkd_row.dkd_role||'-')+'</span></td>'
      +'<td><b>'+String(dkd_row.dkd_package_title||'-')+'</b><br><span class="dkd_mini">'+String(dkd_row.dkd_payment_kind||'-')+' / '+String(dkd_row.dkd_package_key||'-')+'</span>'+dkd_offer+'</td>'
      +'<td>'+dkdMoney(dkd_row.dkd_amount_tl)+'</td>'
      +'<td>'+dkdBadge(dkd_row.dkd_status)+'</td>'
      +'<td><button class="dkd_btn dkd_soft" data-receipt="'+String(dkd_row.dkd_receipt_path||'')+'">Dekont</button></td>'
      +'<td><button class="dkd_btn" data-detail="'+dkd_row.dkd_id+'">Detay</button> <button class="dkd_btn" data-approve="'+dkd_row.dkd_id+'">Onayla</button> <button class="dkd_btn dkd_danger" data-reject="'+dkd_row.dkd_id+'">Reddet</button></td>'
      +'</tr>';
  }).join('')||'<tr><td colspan="7">Ödeme kaydı yok.</td></tr>';

  dkdById('dkd_users_body').innerHTML=dkdUsers.map((dkd_user)=>{
    return '<div class="dkd_user"><strong>'+String(dkd_user.dkd_email||'-')+'</strong><small>'+String(dkd_user.dkd_role||'-')+' • '+dkdDate(dkd_user.dkd_created_at)+'</small></div>';
  }).join('')||'Kullanıcı yok.';

  document.querySelectorAll('[data-receipt]').forEach((dkd_button)=>{
    dkd_button.onclick=()=>dkdOpenReceipt(dkd_button.getAttribute('data-receipt'));
  });

  document.querySelectorAll('[data-detail]').forEach((dkd_button)=>{
    dkd_button.onclick=()=>dkdShowDetail(dkd_button.getAttribute('data-detail'));
  });

  document.querySelectorAll('[data-approve]').forEach((dkd_button)=>{
    dkd_button.onclick=()=>dkdMarkPayment(dkd_button.getAttribute('data-approve'),'approved');
  });

  document.querySelectorAll('[data-reject]').forEach((dkd_button)=>{
    dkd_button.onclick=()=>dkdMarkPayment(dkd_button.getAttribute('data-reject'),'rejected');
  });
}

dkdById('dkd_admin_login').onclick=async()=>{
  const dkd_email=dkdById('dkd_admin_email').value.trim();
  const dkd_password=dkdById('dkd_admin_password').value;

  const dkd_result=await dkdClient.auth.signInWithPassword({
    email:dkd_email,
    password:dkd_password
  });

  if(dkd_result.error){
    dkdNote('Giriş başarısız: '+dkd_result.error.message,true);
    return;
  }

  await dkdLoadData();
};

dkdById('dkd_logout').onclick=async()=>{
  await dkdClient.auth.signOut();
  location.reload();
};

dkdById('dkd_refresh').onclick=dkdLoadData;
dkdById('dkd_search').oninput=dkdRender;
dkdById('dkd_status').onchange=dkdRender;
dkdById('dkd_kind').onchange=dkdRender;

dkdLoadData();
})();
