#!/usr/bin/env python3
from pathlib import Path
import json

DKD_ROOT_PATH = Path(__file__).resolve().parents[1]
DKD_APP_PATH = DKD_ROOT_PATH / 'DraBornGo' / 'App'
DKD_APK_URL = 'https://github.com/DrabornEagle/DraBornGo/releases/download/dkd_draborngo_v0.0.5/DraBornGo-v0.0.5-code5-release.apk'
DKD_SHA256_VALUE = '7b7bdc301eaaba4c4484ce18464c242fe98d4492012d44171c31394f72ed762f'


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
        'dkd_apk_url': DKD_APK_URL,
        'dkd_download_page_url': 'https://www.draborneagle.com/DraBornGo/App/',
        'dkd_sha256': DKD_SHA256_VALUE,
        'dkd_release_notes': 'DraBornGo v0.0.5 imzalı APK yayınlandı. Expo SDK 54 uyumu, DBG kimliği, sabit public ortam ayarları, görünür sürüm düzeltmeleri ve DraBornDeal veritabanı temizliği tamamlandı.',
    }
    dkd_manifest_path_value.write_text(
        json.dumps(dkd_manifest_value, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )

    dkd_download_path_value = DKD_APP_PATH / 'dkd_download.html'
    dkd_replace_or_verify(
        dkd_download_path_value,
        '<a class="dkd_button dkd_button_primary" href="#" aria-disabled="true" onclick="return false;">v0.0.5 APK hazırlanıyor</a>',
        f'<a class="dkd_button dkd_button_primary" href="{DKD_APK_URL}">APK İndir • v0.0.5</a>',
    )
    dkd_replace_or_verify(
        dkd_download_path_value,
        '<div class="dkd_warning">DraBornGo v0.0.5 kaynak ve Expo Go test sürümü yayında. İmzalı APK hazırlandığında indirme düğmesi otomatik açılacaktır.</div>',
        f'<div class="dkd_warning">DraBornGo v0.0.5 imzalı resmi APK yayında. Dosya bütünlüğü SHA-256 ile doğrulanabilir: {DKD_SHA256_VALUE}</div>',
    )

    dkd_release_notes_path_value = DKD_APP_PATH / 'dkd_draborngo_release_notes.html'
    dkd_release_notes_text_value = dkd_release_notes_path_value.read_text(encoding='utf-8')
    dkd_release_note_line_value = (
        '<li>İmzalı DraBornGo v0.0.5 / Kod 5 APK yayınlandı. '
        f'SHA-256: {DKD_SHA256_VALUE}</li>'
    )
    if dkd_release_note_line_value not in dkd_release_notes_text_value:
        dkd_release_notes_text_value = dkd_release_notes_text_value.replace(
            '</ul>',
            f'        {dkd_release_note_line_value}\n      </ul>',
            1,
        )
        dkd_release_notes_path_value.write_text(
            dkd_release_notes_text_value,
            encoding='utf-8',
        )

    dkd_manifest_check_value = json.loads(
        dkd_manifest_path_value.read_text(encoding='utf-8')
    )
    if dkd_manifest_check_value.get('dkd_apk_url') != DKD_APK_URL:
        raise SystemExit('DKD web manifest APK URL was not updated.')
    if dkd_manifest_check_value.get('dkd_sha256') != DKD_SHA256_VALUE:
        raise SystemExit('DKD web manifest SHA-256 was not updated.')

    dkd_download_check_value = dkd_download_path_value.read_text(encoding='utf-8')
    if DKD_APK_URL not in dkd_download_check_value:
        raise SystemExit('DKD download page does not contain the signed APK URL.')
    if 'APK hazırlanıyor' in dkd_download_check_value:
        raise SystemExit('DKD download page still shows the preparing state.')

    print('DraBornGo v0.0.5 signed APK URL and SHA-256 published to the web files.')


if __name__ == '__main__':
    main()
