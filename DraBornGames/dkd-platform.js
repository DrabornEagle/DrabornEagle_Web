async function dkd_loadRelease() {
  const dkd_status = document.getElementById('dkd-download-status');
  try {
    const dkd_response = await fetch('./Last-Mile/downloads/release.json', { cache: 'no-store' });
    if (!dkd_response.ok) throw new Error('APK hazırlanıyor');
    const dkd_release = await dkd_response.json();
    if (!/^DraBornGo-LastMile-v[0-9.]+-release-vc1\.apk$/.test(dkd_release.dkd_filename) || !/^[a-f0-9]{64}$/.test(dkd_release.dkd_sha256)) throw new Error('Sürüm bilgisi doğrulanamadı');
    const dkd_link = document.getElementById('dkd-apk-link');
    dkd_link.href = './Last-Mile/downloads/' + dkd_release.dkd_filename;
    dkd_link.hidden = false;
    dkd_status.textContent = `v${dkd_release.dkd_version} · ${Math.round(dkd_release.dkd_bytes / 1024 / 1024)} MB · Android ${dkd_release.dkd_minAndroid || '7.0'} ve üzeri · ARM64`;
    document.getElementById('dkd-hash').textContent = dkd_release.dkd_sha256;
    document.getElementById('dkd-checksum').hidden = false;
  } catch {
    dkd_status.textContent = 'Release APK henüz hazır değil. Bu sırada Last Mile’ı tarayıcıda açabilirsin.';
  }
}
void dkd_loadRelease();
