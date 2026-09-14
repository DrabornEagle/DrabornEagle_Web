(function () {
  'use strict';
  const dkd_project_values = window.dkd_project_values || [];
  const dkd_grid_element = document.getElementById('dkd_project_grid');
  const dkd_search_element = document.getElementById('dkd_search_input');
  const dkd_filter_root_element = document.getElementById('dkd_filters');
  let dkd_active_filter_value = 'all';

  function dkd_escape_html(dkd_value) {
    return String(dkd_value).replace(/[&<>'"]/g, function (dkd_character_value) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[dkd_character_value];
    });
  }

  function dkd_build_mockup(dkd_project_value) {
    const dkd_code_value = dkd_escape_html(dkd_project_value['dkd_code']);
    const dkd_name_value = dkd_escape_html(dkd_project_value['dkd_name']);
    return '<div class="dkd_card_mock" style="--dkd-accent:'+dkd_project_value['dkd_accent']+'"><div class="dkd_mini_phone"><div class="dkd_mini_head"><span>'+dkd_code_value+'</span><i></i></div><div class="dkd_mini_visual"><b>'+dkd_name_value+'</b><span>'+dkd_escape_html(dkd_project_value['dkd_category_label'])+'</span></div><div class="dkd_mini_rows"><i></i><i></i><i></i></div></div><span class="dkd_mock_badge">'+dkd_code_value+'</span></div>';
  }

  function dkd_render_projects() {
    if (!dkd_grid_element) return;
    const dkd_query_value = (dkd_search_element ? dkd_search_element.value : '').trim().toLocaleLowerCase('tr-TR');
    const dkd_filtered_values = dkd_project_values.filter(function (dkd_project_value) {
      const dkd_filter_match_value = dkd_active_filter_value === 'all' || dkd_project_value['dkd_category'] === dkd_active_filter_value;
      const dkd_search_source_value = (dkd_project_value['dkd_name']+' '+dkd_project_value['dkd_summary']+' '+dkd_project_value['dkd_category_label']).toLocaleLowerCase('tr-TR');
      return dkd_filter_match_value && (!dkd_query_value || dkd_search_source_value.includes(dkd_query_value));
    });
    dkd_grid_element.innerHTML = dkd_filtered_values.length ? dkd_filtered_values.map(function (dkd_project_value, dkd_project_index_value) {
      return '<article class="dkd_project_card dkd_reveal is-visible" style="--dkd-accent:'+dkd_project_value['dkd_accent']+';--dkd-delay:'+(dkd_project_index_value * 55)+'ms"><div class="dkd_card_top"><span class="dkd_project_number">0'+(dkd_project_index_value+1)+'</span><span class="dkd_category">'+dkd_escape_html(dkd_project_value['dkd_category_label'])+'</span></div>'+dkd_build_mockup(dkd_project_value)+'<div class="dkd_card_copy"><h3>'+dkd_escape_html(dkd_project_value['dkd_name'])+'</h3><p>'+dkd_escape_html(dkd_project_value['dkd_summary'])+'</p></div><div class="dkd_card_footer"><span>Detayları keşfet</span><a href="./'+encodeURIComponent(dkd_project_value['dkd_slug'])+'/" aria-label="'+dkd_escape_html(dkd_project_value['dkd_name'])+' detay sayfasını aç">↗</a></div></article>';
    }).join('') : '<div class="dkd_empty">Aramana uyan proje bulunamadı.</div>';
  }

  if (dkd_search_element) dkd_search_element.addEventListener('input', dkd_render_projects);
  if (dkd_filter_root_element) dkd_filter_root_element.addEventListener('click', function (dkd_event_value) {
    const dkd_button_element = dkd_event_value.target.closest('[data-dkd-filter]');
    if (!dkd_button_element) return;
    dkd_active_filter_value = dkd_button_element.getAttribute('data-dkd-filter');
    dkd_filter_root_element.querySelectorAll('.dkd_filter').forEach(function (dkd_filter_element) { dkd_filter_element.classList.toggle('is-active', dkd_filter_element === dkd_button_element); });
    dkd_render_projects();
  });

  const dkd_observer_value = new IntersectionObserver(function (dkd_entry_values) {
    dkd_entry_values.forEach(function (dkd_entry_value) { if (dkd_entry_value.isIntersecting) dkd_entry_value.target.classList.add('is-visible'); });
  }, {threshold:0.12});
  document.querySelectorAll('.dkd_reveal').forEach(function (dkd_reveal_element) { dkd_observer_value.observe(dkd_reveal_element); });
  dkd_render_projects();
})();