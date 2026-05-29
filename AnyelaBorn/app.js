(function dkd_anyela_login_page() {
  const dkd_tabs = document.querySelectorAll('[data-dkd-tab]');
  const dkd_primary_button = document.querySelector('.dkd_primary_button');
  const dkd_outline_button = document.querySelector('.dkd_outline_button');
  const dkd_password_input = document.getElementById('dkd_anyela_password');
  const dkd_password_button = document.querySelector('.dkd_password_button');

  function dkd_set_mode(dkd_mode) {
    dkd_tabs.forEach((dkd_tab) => {
      const dkd_is_active = dkd_tab.dataset.dkdTab === dkd_mode;
      dkd_tab.classList.toggle('dkd_tab_active', dkd_is_active);
      dkd_tab.setAttribute('aria-selected', String(dkd_is_active));
    });
    if (dkd_primary_button) {
      dkd_primary_button.innerHTML = dkd_mode === 'signup' ? 'ÜYE OL <span>›</span>' : 'GİRİŞ YAP <span>›</span>';
    }
  }

  dkd_tabs.forEach((dkd_tab) => {
    dkd_tab.addEventListener('click', () => dkd_set_mode(dkd_tab.dataset.dkdTab));
  });

  if (dkd_outline_button) {
    dkd_outline_button.addEventListener('click', () => dkd_set_mode('signup'));
  }

  if (dkd_password_button && dkd_password_input) {
    dkd_password_button.addEventListener('click', () => {
      const dkd_next_type = dkd_password_input.type === 'password' ? 'text' : 'password';
      dkd_password_input.type = dkd_next_type;
    });
  }
})();
