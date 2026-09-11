const dkd_apkModal = document.getElementById('dkd-apk-modal');
const dkd_apkDialog = dkd_apkModal?.querySelector('.dkd-apk-dialog');
const dkd_apkOpeners = [...document.querySelectorAll('[data-dkd-apk-open]')];
const dkd_apkClosers = [...document.querySelectorAll('[data-dkd-apk-close]')];
let dkd_apkReturnFocus = null;

function dkd_openApkModal(dkd_event) {
  dkd_apkReturnFocus = dkd_event?.currentTarget instanceof HTMLElement ? dkd_event.currentTarget : document.activeElement;
  dkd_apkModal.hidden = false;
  dkd_apkModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('dkd-modal-open');
  requestAnimationFrame(() => dkd_apkDialog?.focus());
}

function dkd_closeApkModal() {
  dkd_apkModal.hidden = true;
  dkd_apkModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('dkd-modal-open');
  if (dkd_apkReturnFocus instanceof HTMLElement) dkd_apkReturnFocus.focus();
}

for (const dkd_button of dkd_apkOpeners) dkd_button.addEventListener('click', dkd_openApkModal);
for (const dkd_button of dkd_apkClosers) dkd_button.addEventListener('click', dkd_closeApkModal);
document.addEventListener('keydown', dkd_event => {
  if (dkd_apkModal?.hidden) return;
  if (dkd_event.key === 'Escape') dkd_closeApkModal();
  if (dkd_event.key !== 'Tab') return;
  const dkd_focusable = [...dkd_apkDialog.querySelectorAll('a[href],button:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')].filter(dkd_item => !dkd_item.hidden);
  if (!dkd_focusable.length) return;
  const dkd_first = dkd_focusable[0];
  const dkd_last = dkd_focusable[dkd_focusable.length - 1];
  if (dkd_event.shiftKey && document.activeElement === dkd_first) {
    dkd_event.preventDefault();
    dkd_last.focus();
  } else if (!dkd_event.shiftKey && document.activeElement === dkd_last) {
    dkd_event.preventDefault();
    dkd_first.focus();
  }
});

function dkd_setText(dkd_id, dkd_value) {
  const dkd_element = document.getElementById(dkd_id);
  if (dkd_element) dkd_element.textContent = dkd_value;
}

async function dkd_fetchRelease() {
  const dkd_sources = [
    { dkd_root: './LastMile/', dkd_url: './LastMile/downloads/release.json' },
    { dkd_root: './Last-Mile/', dkd_url: './Last-Mile/downloads/release.json' },
  ];
  let dkd_lastError = null;
  for (const dkd_source of dkd_sources) {
    try {
      const dkd_response = await fetch(dkd_source.dkd_url, { cache: 'no-store' });
      if (!dkd_response.ok) throw new Error(`HTTP ${dkd_response.status}`);
      return { dkd_release: await dkd_response.json(), dkd_root: dkd_source.dkd_root };
    } catch (dkd_error) {
      dkd_lastError = dkd_error;
    }
  }
  throw dkd_lastError || new Error('APK hazırlanıyor');
}

function dkd_validateRelease(dkd_release) {
  if (!dkd_release || typeof dkd_release !== 'object') return false;
  if (!/^(?:DraBornGo-LastMile|LastMile)-v[0-9.]+-release-vc1\.apk$/.test(String(dkd_release.dkd_filename || ''))) return false;
  if (!/^[a-f0-9]{64}$/.test(String(dkd_release.dkd_sha256 || ''))) return false;
  return Number(dkd_release.dkd_bytes) > 0 && /^\d+(?:\.\d+){1,3}$/.test(String(dkd_release.dkd_version || ''));
}

async function dkd_loadRelease() {
  const dkd_status = document.getElementById('dkd-download-status');
  try {
    const { dkd_release, dkd_root } = await dkd_fetchRelease();
    if (!dkd_validateRelease(dkd_release)) throw new Error('Sürüm bilgisi doğrulanamadı');
    const dkd_link = document.getElementById('dkd-apk-link');
    const dkd_version = String(dkd_release.dkd_version);
    const dkd_megabytes = Math.max(1, Math.round(Number(dkd_release.dkd_bytes) / 1024 / 1024));
    const dkd_minAndroid = String(dkd_release.dkd_minAndroid || '7.0');
    dkd_link.href = `${dkd_root}downloads/${encodeURIComponent(dkd_release.dkd_filename)}`;
    dkd_link.hidden = false;
    dkd_status.textContent = dkd_version === '0.7.2'
      ? `v${dkd_version} hazır · imzalı Release APK doğrulandı.`
      : `Son yayın v${dkd_version} hazır · v0.7.2 Expo Go test aşamasında.`;
    dkd_setText('dkd-apk-version', `v${dkd_version} · versionCode 1`);
    dkd_setText('dkd-apk-android', `Android ${dkd_minAndroid}+`);
    dkd_setText('dkd-apk-size', `${dkd_megabytes} MB`);
    dkd_setText('dkd-apk-arch', String(dkd_release.dkd_arch || 'ARM64 / Android'));
    dkd_setText('dkd-hash', String(dkd_release.dkd_sha256));
    document.getElementById('dkd-checksum').hidden = false;
  } catch {
    dkd_status.textContent = 'v0.7.2 Expo Go test aşamasında. Yeni Release APK test onayından sonra burada açılacak.';
    dkd_setText('dkd-apk-version', 'v0.7.2 · test');
    dkd_setText('dkd-apk-android', 'Expo Go 57');
    dkd_setText('dkd-apk-size', 'APK henüz üretilmedi');
    dkd_setText('dkd-apk-arch', 'Android · hazırlık');
  }
}

void dkd_loadRelease();
