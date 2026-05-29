const dkdTabButtons = document.querySelectorAll('[data-dkd-tab]');
const dkdPrimaryButton = document.querySelector('.dkd-primary-button');
const dkdPasswordInput = document.getElementById('dkd-password');
const dkdEyeButton = document.getElementById('dkd-eye');

dkdTabButtons.forEach((dkdTabButton) => {
  dkdTabButton.addEventListener('click', () => {
    dkdTabButtons.forEach((dkdOtherButton) => {
      const dkdIsActive = dkdOtherButton === dkdTabButton;
      dkdOtherButton.classList.toggle('dkd-tab-active', dkdIsActive);
      dkdOtherButton.setAttribute('aria-selected', dkdIsActive ? 'true' : 'false');
    });

    const dkdSelectedMode = dkdTabButton.dataset.dkdTab;
    dkdPrimaryButton.innerHTML = dkdSelectedMode === 'signup' ? 'ÜYE OL <span>›</span>' : 'GİRİŞ YAP <span>›</span>';
  });
});

dkdEyeButton.addEventListener('click', () => {
  const dkdShouldShowPassword = dkdPasswordInput.type === 'password';
  dkdPasswordInput.type = dkdShouldShowPassword ? 'text' : 'password';
  dkdEyeButton.textContent = dkdShouldShowPassword ? '◌' : '◉';
});
