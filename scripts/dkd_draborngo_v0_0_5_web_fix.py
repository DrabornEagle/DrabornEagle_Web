#!/usr/bin/env python3
from pathlib import Path
import json

DKD_ROOT_PATH = Path(__file__).resolve().parents[1]
DKD_APP_PATH = DKD_ROOT_PATH / 'DraBornGo' / 'App'


def dkd_replace_or_verify(dkd_path_value, dkd_old_value, dkd_new_value):
    dkd_text_value = dkd_path_value.read_text(encoding='utf-8')
    if dkd_old_value in dkd_text_value:
        dkd_path_value.write_text(
            dkd_text_value.replace(dkd_old_value, dkd_new_value),
            encoding='utf-8',
        )
        return
    if dkd_new_value not in dkd_text_value:
        raise SystemExit(
            f'DKD expected old or new text missing in {dkd_path_value}: {dkd_old_value!r}'
        )


def main():
    dkd_manifest_path_value = DKD_APP_PATH / 'dkd_draborngo_update_manifest.json'
    dkd_manifest_value = {
        'dkd_latest_version_name': '0.0.5',
        'dkd_latest_version_code': 5,
        'dkd_min_supported_version_code': 3,
        'dkd_update_required': False,
        'dkd_apk_url': 'https://www.draborneagle.com/DraBornGo/App/',
        'dkd_download_page_url': 'https://www.draborneagle.com/DraBornGo/App/',
        'dkd_sha256': '',
        'dkd_release_notes': 'DraBornGo v0.0.5: Expo SDK 54 uyumu, DBG kimliği, sabit public ortam ayarları, görünür sürüm düzeltmeleri ve DraBornDeal veritabanı temizliği tamamlandı.',
    }
    dkd_manifest_path_value.write_text(
        json.dumps(dkd_manifest_value, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )

    dkd_download_path_value = DKD_APP_PATH / 'dkd_download.html'
    dkd_replace_or_verify(
        dkd_download_path_value,
        '<span class="dkd_badge">v0.0.4 • Android</span>',
        '<span class="dkd_badge">v0.0.5 • Android</span>',
    )
    dkd_replace_or_verify(
        dkd_download_path_value,
        '<a class="dkd_button dkd_button_primary" href="https://github.com/DrabornEagle/DrabornEagle_Web/releases/download/dkd_draborngo_v0.0.4/dkd_draborngo_latest.apk">APK İndir</a>',
        '<a class="dkd_button dkd_button_primary" href="#" aria-disabled="true" onclick="return false;">v0.0.5 APK hazırlanıyor</a>',
    )
    dkd_replace_or_verify(
        dkd_download_path_value,
        '<div class="dkd_stat"><small>Son sürüm</small><strong>0.0.4</strong></div>',
        '<div class="dkd_stat"><small>Son sürüm</small><strong>0.0.5</strong></div>',
    )
    dkd_replace_or_verify(
        dkd_download_path_value,
        '<div class="dkd_stat"><small>Version Code</small><strong>4</strong></div>',
        '<div class="dkd_stat"><small>Version Code</small><strong>5</strong></div>',
    )
    dkd_replace_or_verify(
        dkd_download_path_value,
        '<div class="dkd_warning"></div>',
        '<div class="dkd_warning">DraBornGo v0.0.5 kaynak ve Expo Go test sürümü yayında. İmzalı APK hazırlandığında indirme düğmesi otomatik açılacaktır.</div>',
    )

    dkd_release_notes_path_value = DKD_APP_PATH / 'dkd_draborngo_release_notes.html'
    dkd_release_notes_text_value = dkd_release_notes_path_value.read_text(encoding='utf-8')
    dkd_release_notes_text_value = dkd_release_notes_text_value.replace('v0.0.4', 'v0.0.5')
    dkd_release_notes_text_value = dkd_release_notes_text_value.replace(
        '<li></li>\n        <li>Hatalar Giderildi.</li>',
        '<li>Expo SDK 54 paketleri uyumlu sürümlere getirildi.</li>\n'
        '        <li>Uygulama ve Android sürüm kodu v0.0.5 / 5 olarak sabitlendi.</li>\n'
        '        <li>DBG kimliği ve public Supabase/Mapbox ortam ayarları kalıcı hâle getirildi.</li>\n'
        '        <li>DraBornDeal veritabanı nesneleri DraBornGo projesinden kaldırıldı.</li>',
    )
    dkd_release_notes_path_value.write_text(
        dkd_release_notes_text_value,
        encoding='utf-8',
    )

    for dkd_path_value in [
        dkd_manifest_path_value,
        dkd_download_path_value,
        dkd_release_notes_path_value,
    ]:
        dkd_text_value = dkd_path_value.read_text(encoding='utf-8')
        if '0.0.4' in dkd_text_value or 'Kod 4' in dkd_text_value:
            raise SystemExit(f'DKD old v0.0.4/code4 remains in {dkd_path_value}')

    print('DraBornGo web v0.0.5 / code 5 files repaired.')


if __name__ == '__main__':
    main()
