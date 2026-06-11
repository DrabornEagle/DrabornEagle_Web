const dkdState = { dkdKey: localStorage.getItem('dkd_admin_key') || '' };
const dkdLoginCard = document.getElementById('dkdLoginCard');
const dkdPanel = document.getElementById('dkdPanel');
const dkdAdminKey = document.getElementById('dkdAdminKey');
const dkdActionResult = document.getElementById('dkdActionResult');

const dkdStatusTr = { mapped:'işlendi', pending:'bekliyor', accepted:'işleniyor', paused:'duraklatıldı', rejected:'reddedildi', draft:'taslak', published:'yayınlandı', cancelled:'iptal edildi', failed:'hatalı' };
const dkdModeTr = { append_query:'Bağlantının sonuna ekle', template:'Hazır bağlantı şablonu', none:'Kullanma' };

function dkdHeaders(){return {'content-type':'application/json','x-dkd-admin-key':dkdState.dkdKey};}
async function dkdApi(dkdPath, dkdOptions={}){const dkdRes=await fetch(dkdPath,{...dkdOptions,headers:{...dkdHeaders(),...(dkdOptions.headers||{})}});const dkdJson=await dkdRes.json();if(!dkdRes.ok)throw new Error(dkdJson.dkd_error||'API error');return dkdJson;}
function dkdMoney(dkdValue, dkdCurrency){if(dkdValue===null||dkdValue===undefined)return 'Fiyat yok';return `${Number(dkdValue).toLocaleString('tr-TR')} ${dkdCurrency||''}`.trim();}
function dkdPill(dkdText, dkdClass=''){return `<span class="dkd-pill ${dkdClass}">${dkdEscape(dkdText)}</span>`;}
function dkdSetHtml(dkdId, dkdHtml){document.getElementById(dkdId).innerHTML=dkdHtml||'<p class="dkd-muted">Kayıt yok.</p>';}
function dkdEscape(dkdValue){return String(dkdValue??'').replace(/[&<>"]/g,(dkdChar)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[dkdChar]));}
function dkdTrStatus(v){return dkdStatusTr[v] || v || '-';}
function dkdTrMode(v){return dkdModeTr[v] || v || '-';}

async function dkdLoadAll(){
  try{
    dkdActionResult.textContent='';
    const [dkdHealth, dkdSources, dkdWatch, dkdProducts, dkdHot, dkdPosts, dkdAffiliate] = await Promise.all([
      dkdApi('/api/dkd-health'),
      dkdApi('/api/dkd-sources'),
      dkdApi('/api/dkd-watch-links'),
      dkdApi('/api/dkd-products'),
      dkdApi('/api/dkd-hot-feed'),
      dkdApi('/api/dkd-social-posts'),
      dkdApi('/api/dkd-affiliate-rules')
    ]);
    dkdRenderHealth(dkdHealth.dkd_settings);
    dkdRenderSources(dkdSources.dkd_rows);
    dkdRenderAffiliateRules(dkdAffiliate.dkd_rows);
    dkdRenderWatchLinks(dkdWatch.dkd_rows);
    dkdRenderProducts(dkdProducts.dkd_rows);
    dkdRenderHotFeed(dkdHot.dkd_rows);
    dkdRenderPosts(dkdPosts.dkd_rows);
  }catch(dkdError){dkdActionResult.textContent=`Hata: ${dkdError.message}`;}
}

function dkdHealthView(dkdRow){
  const dkdKey = dkdRow.dkd_setting_key;
  const dkdValue = dkdRow.dkd_setting_value || {};
  if(dkdKey === 'dkd_deal_source_admin_version') return {dkdTitle:'Kaynak yönetimi',dkdDescription:'Kaynak aktifliği, izin ve kontrol aralıkları panelden yönetilebilir.',dkdPills:['v0.10','hazır']};
  if(dkdKey === 'dkd_deal_affiliate_links_version') return {dkdTitle:'Affiliate sistemi',dkdDescription:'Kaynak bazlı affiliate kuralları hazır. Şimdilik kapalı bırakılabilir.',dkdPills:['v0.9','sona bırakıldı']};
  if(dkdKey === 'dkd_deal_hot_deals_version') return {dkdTitle:'Fırsat skoru sistemi',dkdDescription:`Sıcak fırsat akışı aktif. Sürüm ${dkdValue.version || '-'} · Etiketler: ${(dkdValue.labels || []).join(', ')}`,dkdPills:['aktif','fırsat akışı']};
  if(dkdKey === 'dkd_deal_termux_telegram_live_test') return {dkdTitle:'Telegram canlı test',dkdDescription:`Canlı gönderim sonucu: ${dkdValue.status || '-'} · Worker: ${dkdValue.worker || '-'}`,dkdPills:[dkdValue.telegram || 'telegram','test geçti']};
  if(dkdKey === 'dkd_deal_worker_runtime_mode') return {dkdTitle:'Çalışma modu',dkdDescription:`Şu an ${dkdValue.runtime === 'termux_test_first' ? 'Termux test modu' : (dkdValue.runtime || 'bilinmiyor')}. CX33 durumu: ${dkdValue.cx33_status === 'paused_until_user_confirms_purchased' ? 'sen haber verene kadar beklemede' : (dkdValue.cx33_status || '-')}`,dkdPills:['Termux','CX33 sonra']};
  return {dkdTitle:dkdKey,dkdDescription:JSON.stringify(dkdValue),dkdPills:['sistem']};
}

function dkdRenderHealth(dkdRows){dkdSetHtml('dkdHealth',dkdRows.map((dkdRow)=>{const dkdView=dkdHealthView(dkdRow);return `<div class="dkd-item"><div class="dkd-title">${dkdEscape(dkdView.dkdTitle)}</div><div class="dkd-meta">${dkdEscape(dkdView.dkdDescription)}</div>${dkdView.dkdPills.map((p)=>dkdPill(p,'hot')).join('')}</div>`;}).join(''));}
function dkdRenderSources(dkdRows){dkdSetHtml('dkdSources',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_source_name)} — ${r.dkd_is_active?'aktif':'kapalı'}</div><div class="dkd-meta">Kaynak: ${dkdEscape(r.dkd_source_key)} · Parser: ${dkdEscape(r.dkd_parser_mode)} · Ülke: ${dkdEscape(r.dkd_country_code)}</div>${dkdPill(r.dkd_allowed_by_terms?'izinli':'izin kapalı',r.dkd_allowed_by_terms?'hot':'warn')}${dkdPill(r.dkd_needs_manual_review?'inceleme bekliyor':'inceleme yok',r.dkd_needs_manual_review?'warn':'hot')}${dkdPill(`öncelik ${r.dkd_priority}`)}${dkdPill(`${r.dkd_crawl_interval_minutes} dk`)}<form class="dkd-source-form" data-source-id="${dkdEscape(r.dkd_id)}"><label class="dkd-switch"><input type="checkbox" name="dkd_is_active" ${r.dkd_is_active?'checked':''}> Aktif</label><label class="dkd-switch"><input type="checkbox" name="dkd_allowed_by_terms" ${r.dkd_allowed_by_terms?'checked':''}> Manuel ürün linki izni</label><label class="dkd-switch"><input type="checkbox" name="dkd_needs_manual_review" ${r.dkd_needs_manual_review?'checked':''}> Manuel inceleme beklesin</label><input name="dkd_priority" type="number" min="1" placeholder="Öncelik" value="${dkdEscape(r.dkd_priority)}"><input name="dkd_crawl_interval_minutes" type="number" min="5" placeholder="Kontrol aralığı dakika" value="${dkdEscape(r.dkd_crawl_interval_minutes)}"><button type="submit">Kaydet</button></form></div>`).join(''));document.querySelectorAll('.dkd-source-form').forEach((form)=>form.addEventListener('submit',dkdSaveSource));}
function dkdRenderAffiliateRules(dkdRows){dkdSetHtml('dkdAffiliateRules',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_source_name)} — ${r.dkd_is_active?'aktif':'kapalı'}</div><div class="dkd-meta">Yöntem: ${dkdEscape(dkdTrMode(r.dkd_affiliate_mode))} · Eklenen bilgi: ${dkdEscape(r.dkd_param_key||'-')}=${dkdEscape(r.dkd_param_value||'-')}</div>${dkdPill(r.dkd_source_key,r.dkd_is_active?'hot':'warn')}<div class="dkd-meta">Nasıl çalışır: Ürün bağlantısı Telegram’a giderken, aşağıdaki bilgi bağlantının sonuna eklenir.</div><form class="dkd-affiliate-form" data-rule-id="${dkdEscape(r.dkd_affiliate_rule_id)}"><select name="dkd_affiliate_mode"><option value="append_query" ${r.dkd_affiliate_mode==='append_query'?'selected':''}>Bağlantının sonuna ekle</option><option value="template" ${r.dkd_affiliate_mode==='template'?'selected':''}>Hazır bağlantı şablonu</option><option value="none" ${r.dkd_affiliate_mode==='none'?'selected':''}>Kullanma</option></select><input name="dkd_param_key" placeholder="Ek bilgi adı örn: ref, aff, tag" value="${dkdEscape(r.dkd_param_key||'')}"><input name="dkd_param_value" placeholder="Affiliate kodun / mağaza takip kodun" value="${dkdEscape(r.dkd_param_value||'')}"><button type="submit">Kaydet</button><label class="dkd-switch"><input type="checkbox" name="dkd_is_active" ${r.dkd_is_active?'checked':''}> Aktif</label><input name="dkd_template_url" placeholder="Hazır bağlantı şablonu, {url} ürün bağlantısı yerine geçer" value="${dkdEscape(r.dkd_template_url||'')}"></form></div>`).join(''));document.querySelectorAll('.dkd-affiliate-form').forEach((form)=>form.addEventListener('submit',dkdSaveAffiliateRule));}
function dkdRenderWatchLinks(dkdRows){dkdSetHtml('dkdWatchLinks',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_detected_source_key||'bilinmeyen')} — ${dkdEscape(dkdTrStatus(r.dkd_status))}</div><div class="dkd-meta">${dkdEscape(r.dkd_submitted_url)}</div>${dkdPill(`öncelik ${r.dkd_priority}`)}${r.dkd_product_name?dkdPill(r.dkd_product_name,'hot'):''}</div>`).join(''));}
function dkdRenderProducts(dkdRows){dkdSetHtml('dkdProducts',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_product_name)}</div><div class="dkd-meta">${dkdMoney(r.dkd_current_price,r.dkd_currency_code)} · ${dkdEscape(r.dkd_stock_status)} · Puan ${dkdEscape(r.dkd_rating||'-')} · Yorum ${dkdEscape(r.dkd_review_count||'-')}</div>${dkdPill(`fırsat puanı ${r.dkd_deal_score}`)}${dkdPill(`trend ${r.dkd_trend_score}`)}<div class="dkd-meta">${dkdEscape(r.dkd_product_url)}</div></div>`).join(''));}
function dkdRenderHotFeed(dkdRows){dkdSetHtml('dkdHotFeed',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(r.dkd_product_name)}</div><div class="dkd-meta">${dkdMoney(r.dkd_current_price,r.dkd_currency_code)} · ${dkdEscape(r.dkd_source_key)}</div>${dkdPill(r.dkd_heat_label,r.dkd_heat_label==='super_hot'?'hot':'warn')}${dkdPill(`sıcaklık ${r.dkd_hot_score}`)}${dkdPill(`indirim %${r.dkd_discount_percent||0}`)}</div>`).join(''));}
function dkdRenderPosts(dkdRows){dkdSetHtml('dkdSocialPosts',dkdRows.map((r)=>`<div class="dkd-item"><div class="dkd-title">${dkdEscape(dkdTrStatus(r.dkd_status))} — ${dkdEscape(r.dkd_channel_key||'-')}</div><div class="dkd-meta">${dkdEscape((r.dkd_caption||'').slice(0,180))}</div>${r.dkd_published_at?dkdPill('yayınlandı','hot'):''}${r.dkd_status==='failed'?dkdPill('hatalı','danger'):''}</div>`).join(''));}

async function dkdSaveSource(dkdEvent){dkdEvent.preventDefault();const form=dkdEvent.currentTarget;const fd=new FormData(form);try{const result=await dkdApi(`/api/dkd-sources/${form.dataset.sourceId}`,{method:'POST',body:JSON.stringify({dkd_is_active:fd.get('dkd_is_active')==='on',dkd_allowed_by_terms:fd.get('dkd_allowed_by_terms')==='on',dkd_needs_manual_review:fd.get('dkd_needs_manual_review')==='on',dkd_priority:Number(fd.get('dkd_priority')||10),dkd_crawl_interval_minutes:Number(fd.get('dkd_crawl_interval_minutes')||1440)})});dkdActionResult.textContent=JSON.stringify(result,null,2);await dkdLoadAll();}catch(e){dkdActionResult.textContent=`Hata: ${e.message}`;}}
async function dkdSaveAffiliateRule(dkdEvent){dkdEvent.preventDefault();const form=dkdEvent.currentTarget;const fd=new FormData(form);try{const result=await dkdApi(`/api/dkd-affiliate-rules/${form.dataset.ruleId}`,{method:'POST',body:JSON.stringify({dkd_affiliate_mode:fd.get('dkd_affiliate_mode'),dkd_param_key:fd.get('dkd_param_key'),dkd_param_value:fd.get('dkd_param_value'),dkd_template_url:fd.get('dkd_template_url'),dkd_is_active:fd.get('dkd_is_active')==='on'})});dkdActionResult.textContent=JSON.stringify(result,null,2);await dkdLoadAll();}catch(e){dkdActionResult.textContent=`Hata: ${e.message}`;}}

document.getElementById('dkdSaveKeyBtn').addEventListener('click',async()=>{dkdState.dkdKey=dkdAdminKey.value.trim();localStorage.setItem('dkd_admin_key',dkdState.dkdKey);dkdLoginCard.hidden=true;dkdPanel.hidden=false;await dkdLoadAll();});
document.getElementById('dkdRefreshBtn').addEventListener('click',dkdLoadAll);
document.getElementById('dkdAddLinkForm').addEventListener('submit',async(dkdEvent)=>{dkdEvent.preventDefault();try{const dkdUrl=document.getElementById('dkdProductUrl').value.trim();const dkdResult=await dkdApi('/api/dkd-watch-links',{method:'POST',body:JSON.stringify({dkd_url:dkdUrl,dkd_priority:10})});dkdActionResult.textContent=JSON.stringify(dkdResult,null,2);document.getElementById('dkdProductUrl').value='';await dkdLoadAll();}catch(dkdError){dkdActionResult.textContent=`Hata: ${dkdError.message}`;}});
document.getElementById('dkdGenerateDraftsBtn').addEventListener('click',async()=>{try{const dkdResult=await dkdApi('/api/dkd-generate-drafts',{method:'POST',body:JSON.stringify({dkd_limit:10})});dkdActionResult.textContent=JSON.stringify(dkdResult,null,2);await dkdLoadAll();}catch(dkdError){dkdActionResult.textContent=`Hata: ${dkdError.message}`;}});
if(dkdState.dkdKey){dkdLoginCard.hidden=true;dkdPanel.hidden=false;dkdLoadAll();}
