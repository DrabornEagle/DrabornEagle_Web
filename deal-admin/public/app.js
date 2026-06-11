const dkdState = { dkdKey: localStorage.getItem('dkd_admin_key') || '' };
const dkdLoginCard = document.getElementById('dkdLoginCard');
const dkdPanel = document.getElementById('dkdPanel');
const dkdAdminKey = document.getElementById('dkdAdminKey');
const dkdActionResult = document.getElementById('dkdActionResult');

function dkdHeaders(){return {'content-type':'application/json','x-dkd-admin-key':dkdState.dkdKey};}
async function dkdApi(dkdPath, dkdOptions={}){const dkdRes=await fetch(dkdPath,{...dkdOptions,headers:{...dkdHeaders(),...(dkdOptions.headers||{})}});const dkdJson=await dkdRes.json();if(!dkdRes.ok)throw new Error(dkdJson.dkd_error||'API error');return dkdJson;}
function dkdMoney(dkdValue, dkdCurrency){if(dkdValue===null||dkdValue===undefined)return 'Fiyat yok';return `${Number(dkdValue).toLocaleString('tr-TR')} ${dkdCurrency||''}`.trim();}
function dkdPill(dkdText, dkdClass=''){return `<span class="dkd-pill ${dkdClass}">${dkdEscape(dkdText)}</span>`;}
function dkdSetHtml(dkdId, dkdHtml){document.getElementById(dkdId).innerHTML=dkdHtml||'<p class="dkd-muted">Kayıt yok.</p>';}
function dkdEscape(dkdValue){return String(dkdValue??'').replace(/[&<>"]/g,(dkdChar)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[dkdChar]));}

async function dkdLoadAll(){
  try{
    dkdActionResult.textContent='';
    const [dkdHealth, dkdWatch, dkdProducts, dkdHot, dkdPosts] = await Promise.all([
      dkdApi('/api/dkd-health'),
      dkdApi('/api/dkd-watch-links'),
      dkdApi('/api/dkd-products'),
      dkdApi('/api/dkd-hot-feed'),
      dkdApi('/api/dkd-social-posts')
    ]);
    dkdRenderHealth(dkdHealth.dkd_settings);
    dkdRenderWatchLinks(dkdWatch.dkd_rows);
    dkdRenderProducts(dkdProducts.dkd_rows);
    dkdRenderHotFeed(dkdHot.dkd_rows);
    dkdRenderPosts(dkdPosts.dkd_rows);
  }catch(dkdError){dkdActionResult.textContent=`Hata: ${dkdError.message}`;}
}

function dkdHealthView(dkdRow){
  const dkdKey = dkdRow.dkd_setting_key;
  const dkdValue = dkdRow.dkd_setting_value || {};
  if(dkdKey === 'dkd_deal_hot_deals_version'){
    return {dkdTitle:'Fırsat skoru sistemi',dkdDescription:`Hot feed aktif. Sürüm ${dkdValue.version || '-'} · Etiketler: ${(dkdValue.labels || []).join(', ')}`,dkdPills:['aktif','hot feed']};
  }
  if(dkdKey === 'dkd_deal_termux_telegram_live_test'){
    return {dkdTitle:'Telegram canlı test',dkdDescription:`Canlı gönderim sonucu: ${dkdValue.status || '-'} · Worker: ${dkdValue.worker || '-'}`,dkdPills:[dkdValue.telegram || 'telegram','test geçti']};
  }
  if(dkdKey === 'dkd_deal_worker_runtime_mode'){
    return {dkdTitle:'Çalışma modu',dkdDescription:`Şu an ${dkdValue.runtime === 'termux_test_first' ? 'Termux test modu' : (dkdValue.runtime || 'bilinmiyor')}. CX33 durumu: ${dkdValue.cx33_status === 'paused_until_user_confirms_purchased' ? 'sen haber verene kadar beklemede' : (dkdValue.cx33_status || '-')}`,dkdPills:['Termux','CX33 sonra']};
  }
  return {dkdTitle:dkdKey,dkdDescription:JSON.stringify(dkdValue),dkdPills:['sistem']};
}

function dkdRenderHealth(dkdRows){dkdSetHtml('dkdHealth',dkdRows.map((dkdRow)=>{const dkdView=dkdHealthView(dkdRow);return `<div class="dkd-item"><div class="dkd-title">${dkdEscape(dkdView.dkdTitle)}</div><div class="dkd-meta">${dkdEscape(dkdView.dkdDescription)}</div>${dkdView.dkdPills.map((p)=>dkdPill(p,'hot')).join('')}</div>`;}).join(''));}
function dkdRenderWatchLinks(dkdRows){dkdSetHtml('dkdWatchLinks',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_detected_source_key||'unknown')} — ${dkdEscape(r.dkd_status)}</div><div class="dkd-meta">${dkdEscape(r.dkd_submitted_url)}</div>${dkdPill(`priority ${r.dkd_priority}`)}${r.dkd_product_name?dkdPill(r.dkd_product_name,'hot'):''}</div>`).join(''));}
function dkdRenderProducts(dkdRows){dkdSetHtml('dkdProducts',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_product_name)}</div><div class="dkd-meta">${dkdMoney(r.dkd_current_price,r.dkd_currency_code)} · ${dkdEscape(r.dkd_stock_status)} · Puan ${dkdEscape(r.dkd_rating||'-')} · Yorum ${dkdEscape(r.dkd_review_count||'-')}</div>${dkdPill(`deal ${r.dkd_deal_score}`)}${dkdPill(`trend ${r.dkd_trend_score}`)}<div class="dkd-meta">${dkdEscape(r.dkd_product_url)}</div></div>`).join(''));}
function dkdRenderHotFeed(dkdRows){dkdSetHtml('dkdHotFeed',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_product_name)}</div><div class="dkd-meta">${dkdMoney(r.dkd_current_price,r.dkd_currency_code)} · ${dkdEscape(r.dkd_source_key)}</div>${dkdPill(r.dkd_heat_label,r.dkd_heat_label==='super_hot'?'hot':'warn')}${dkdPill(`hot ${r.dkd_hot_score}`)}${dkdPill(`discount %${r.dkd_discount_percent||0}`)}</div>`).join(''));}
function dkdRenderPosts(dkdRows){dkdSetHtml('dkdSocialPosts',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_status)} — ${dkdEscape(r.dkd_channel_key||'-')}</div><div class="dkd-meta">${dkdEscape((r.dkd_caption||'').slice(0,180))}</div>${r.dkd_published_at?dkdPill('published','hot'):''}${r.dkd_status==='failed'?dkdPill('failed','danger'):''}</div>`).join(''));}

document.getElementById('dkdSaveKeyBtn').addEventListener('click',async()=>{dkdState.dkdKey=dkdAdminKey.value.trim();localStorage.setItem('dkd_admin_key',dkdState.dkdKey);dkdLoginCard.hidden=true;dkdPanel.hidden=false;await dkdLoadAll();});
document.getElementById('dkdRefreshBtn').addEventListener('click',dkdLoadAll);
document.getElementById('dkdAddLinkForm').addEventListener('submit',async(dkdEvent)=>{dkdEvent.preventDefault();try{const dkdUrl=document.getElementById('dkdProductUrl').value.trim();const dkdResult=await dkdApi('/api/dkd-watch-links',{method:'POST',body:JSON.stringify({dkd_url:dkdUrl,dkd_priority:10})});dkdActionResult.textContent=JSON.stringify(dkdResult,null,2);document.getElementById('dkdProductUrl').value='';await dkdLoadAll();}catch(dkdError){dkdActionResult.textContent=`Hata: ${dkdError.message}`;}});
document.getElementById('dkdGenerateDraftsBtn').addEventListener('click',async()=>{try{const dkdResult=await dkdApi('/api/dkd-generate-drafts',{method:'POST',body:JSON.stringify({dkd_limit:10})});dkdActionResult.textContent=JSON.stringify(dkdResult,null,2);await dkdLoadAll();}catch(dkdError){dkdActionResult.textContent=`Hata: ${dkdError.message}`;}});

if(dkdState.dkdKey){dkdLoginCard.hidden=true;dkdPanel.hidden=false;dkdLoadAll();}
