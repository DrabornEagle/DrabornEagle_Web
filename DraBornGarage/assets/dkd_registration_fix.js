(() => {
  'use strict';

  const WEB_VERSION = '1.5';
  const HELPER_CLASS = 'dkd-tax-number-helper';
  const ERROR_CLASS = 'dkd-registration-inline-error';
  const TAX_MESSAGE = 'Vergi numarası 10, T.C. kimlik numarası 11 haneli olmalıdır.';
  let dkdPatched = false;

  const digits = (value = '') => String(value).replace(/\D/g, '');
  const normalize = (value = '') => String(value).replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR');

  function isRegistrationForm(form) {
    if (!(form instanceof HTMLFormElement)) return false;
    if (form.id === 'dkd-register-form') return true;
    const text = normalize(form.textContent);
    return text.includes('hesabımı oluştur') || text.includes('hesap oluştur');
  }

  function findByLabel(form, matcher) {
    const labels = [...form.querySelectorAll('label')];
    const label = labels.find((item) => matcher(normalize(item.textContent)));
    return label?.querySelector('input,select,textarea') || null;
  }

  function findTaxInput(form) {
    return form.elements?.tax_number
      || form.elements?.business_tax_number
      || form.querySelector('input[name="tax_number"],input[name="business_tax_number"]')
      || findByLabel(form, (text) => text.includes('vergi / t.c.') || text.includes('vergi numarası') || text.includes('vergi no'));
  }

  function findTaxOfficeInput(form) {
    return form.elements?.tax_office
      || form.elements?.business_tax_office
      || form.querySelector('input[name="tax_office"],input[name="business_tax_office"]')
      || findByLabel(form, (text) => text.includes('vergi dairesi'));
  }

  function findBusinessNameInput(form) {
    return form.elements?.business_name
      || form.querySelector('input[name="business_name"]')
      || findByLabel(form, (text) => text.includes('işletme adı'));
  }

  function isVisible(element) {
    if (!element) return false;
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && !element.closest('.is-hidden,[hidden]');
  }

  function isNewBusinessApplication(form, taxInput) {
    if (!taxInput || !isVisible(taxInput)) return false;

    const mode = form.querySelector('input[name="account_mode"]:checked')?.value;
    if (mode && mode !== 'staff') return false;

    const joinExisting = form.querySelector('input[name="join_existing_workshop"]');
    if (joinExisting?.checked) return false;

    const typeSelect = form.querySelector('select[name*="application"],select[name*="business_type"],select[name*="registration_type"]');
    if (typeSelect) {
      const selectedText = normalize(typeSelect.selectedOptions?.[0]?.textContent || typeSelect.value);
      if (selectedText.includes('mevcut') || selectedText.includes('katıl')) return false;
    }

    return true;
  }

  function ensureStyles() {
    if (document.getElementById('dkd-registration-fix-style')) return;
    const style = document.createElement('style');
    style.id = 'dkd-registration-fix-style';
    style.textContent = `
      .${HELPER_CLASS}{display:block;margin:8px 2px 0;color:#9ca9ba;font-size:12px;line-height:1.45}
      .${HELPER_CLASS}.is-error{color:#ff6677;font-weight:750}
      .${ERROR_CLASS}{margin:12px 0 0;padding:13px 15px;border:1px solid rgba(255,79,98,.42);border-radius:14px;background:rgba(255,55,78,.10);color:#ffd9de;font-size:13px;font-weight:750;line-height:1.45;box-shadow:0 12px 30px rgba(255,35,65,.10)}
      .dkd-tax-invalid{border-color:#ff5368!important;box-shadow:0 0 0 3px rgba(255,83,104,.13)!important}
    `;
    document.head.appendChild(style);
  }

  function helperFor(input) {
    const field = input.closest('label,.dkd-field,.form-group') || input.parentElement;
    if (!field) return null;
    let helper = field.querySelector(`.${HELPER_CLASS}`);
    if (!helper) {
      helper = document.createElement('small');
      helper.className = HELPER_CLASS;
      helper.textContent = TAX_MESSAGE;
      field.appendChild(helper);
    }
    return helper;
  }

  function clearInlineError(form) {
    form.querySelectorAll(`.${ERROR_CLASS}`).forEach((element) => element.remove());
  }

  function showInlineError(form, message) {
    clearInlineError(form);
    const box = document.createElement('div');
    box.className = ERROR_CLASS;
    box.setAttribute('role', 'alert');
    box.textContent = message;
    const submit = form.querySelector('button[type="submit"],input[type="submit"]');
    if (submit) submit.insertAdjacentElement('beforebegin', box);
    else form.appendChild(box);
  }

  function showError(form, input, message) {
    const helper = input ? helperFor(input) : null;
    if (input) {
      input.classList.add('dkd-tax-invalid');
      input.setCustomValidity(message);
      input.focus({ preventScroll: true });
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (helper) {
      helper.textContent = message;
      helper.classList.add('is-error');
    }
    showInlineError(form, message);
    const toast = window.DKD?.toast;
    if (typeof toast === 'function') toast(message, 'error');
  }

  function clearTaxError(input) {
    input.classList.remove('dkd-tax-invalid');
    input.setCustomValidity('');
    const helper = helperFor(input);
    if (helper) {
      helper.textContent = TAX_MESSAGE;
      helper.classList.remove('is-error');
    }
    const form = input.closest('form');
    if (form) clearInlineError(form);
  }

  function decorateTaxInput(input) {
    if (!input || input.dataset.dkdTaxReady === '1') return;
    input.dataset.dkdTaxReady = '1';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.maxLength = 11;
    input.pattern = '[0-9]{10,11}';
    input.title = TAX_MESSAGE;
    helperFor(input);

    input.addEventListener('input', () => {
      const cleaned = digits(input.value).slice(0, 11);
      if (input.value !== cleaned) input.value = cleaned;
      clearTaxError(input);
    });
  }

  function enhanceForm(form) {
    if (!isRegistrationForm(form)) return;
    const taxInput = findTaxInput(form);
    if (taxInput) decorateTaxInput(taxInput);
  }

  function validateRegistration(form) {
    if (!isRegistrationForm(form)) return true;
    clearInlineError(form);

    const taxInput = findTaxInput(form);
    if (!isNewBusinessApplication(form, taxInput)) return true;

    const businessName = findBusinessNameInput(form);
    if (businessName && normalize(businessName.value).length < 2) {
      showError(form, businessName, 'İşletme adı en az 2 karakter olmalıdır.');
      return false;
    }

    const taxOffice = findTaxOfficeInput(form);
    if (taxOffice && normalize(taxOffice.value).length < 2) {
      showError(form, taxOffice, 'Vergi Dairesi en az 2 karakter olmalıdır.');
      return false;
    }

    const taxNumber = digits(taxInput.value);
    if (![10, 11].includes(taxNumber.length)) {
      showError(form, taxInput, TAX_MESSAGE);
      return false;
    }

    taxInput.value = taxNumber;
    clearTaxError(taxInput);
    return true;
  }

  function errorMessage(value) {
    if (typeof value === 'string') {
      const clean = value.trim();
      if (!clean || clean === '{}' || clean === '[object Object]') {
        return 'Kayıt işlemi tamamlanamadı. Vergi / T.C. numaranı 10 veya 11 hane olarak kontrol edip tekrar dene.';
      }
      return clean;
    }
    if (value && typeof value === 'object') {
      return value.message || value.error_description || value.details || value.hint || value.msg || value.code
        || 'Kayıt işlemi tamamlanamadı. Bilgileri kontrol edip tekrar dene.';
    }
    return String(value || 'Kayıt işlemi tamamlanamadı.');
  }

  function patchDKD() {
    const dkd = window.DKD;
    if (!dkd || dkdPatched) return false;
    dkdPatched = true;

    const originalToast = typeof dkd.toast === 'function' ? dkd.toast.bind(dkd) : null;
    if (originalToast) {
      dkd.toast = (message, type = 'info') => originalToast(errorMessage(message), type);
    }

    const originalTranslate = typeof dkd.translateAuthError === 'function'
      ? dkd.translateAuthError.bind(dkd)
      : (message) => errorMessage(message);

    dkd.translateAuthError = (value) => {
      const message = errorMessage(value);
      const lower = message.toLocaleLowerCase('tr-TR');
      if (lower.includes('vergi numarası') || lower.includes('tax number')) return TAX_MESSAGE;
      if (lower.includes('database error saving new user') || lower.includes('error saving new user')) {
        return 'Kayıt oluşturulamadı. Vergi / T.C. numarasının 10 veya 11 haneli olduğundan emin olup tekrar dene.';
      }
      return originalTranslate(message);
    };

    document.documentElement.dataset.webVersion = WEB_VERSION;
    return true;
  }

  function scan(root = document) {
    ensureStyles();
    patchDKD();
    if (root instanceof HTMLFormElement) enhanceForm(root);
    root.querySelectorAll?.('form').forEach(enhanceForm);
  }

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!isRegistrationForm(form)) return;
    if (!validateRegistration(form)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener('change', (event) => {
    const form = event.target.closest?.('form');
    if (form) setTimeout(() => enhanceForm(form), 0);
  }, true);

  new MutationObserver((mutations) => {
    patchDKD();
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node instanceof Element) scan(node);
    }));
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scan(document), { once: true });
  } else {
    scan(document);
  }

  let attempts = 0;
  const timer = setInterval(() => {
    scan(document);
    attempts += 1;
    if (dkdPatched || attempts > 80) clearInterval(timer);
  }, 100);
})();
