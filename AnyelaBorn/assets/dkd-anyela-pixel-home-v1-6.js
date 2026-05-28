(() => {
  const dkd_menu_button = document.querySelector('.dkd-menu-button');
  const dkd_root = document.querySelector('.dkd-page-shell');
  if (dkd_menu_button && dkd_root) {
    dkd_menu_button.addEventListener('click', () => {
      dkd_root.classList.toggle('dkd-menu-open');
      if (navigator.vibrate) navigator.vibrate(15);
    });
  }
})();
