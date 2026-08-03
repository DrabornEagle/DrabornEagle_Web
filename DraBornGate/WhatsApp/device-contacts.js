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

  function dkdShowPreviousImportStatus() {
    const dkdStatusElement = document.getElementById('importStatus');
    const dkdRawStatus = sessionStorage.getItem(DKD_IMPORT_STATUS_KEY);
    if (!dkdStatusElement || !dkdRawStatus) return;

    sessionStorage.removeItem(DKD_IMPORT_STATUS_KEY);
    try {
      const dkdStatus = JSON.parse(dkdRawStatus);
      dkdStatusElement.className = 'status ok';
      dkdStatusElement.textContent = `${dkdStatus.total} numara cihaz rehberinden alındı, ${dkdStatus.added} yeni kişi eklendi.`;
    } catch {
      // Geçersiz geçici durum bilgisi gösterilmez.
    }
  }

  async function dkdImportFromDevice() {
    const dkdButton = document.getElementById('deviceContacts');
    const dkdStatusElement = document.getElementById('importStatus');
    const dkdVcfInput = document.getElementById('vcfFile');
    if (!dkdButton || !dkdStatusElement || !dkdVcfInput) return;

    if (!window.isSecureContext || !navigator.contacts || typeof navigator.contacts.select !== 'function') {
      dkdStatusElement.className = 'status error';
      dkdStatusElement.textContent = 'Bu tarayıcı doğrudan rehber seçimini desteklemiyor. VCF dosyası seçimi açıldı.';
      dkdVcfInput.click();
      return;
    }

    const dkdOriginalLabel = dkdButton.textContent;
    dkdButton.disabled = true;
    dkdButton.textContent = 'Rehber Açılıyor…';

    try {
      const dkdPickedContacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
      const dkdImported = dkdConvertPickedContacts(dkdPickedContacts);

      if (!dkdImported.length) {
        dkdStatusElement.className = 'status';
        dkdStatusElement.textContent = 'Kişi seçilmedi veya seçilen kişilerde geçerli telefon numarası bulunamadı.';
        return;
      }

      const dkdAdded = dkdMergeContacts(dkdImported);
      sessionStorage.setItem(DKD_IMPORT_STATUS_KEY, JSON.stringify({ total: dkdImported.length, added: dkdAdded }));
      window.location.reload();
    } catch (dkdError) {
      if (dkdError?.name === 'AbortError') {
        dkdStatusElement.className = 'status';
        dkdStatusElement.textContent = 'Rehber seçimi iptal edildi.';
      } else {
        dkdStatusElement.className = 'status error';
        dkdStatusElement.textContent = 'Cihaz rehberi açılamadı. VCF dosyası seçerek devam edebilirsin.';
      }
    } finally {
      dkdButton.disabled = false;
      dkdButton.textContent = dkdOriginalLabel;
    }
  }

  function dkdInitializeDeviceContacts() {
    const dkdButton = document.getElementById('deviceContacts');
    if (!dkdButton) return;
    dkdButton.addEventListener('click', dkdImportFromDevice);
    dkdShowPreviousImportStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dkdInitializeDeviceContacts);
  } else {
    dkdInitializeDeviceContacts();
  }
})();
