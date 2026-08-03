(() => {
  'use strict';

  const DKD_CONTACTS_KEY = 'dkd_gate_whatsapp_contacts_v2';
  const DKD_IMPORT_STATUS_KEY = 'dkd_gate_whatsapp_device_import_status_v1';
  const DKD_DOWNLOAD_AFTER_IMPORT_KEY = 'dkd_gate_whatsapp_download_after_import_v1';

  function dkdText(value) {
    return String(value ?? '').trim();
  }

  function dkdCreateId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `dkd_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function dkdNormalizePhone(value) {
    const dkdRaw = dkdText(value).replace(/[^\d+]/g, '');
    let dkdDigits = dkdRaw.replace(/\D/g, '');

    if (dkdDigits.startsWith('0090')) dkdDigits = dkdDigits.slice(2);
    if (dkdDigits.startsWith('90') && dkdDigits.length === 12) return `+${dkdDigits}`;
    if (dkdDigits.startsWith('0') && dkdDigits.length === 11) return `+90${dkdDigits.slice(1)}`;
    if (dkdDigits.length === 10 && dkdDigits.startsWith('5')) return `+90${dkdDigits}`;
    if (dkdRaw.startsWith('+') && dkdDigits.length >= 10 && dkdDigits.length <= 15) return `+${dkdDigits}`;
    if (dkdDigits.length >= 10 && dkdDigits.length <= 15) return `+${dkdDigits}`;
    return '';
  }

  function dkdReadStoredContacts() {
    try {
      const dkdStored = JSON.parse(localStorage.getItem(DKD_CONTACTS_KEY) || '[]');
      return Array.isArray(dkdStored) ? dkdStored : [];
    } catch {
      return [];
    }
  }

  function dkdContactValues(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return [];
    return [value];
  }

  function dkdConvertPickedContacts(dkdPickedContacts) {
    const dkdImported = [];

    dkdPickedContacts.forEach((dkdPickedContact) => {
      const dkdName = dkdContactValues(dkdPickedContact.name)
        .map(dkdText)
        .find(Boolean) || 'İsimsiz Kişi';

      dkdContactValues(dkdPickedContact.tel).forEach((dkdTelephone) => {
        const dkdPhone = dkdNormalizePhone(dkdTelephone);
        if (!dkdPhone) return;

        dkdImported.push({
          id: dkdCreateId(),
          name: dkdName,
          phone: dkdPhone,
          block: '',
          flat: '',
          selected: true,
          sent: false,
        });
      });
    });

    return dkdImported;
  }

  function dkdMergeContacts(dkdImported) {
    const dkdStored = dkdReadStoredContacts();
    const dkdByPhone = new Map();

    dkdStored.forEach((dkdContact) => {
      const dkdPhone = dkdNormalizePhone(dkdContact.phone);
      if (!dkdPhone) return;
      dkdByPhone.set(dkdPhone, { ...dkdContact, phone: dkdPhone });
    });

    let dkdAdded = 0;
    dkdImported.forEach((dkdContact) => {
      const dkdExisting = dkdByPhone.get(dkdContact.phone);
      if (dkdExisting) {
        if ((!dkdExisting.name || dkdExisting.name === 'İsimsiz Kişi') && dkdContact.name) {
          dkdExisting.name = dkdContact.name;
        }
        return;
      }
      dkdByPhone.set(dkdContact.phone, dkdContact);
      dkdAdded += 1;
    });

    localStorage.setItem(DKD_CONTACTS_KEY, JSON.stringify(Array.from(dkdByPhone.values())));
    return dkdAdded;
  }

  function dkdSetStatus(dkdMessage, dkdType = '') {
    const dkdStatusElement = document.getElementById('importStatus');
    if (!dkdStatusElement) return;
    dkdStatusElement.className = `status${dkdType ? ` ${dkdType}` : ''}`;
    dkdStatusElement.textContent = dkdMessage;
  }

  function dkdShowPreviousImportStatus() {
    const dkdRawStatus = sessionStorage.getItem(DKD_IMPORT_STATUS_KEY);
    if (!dkdRawStatus) return;

    sessionStorage.removeItem(DKD_IMPORT_STATUS_KEY);
    try {
      const dkdStatus = JSON.parse(dkdRawStatus);
      dkdSetStatus(`${dkdStatus.total} numara cihaz rehberinden alındı, ${dkdStatus.added} yeni kişi eklendi.`, 'ok');
    } catch {
      // Geçersiz geçici durum bilgisi gösterilmez.
    }
  }

  function dkdOpenVcfPicker() {
    const dkdDialog = document.getElementById('contactImportDialog');
    const dkdVcfInput = document.getElementById('vcfFile');
    if (dkdDialog?.open) dkdDialog.close();
    if (!dkdVcfInput) return;
    dkdSetStatus('VCF dosyanı seç. Dosya seçildiğinde rehber otomatik içe aktarılacak.');
    dkdVcfInput.click();
  }

  function dkdEscapeVcfValue(value) {
    return dkdText(value)
      .replace(/\\/g, '\\\\')
      .replace(/\r?\n/g, '\\n')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,');
  }

  function dkdBuildVcf(dkdContacts) {
    return dkdContacts.map((dkdContact) => {
      const dkdName = dkdEscapeVcfValue(dkdContact.name || 'İsimsiz Kişi');
      const dkdPhone = dkdNormalizePhone(dkdContact.phone);
      const dkdLocation = [dkdText(dkdContact.block), dkdText(dkdContact.flat) && `Daire ${dkdText(dkdContact.flat)}`]
        .filter(Boolean)
        .join(' ');
      const dkdLines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${dkdName}`,
        `N:;${dkdName};;;`,
        `TEL;TYPE=CELL:${dkdPhone}`,
      ];
      if (dkdLocation) dkdLines.push(`NOTE:${dkdEscapeVcfValue(dkdLocation)}`);
      dkdLines.push('END:VCARD');
      return dkdLines.join('\r\n');
    }).join('\r\n');
  }

  function dkdSaveVcfFile(dkdContacts) {
    const dkdVcfContent = dkdBuildVcf(dkdContacts);
    const dkdBlob = new Blob([`\uFEFF${dkdVcfContent}`], { type: 'text/vcard;charset=utf-8' });
    const dkdUrl = URL.createObjectURL(dkdBlob);
    const dkdAnchor = document.createElement('a');
    const dkdDate = new Date().toISOString().slice(0, 10);

    dkdAnchor.href = dkdUrl;
    dkdAnchor.download = `DraBornGate_Rehber_${dkdDate}.vcf`;
    dkdAnchor.hidden = true;
    document.body.appendChild(dkdAnchor);
    dkdAnchor.click();
    dkdAnchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(dkdUrl), 1500);
  }

  function dkdDownloadVcf(dkdOptions = {}) {
    const dkdDialog = document.getElementById('contactImportDialog');
    const dkdContacts = dkdReadStoredContacts()
      .map((dkdContact) => ({ ...dkdContact, phone: dkdNormalizePhone(dkdContact.phone) }))
      .filter((dkdContact) => dkdContact.phone);

    if (!dkdContacts.length) {
      if (dkdOptions.afterImport) {
        dkdSetStatus('Seçilen kişilerde indirilebilir telefon numarası bulunamadı.', 'error');
        return;
      }

      sessionStorage.setItem(DKD_DOWNLOAD_AFTER_IMPORT_KEY, '1');
      dkdSetStatus('VCF oluşturmak için rehberden kişileri seç. Seçim bitince dosya otomatik indirilecek.');
      dkdImportFromDevice();
      return;
    }

    dkdSaveVcfFile(dkdContacts);
    if (dkdDialog?.open) dkdDialog.close();
    dkdSetStatus(`${dkdContacts.length} kişi VCF rehberi olarak indirildi.`, 'ok');
  }

  async function dkdSupportedContactProperties() {
    const dkdRequired = ['name', 'tel'];
    if (!navigator.contacts || typeof navigator.contacts.getProperties !== 'function') return dkdRequired;

    try {
      const dkdSupported = await navigator.contacts.getProperties();
      return dkdRequired.filter((dkdProperty) => dkdSupported.includes(dkdProperty));
    } catch {
      return dkdRequired;
    }
  }

  async function dkdImportFromDevice() {
    const dkdButton = document.getElementById('deviceContacts');
    const dkdDialog = document.getElementById('contactImportDialog');
    if (!dkdButton) return;
    if (dkdDialog?.open) dkdDialog.close();

    if (!window.isSecureContext || !navigator.contacts || typeof navigator.contacts.select !== 'function') {
      sessionStorage.removeItem(DKD_DOWNLOAD_AFTER_IMPORT_KEY);
      dkdSetStatus('Bu tarayıcı doğrudan rehber seçimini desteklemiyor. VCF dosyası seçimi açıldı.', 'error');
      dkdOpenVcfPicker();
      return;
    }

    const dkdOriginalLabel = dkdButton.textContent;
    dkdButton.disabled = true;
    dkdButton.textContent = 'Rehber Açılıyor…';
    dkdSetStatus('Çoklu seçim açık: Birden fazla kişiye tek tek dokun ve sağ üstte Bitti düğmesine bas.');

    try {
      const dkdProperties = await dkdSupportedContactProperties();
      if (!dkdProperties.includes('tel')) {
        sessionStorage.removeItem(DKD_DOWNLOAD_AFTER_IMPORT_KEY);
        dkdSetStatus('Tarayıcı telefon numarası paylaşımını desteklemiyor. VCF dosyası seçimi açıldı.', 'error');
        dkdOpenVcfPicker();
        return;
      }

      const dkdPickedContacts = await navigator.contacts.select(dkdProperties, { multiple: true });
      const dkdImported = dkdConvertPickedContacts(dkdPickedContacts);

      if (!dkdImported.length) {
        sessionStorage.removeItem(DKD_DOWNLOAD_AFTER_IMPORT_KEY);
        dkdSetStatus('Kişi seçilmedi veya seçilen kişilerde geçerli telefon numarası bulunamadı.');
        return;
      }

      const dkdAdded = dkdMergeContacts(dkdImported);
      sessionStorage.setItem(DKD_IMPORT_STATUS_KEY, JSON.stringify({ total: dkdImported.length, added: dkdAdded }));
      window.location.reload();
    } catch (dkdError) {
      sessionStorage.removeItem(DKD_DOWNLOAD_AFTER_IMPORT_KEY);
      if (dkdError?.name === 'AbortError') {
        dkdSetStatus('Rehber seçimi iptal edildi.');
      } else {
        dkdSetStatus('Cihaz rehberi açılamadı. VCF dosyası seçerek devam edebilirsin.', 'error');
      }
    } finally {
      dkdButton.disabled = false;
      dkdButton.textContent = dkdOriginalLabel;
    }
  }

  function dkdOpenImportDialog() {
    const dkdDialog = document.getElementById('contactImportDialog');
    if (dkdDialog && typeof dkdDialog.showModal === 'function') {
      dkdDialog.showModal();
      return;
    }
    dkdImportFromDevice();
  }

  function dkdCloseImportDialog() {
    const dkdDialog = document.getElementById('contactImportDialog');
    if (dkdDialog?.open) dkdDialog.close();
  }

  function dkdDownloadAfterImport() {
    if (sessionStorage.getItem(DKD_DOWNLOAD_AFTER_IMPORT_KEY) !== '1') return;
    sessionStorage.removeItem(DKD_DOWNLOAD_AFTER_IMPORT_KEY);
    window.setTimeout(() => dkdDownloadVcf({ afterImport: true }), 350);
  }

  function dkdInitializeDeviceContacts() {
    const dkdButton = document.getElementById('deviceContacts');
    const dkdPickMultipleButton = document.getElementById('pickMultipleContacts');
    const dkdPickVcfButton = document.getElementById('pickVcfAll');
    const dkdDownloadVcfButton = document.getElementById('downloadVcfContacts');
    const dkdCloseButton = document.getElementById('closeContactImport');
    const dkdCancelButton = document.getElementById('cancelContactImport');

    if (!dkdButton) return;
    dkdButton.addEventListener('click', dkdOpenImportDialog);
    dkdPickMultipleButton?.addEventListener('click', dkdImportFromDevice);
    dkdPickVcfButton?.addEventListener('click', dkdOpenVcfPicker);
    dkdDownloadVcfButton?.addEventListener('click', () => dkdDownloadVcf());
    dkdCloseButton?.addEventListener('click', dkdCloseImportDialog);
    dkdCancelButton?.addEventListener('click', dkdCloseImportDialog);
    dkdShowPreviousImportStatus();
    dkdDownloadAfterImport();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dkdInitializeDeviceContacts);
  } else {
    dkdInitializeDeviceContacts();
  }
})();
