(function () {
  'use strict';
  const dkd_root_element = document.getElementById('dkd_detail_root');
  const dkd_slug_value = document.body.getAttribute('data-dkd-project') || new URLSearchParams(window.location.search).get('project');
  const dkd_project_value = (window.dkd_project_values || []).find(function (dkd_candidate_value) { return dkd_candidate_value['dkd_slug'] === dkd_slug_value; });
  function dkd_escape_html(dkd_value) { return String(dkd_value).replace(/[&<>'"]/g,function(dkd_character_value){return({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[dkd_character_value];}); }
  function dkd_list_html(dkd_values) { return dkd_values.map(function(dkd_value){return '<li><span>✓</span>'+dkd_escape_html(dkd_value)+'</li>';}).join(''); }
  function dkd_actions_html() {
    let dkd_html_value = '';
    if (dkd_project_value['dkd_web']) dkd_html_value += '<a class="dkd_button dkd_button_primary" href="'+dkd_project_value['dkd_web']+'" target="_blank" rel="noopener">Web Sayfasını Aç ↗</a>';
    if (dkd_project_value['dkd_store']) dkd_html_value += '<a class="dkd_button" href="'+dkd_project_value['dkd_store']+'" target="_blank" rel="noopener">Google Play\'den İndir ↗</a>';
    if (!dkd_html_value) dkd_html_value = '<span class="dkd_coming">Erişim bağlantıları yakında burada.</span>';
    return dkd_html_value;
  }
  function dkd_mock_html() {
    return '<div class="dkd_detail_devices" style="--dkd-accent:'+dkd_project_value['dkd_accent']+'"><div class="dkd_detail_phone dkd_phone_back"><div class="dkd_phone_ui"><span>'+dkd_escape_html(dkd_project_value['dkd_code'])+'</span><b>LIVE</b><i></i><i></i><i></i></div></div><div class="dkd_detail_phone"><div class="dkd_phone_ui"><span>'+dkd_escape_html(dkd_project_value['dkd_name'])+'</span><strong>'+dkd_escape_html(dkd_project_value['dkd_code'])+'</strong><div class="dkd_phone_panel">'+dkd_escape_html(dkd_project_value['dkd_category_label'])+'</div><div class="dkd_phone_panel dkd_phone_panel_small">DRABORNEAGLE ECOSYSTEM</div></div></div></div>';
  }
  if (!dkd_project_value) { if (dkd_root_element) dkd_root_element.innerHTML='<section class="dkd_missing"><h1>Proje bulunamadı.</h1><a class="dkd_button" href="./">Ana sayfaya dön</a></section>'; return; }
  document.title = dkd_project_value['dkd_name']+' · DraBornEagle Hub';
  document.documentElement.style.setProperty('--dkd-project-accent', dkd_project_value['dkd_accent']);
  if (!dkd_root_element) return;
  dkd_root_element.innerHTML = '<section class="dkd_detail_hero"><div class="dkd_detail_copy dkd_reveal is-visible"><span class="dkd_eyebrow">'+dkd_escape_html(dkd_project_value['dkd_category_label'])+' · DRABORNEAGLE</span><h1>'+dkd_escape_html(dkd_project_value['dkd_name'])+'</h1><p class="dkd_detail_tagline">'+dkd_escape_html(dkd_project_value['dkd_tagline'])+'</p><p class="dkd_detail_summary">'+dkd_escape_html(dkd_project_value['dkd_summary'])+'</p><div class="dkd_detail_actions">'+dkd_actions_html()+'</div></div>'+dkd_mock_html()+'</section><section class="dkd_detail_section"><div class="dkd_detail_story"><article><span>01 / AMAÇ</span><h2>Neden var?</h2><p>'+dkd_escape_html(dkd_project_value['dkd_purpose'])+'</p></article><article><span>02 / HEDEF</span><h2>Kimin için?</h2><p>'+dkd_escape_html(dkd_project_value['dkd_target'])+'</p></article></div></section><section class="dkd_detail_section"><div class="dkd_detail_columns"><div><span class="dkd_eyebrow">ÜRÜN YAPISI</span><h2>Öne çıkanlar</h2><ul class="dkd_feature_list">'+dkd_list_html(dkd_project_value['dkd_features'])+'</ul></div><div><span class="dkd_eyebrow">GELİŞİM</span><h2>Hedef yol haritası</h2><ol class="dkd_roadmap">'+dkd_project_value['dkd_roadmap'].map(function(dkd_value,dkd_index_value){return '<li><b>0'+(dkd_index_value+1)+'</b><span>'+dkd_escape_html(dkd_value)+'</span></li>';}).join('')+'</ol></div></div></section><section class="dkd_detail_section dkd_detail_cta"><span class="dkd_eyebrow">DRABORNEAGLE HUB</span><h2>'+dkd_escape_html(dkd_project_value['dkd_name'])+' ekosistemin bir parçası.</h2><p>Diğer DraBornEagle projelerini keşfet ve bağlantılı ürün dünyasını gör.</p><a class="dkd_button dkd_button_primary" href="./">Tüm Projeleri Gör</a></section>';
})();