// Last Mile v0.7.5 public APK presentation patch.
// Runs after dkd-platform.js so static/fallback copy never advertises the previous release.
(() => {
  const dkd_applyV075ReleaseCopy = () => {
    const dkd_note = document.querySelector('.dkd-apk-note');
    if (dkd_note) dkd_note.textContent = 'v0.7.5 Web ve Android aynı oyun kaynağından üretilir. Buradaki iki indirme seçeneği de yalnızca doğrulanmış Release APK dosyasını verir.';
    const dkd_status = document.getElementById('dkd-download-status');
    if (dkd_status && /v0\.7\.4|kontrol ediliyor/i.test(dkd_status.textContent || '')) dkd_status.textContent = 'v0.7.5 Release bilgisi kontrol ediliyor…';
    const dkd_version = document.getElementById('dkd-apk-version');
    if (dkd_version && /v0\.7\.4/i.test(dkd_version.textContent || '')) dkd_version.textContent = 'v0.7.5 · versionCode 1';
  };
  dkd_applyV075ReleaseCopy();
  window.addEventListener('load', dkd_applyV075ReleaseCopy, { once: true });
})();
