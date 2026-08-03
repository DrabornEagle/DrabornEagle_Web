(() => {
  'use strict';

  const DKD_CONTACTS_KEY = 'dkd_gate_whatsapp_contacts_v2';
  const DKD_IMPORT_STATUS_KEY = 'dkd_gate_whatsapp_device_import_status_v1';

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
        dkdSetStatus('Tarayıcı telefon numarası paylaşımını desteklemiyor. VCF dosyası seçimi açıldı.', 'error');
        dkdOpenVcfPicker();
        return;
      }

      const dkdPickedContacts = await navigator.contacts.select(dkdProperties, { multiple: true });
      const dkdImported = dkdConvertPickedContacts(dkdPickedContacts);

      if (!dkdImported.length) {
        dkdSetStatus('Kişi seçilmedi veya seçilen kişilerde geçerli telefon numarası bulunamadı.');
        return;
      }

      const dkdAdded = dkdMergeContacts(dkdImported);
      sessionStorage.setItem(DKD_IMPORT_STATUS_KEY, JSON.stringify({ total: dkdImported.length, added: dkdAdded }));
      window.location.reload();
    } catch (dkdError) {
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

  function dkdInitializeDeviceContacts() {
    const dkdButton = document.getElementById('deviceContacts');
    const dkdPickMultipleButton = document.getElementById('pickMultipleContacts');
    const dkdPickVcfButton = document.getElementById('pickVcfAll');
    const dkdCloseButton = document.getElementById('closeContactImport');
    const dkdCancelButton = document.getElementById('cancelContactImport');

    if (!dkdButton) return;
    dkdButton.addEventListener('click', dkdOpenImportDialog);
    dkdPickMultipleButton?.addEventListener('click', dkdImportFromDevice);
    dkdPickVcfButton?.addEventListener('click', dkdOpenVcfPicker);
    dkdCloseButton?.addEventListener('click', dkdCloseImportDialog);
    dkdCancelButton?.addEventListener('click', dkdCloseImportDialog);
    dkdShowPreviousImportStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dkdInitializeDeviceContacts);
  } else {
    dkdInitializeDeviceContacts();
  }
})();
