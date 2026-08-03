const DKD_V21 = {
  courierPageActive: false,
  courierSiteChosen: false,
  courierSiteValue: '',
  courierSiteLabel: '',
  patchQueued: false,
};

function dkdText(dkdElement) {
  return String(dkdElement?.textContent || '').replace(/\s+/g, ' ').trim();
}

function dkdNormalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdIcon(dkdName) {
  const dkdIcons = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.4-3.4"></path></svg>',
    building: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16"></path><path d="M9 7h3M9 11h3M9 15h3M17 9h2a1 1 0 0 1 1 1v11M3 21h18"></path></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>',
  };
  return dkdIcons[dkdName] || '';
}

function dkdToast(dkdMessage, dkdTone = 'info') {
  let dkdToastRoot = document.querySelector('.dkd-v21-toast-root');
  if (!dkdToastRoot) {
    dkdToastRoot = document.createElement('div');
    dkdToastRoot.className = 'dkd-v21-toast-root';
    dkdToastRoot.setAttribute('aria-live', 'polite');
    document.body.appendChild(dkdToastRoot);
  }
  const dkdToastItem = document.createElement('div');
  dkdToastItem.className = `dkd-v21-toast dkd-v21-toast-${dkdTone}`;
  dkdToastItem.innerHTML = `<span class="dkd-v21-toast-dot"></span><strong>${dkdMessage}</strong>`;
  dkdToastRoot.appendChild(dkdToastItem);
  requestAnimationFrame(() => dkdToastItem.classList.add('is-visible'));
  setTimeout(() => {
    dkdToastItem.classList.remove('is-visible');
    setTimeout(() => dkdToastItem.remove(), 260);
  }, 2600);
}

function dkdFindCourierForm() {
  const dkdForms = Array.from(document.querySelectorAll('form'));
  let dkdForm = dkdForms.find((dkdItem) => {
    const dkdContent = dkdNormalize(dkdText(dkdItem));
    return dkdContent.includes('musteri adi') && dkdContent.includes('siparis numarasi') && dkdContent.includes('acik adres');
  });
  if (dkdForm) return dkdForm;

  const dkdCustomerLabel = Array.from(document.querySelectorAll('label, h2, h3, span, div')).find(
    (dkdItem) => dkdNormalize(dkdText(dkdItem)) === 'musteri adi',
  );
  if (!dkdCustomerLabel) return null;
  let dkdScope = dkdCustomerLabel.parentElement;
  while (dkdScope && dkdScope !== document.body) {
    const dkdContent = dkdNormalize(dkdText(dkdScope));
    if (dkdContent.includes('siparis numarasi') && dkdContent.includes('acik adres') && dkdScope.querySelectorAll('select').length >= 2) {
      return dkdScope;
    }
    dkdScope = dkdScope.parentElement;
  }
  return null;
}

function dkdCreateSiteSearch(dkdForm, dkdSiteSelect, dkdGateSelect) {
  if (dkdSiteSelect.dataset.dkdV21SiteSearch === 'true') return;
  dkdSiteSelect.dataset.dkdV21SiteSearch = 'true';
  dkdSiteSelect.classList.add('dkd-v21-native-site-select');

  const dkdOptions = Array.from(dkdSiteSelect.options)
    .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
    .map((dkdOption) => ({
      value: dkdOption.value,
      label: dkdOption.textContent?.trim() || dkdOption.value,
    }));

  if (!DKD_V21.courierSiteChosen) {
    dkdSiteSelect.value = '';
    if (dkdGateSelect) {
      dkdGateSelect.disabled = true;
      dkdGateSelect.classList.add('dkd-v21-gate-locked');
    }
  } else if (DKD_V21.courierSiteValue && Array.from(dkdSiteSelect.options).some((dkdOption) => dkdOption.value === DKD_V21.courierSiteValue)) {
    dkdSiteSelect.value = DKD_V21.courierSiteValue;
  }

  const dkdSearchShell = document.createElement('div');
  dkdSearchShell.className = 'dkd-v21-site-search';
  dkdSearchShell.innerHTML = `
    <div class="dkd-v21-site-search-box">
      <span class="dkd-v21-site-search-icon">${dkdIcon('search')}</span>
      <input type="search" inputmode="search" autocomplete="off" placeholder="Site adı veya şehir ara" aria-label="Site ara">
      <span class="dkd-v21-site-search-status">ARAMA</span>
    </div>
    <div class="dkd-v21-site-selected" hidden></div>
    <div class="dkd-v21-site-results" hidden></div>
    <p class="dkd-v21-site-help">Site otomatik seçilmez. En az 2 harf yazıp sonuçlardan seçim yapın.</p>
  `;

  dkdSiteSelect.parentElement?.insertBefore(dkdSearchShell, dkdSiteSelect);
  const dkdInput = dkdSearchShell.querySelector('input');
  const dkdResults = dkdSearchShell.querySelector('.dkd-v21-site-results');
  const dkdSelected = dkdSearchShell.querySelector('.dkd-v21-site-selected');
  const dkdStatus = dkdSearchShell.querySelector('.dkd-v21-site-search-status');

  function dkdRenderSelected() {
    if (!DKD_V21.courierSiteChosen || !DKD_V21.courierSiteLabel) {
      dkdSelected.hidden = true;
      dkdSelected.innerHTML = '';
      return;
    }
    dkdSelected.hidden = false;
    dkdSelected.innerHTML = `<span class="dkd-v21-site-selected-icon">${dkdIcon('building')}</span><span><small>SEÇİLEN SİTE</small><strong>${DKD_V21.courierSiteLabel}</strong></span><i>${dkdIcon('check')}</i>`;
    dkdInput.value = DKD_V21.courierSiteLabel;
    dkdStatus.textContent = 'SEÇİLDİ';
  }

  function dkdRenderResults(dkdQuery) {
    const dkdNormalizedQuery = dkdNormalize(dkdQuery);
    if (dkdNormalizedQuery.length < 2) {
      dkdResults.hidden = true;
      dkdResults.innerHTML = '';
      dkdStatus.textContent = DKD_V21.courierSiteChosen ? 'SEÇİLDİ' : 'ARAMA';
      return;
    }
    const dkdMatches = dkdOptions.filter((dkdOption) => dkdNormalize(dkdOption.label).includes(dkdNormalizedQuery)).slice(0, 12);
    dkdResults.hidden = false;
    dkdStatus.textContent = `${dkdMatches.length} SONUÇ`;
    dkdResults.innerHTML = dkdMatches.length
      ? dkdMatches.map((dkdOption) => `<button type="button" class="dkd-v21-site-result" data-site-value="${encodeURIComponent(dkdOption.value)}"><span>${dkdIcon('building')}</span><strong>${dkdOption.label}</strong><i>SEÇ</i></button>`).join('')
      : '<div class="dkd-v21-site-empty">Bu aramayla eşleşen aktif site bulunamadı.</div>';
  }

  dkdInput?.addEventListener('input', (dkdEvent) => {
    if (DKD_V21.courierSiteChosen && dkdEvent.target.value !== DKD_V21.courierSiteLabel) {
      DKD_V21.courierSiteChosen = false;
      DKD_V21.courierSiteValue = '';
      DKD_V21.courierSiteLabel = '';
      dkdSiteSelect.value = '';
      dkdSelected.hidden = true;
      if (dkdGateSelect) {
        dkdGateSelect.disabled = true;
        dkdGateSelect.classList.add('dkd-v21-gate-locked');
      }
    }
    dkdRenderResults(dkdEvent.target.value);
  });

  dkdInput?.addEventListener('focus', () => dkdRenderResults(dkdInput.value));

  dkdResults?.addEventListener('click', (dkdEvent) => {
    const dkdButton = dkdEvent.target.closest('[data-site-value]');
    if (!dkdButton) return;
    const dkdValue = decodeURIComponent(dkdButton.dataset.siteValue || '');
    const dkdOption = dkdOptions.find((dkdItem) => dkdItem.value === dkdValue);
    if (!dkdOption) return;
    DKD_V21.courierSiteChosen = true;
    DKD_V21.courierSiteValue = dkdOption.value;
    DKD_V21.courierSiteLabel = dkdOption.label;
    dkdSiteSelect.value = dkdOption.value;
    dkdSiteSelect.dispatchEvent(new Event('input', { bubbles: true }));
    dkdSiteSelect.dispatchEvent(new Event('change', { bubbles: true }));
    if (dkdGateSelect) {
      dkdGateSelect.disabled = false;
      dkdGateSelect.classList.remove('dkd-v21-gate-locked');
    }
    dkdResults.hidden = true;
    dkdRenderSelected();
    dkdToast(`${dkdOption.label} seçildi`, 'success');
  });

  dkdRenderSelected();
}

function dkdEnhanceCourierSiteSearch() {
  const dkdForm = dkdFindCourierForm();
  if (!dkdForm) {
    if (DKD_V21.courierPageActive) {
      DKD_V21.courierPageActive = false;
      DKD_V21.courierSiteChosen = false;
      DKD_V21.courierSiteValue = '';
      DKD_V21.courierSiteLabel = '';
    }
    return;
  }
  if (!DKD_V21.courierPageActive) {
    DKD_V21.courierPageActive = true;
    DKD_V21.courierSiteChosen = false;
    DKD_V21.courierSiteValue = '';
    DKD_V21.courierSiteLabel = '';
  }
  const dkdSelects = Array.from(dkdForm.querySelectorAll('select'));
  if (dkdSelects.length < 2) return;
  dkdCreateSiteSearch(dkdForm, dkdSelects[0], dkdSelects[1]);
}

function dkdHideSecurityModeHero() {
  const dkdLabels = Array.from(document.querySelectorAll('div,span,p,h1,h2,h3,strong')).filter(
    (dkdItem) => dkdNormalize(dkdText(dkdItem)) === 'guvenlik modu',
  );
  dkdLabels.forEach((dkdLabel) => {
    let dkdCard = dkdLabel.parentElement;
    while (dkdCard && dkdCard !== document.body) {
      const dkdContent = dkdNormalize(dkdText(dkdCard));
      if (dkdContent.includes('aktif') && dkdContent.includes('canli') && dkdCard.getBoundingClientRect().height > 140) {
        dkdCard.classList.add('dkd-v21-security-mode-hidden');
        dkdCard.setAttribute('aria-hidden', 'true');
        break;
      }
      dkdCard = dkdCard.parentElement;
    }
  });
}

function dkdIsCourierProfilePage() {
  const dkdPageText = dkdNormalize(document.body.innerText);
  return dkdPageText.includes('erisilebilir roller') && dkdPageText.includes('kisisel web baglantisi') && dkdPageText.includes('kurye');
}

function dkdCourierCleanUrlFrom(dkdRawUrl) {
  const dkdMatch = String(dkdRawUrl || '').match(/https:\/\/www\.draborneagle\.com\/DraBornGate\/([^/\s]+)\/([^/?#\s]+)/i);
  if (!dkdMatch) return '';
  return `https://www.draborneagle.com/DraBornGate/${dkdMatch[2]}`;
}

function dkdFixCourierPersonalUrl() {
  if (!dkdIsCourierProfilePage()) return;
  const dkdWalker = document.createTreeWalker(document.querySelector('#dkd-app') || document.body, NodeFilter.SHOW_TEXT);
  const dkdNodes = [];
  while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);
  dkdNodes.forEach((dkdNode) => {
    const dkdCleanUrl = dkdCourierCleanUrlFrom(dkdNode.nodeValue);
    if (dkdCleanUrl) dkdNode.nodeValue = dkdNode.nodeValue.replace(/https:\/\/www\.draborneagle\.com\/DraBornGate\/[^/\s]+\/[^/?#\s]+/i, dkdCleanUrl);
  });
  document.querySelectorAll('a[href],input[value],textarea').forEach((dkdElement) => {
    const dkdSource = dkdElement.getAttribute('href') || dkdElement.value || '';
    const dkdCleanUrl = dkdCourierCleanUrlFrom(dkdSource);
    if (!dkdCleanUrl) return;
    if (dkdElement.matches('a')) dkdElement.setAttribute('href', dkdCleanUrl);
    else dkdElement.value = dkdCleanUrl;
  });
}

function dkdFixPlatformSelect() {
  const dkdLabels = Array.from(document.querySelectorAll('label,div,span,p')).filter(
    (dkdItem) => dkdNormalize(dkdText(dkdItem)) === 'teslimat platformu / kurum',
  );
  dkdLabels.forEach((dkdLabel) => {
    let dkdScope = dkdLabel.parentElement;
    let dkdSelect = null;
    for (let dkdDepth = 0; dkdDepth < 5 && dkdScope; dkdDepth += 1) {
      dkdSelect = dkdScope.querySelector('select');
      if (dkdSelect) break;
      dkdScope = dkdScope.parentElement;
    }
    if (!dkdSelect || dkdSelect.dataset.dkdV21Platform === 'true') return;
    dkdSelect.dataset.dkdV21Platform = 'true';
    const dkdOptions = Array.from(dkdSelect.options);
    const dkdTrendyol = dkdOptions.find((dkdOption) => dkdNormalize(dkdOption.textContent).includes('trendyol go'));
    if (!dkdTrendyol) return;
    dkdTrendyol.textContent = 'Uber/Trendyol GO';
    const dkdPlaceholder = dkdOptions.find((dkdOption) => !dkdOption.value);
    if (dkdPlaceholder?.nextSibling) dkdSelect.insertBefore(dkdTrendyol, dkdPlaceholder.nextSibling);
    else dkdSelect.insertBefore(dkdTrendyol, dkdSelect.firstChild);

    const dkdIsRegistration = dkdNormalize(document.body.innerText).includes('premium hesabi olustur');
    const dkdCurrentText = dkdNormalize(dkdSelect.selectedOptions?.[0]?.textContent);
    if (dkdIsRegistration && dkdCurrentText.includes('draborngo')) {
      dkdSelect.value = dkdTrendyol.value;
      dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
      dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  Array.from(document.querySelectorAll('option,button,div,span')).forEach((dkdItem) => {
    if (dkdNormalize(dkdText(dkdItem)) === 'trendyol go') dkdItem.textContent = 'Uber/Trendyol GO';
  });
}

function dkdUpdateVersionLabels() {
  const dkdWalker = document.createTreeWalker(document.querySelector('#dkd-app') || document.body, NodeFilter.SHOW_TEXT);
  while (dkdWalker.nextNode()) {
    const dkdNode = dkdWalker.currentNode;
    if (dkdNode.nodeValue?.includes('Web v2.0')) dkdNode.nodeValue = dkdNode.nodeValue.replaceAll('Web v2.0', 'Web v2.1');
    if (dkdNode.nodeValue?.includes('WEB v2.0')) dkdNode.nodeValue = dkdNode.nodeValue.replaceAll('WEB v2.0', 'WEB v2.1');
  }
}

function dkdPatchAll() {
  DKD_V21.patchQueued = false;
  dkdEnhanceCourierSiteSearch();
  dkdHideSecurityModeHero();
  dkdFixCourierPersonalUrl();
  dkdFixPlatformSelect();
  dkdUpdateVersionLabels();
}

function dkdQueuePatch() {
  if (DKD_V21.patchQueued) return;
  DKD_V21.patchQueued = true;
  requestAnimationFrame(dkdPatchAll);
}

function dkdActionButton(dkdTarget) {
  return dkdTarget?.closest?.('button, [role="button"], .btn, input[type="submit"]');
}

function dkdShouldLoad(dkdButton) {
  if (!dkdButton || dkdButton.closest('nav') || dkdButton.closest('[class*="bottom"]') || dkdButton.closest('[class*="menu"]')) return false;
  const dkdButtonText = dkdNormalize(dkdText(dkdButton) || dkdButton.value);
  return dkdButton.matches('[type="submit"],input[type="submit"]') || /(bul|olustur|kaydet|gonder|onayla|reddet|dogrula|yenile|ara|sil|giris|kayit|hesap|tamamla|kopyala)/.test(dkdButtonText);
}

function dkdStartLoading(dkdButton) {
  dkdButton.classList.add('dkd-v21-loading');
  dkdButton.setAttribute('aria-busy', 'true');
  document.documentElement.classList.add('dkd-v21-global-loading');
  clearTimeout(dkdButton._dkdLoadingTimer);
  dkdButton._dkdLoadingTimer = setTimeout(() => {
    dkdButton.classList.remove('dkd-v21-loading');
    dkdButton.removeAttribute('aria-busy');
    document.documentElement.classList.remove('dkd-v21-global-loading');
  }, 2400);
}

document.addEventListener('pointerdown', (dkdEvent) => {
  const dkdButton = dkdActionButton(dkdEvent.target);
  if (!dkdButton || dkdButton.disabled) return;
  dkdButton.classList.add('dkd-v21-pressed');
  setTimeout(() => dkdButton.classList.remove('dkd-v21-pressed'), 190);
}, true);

document.addEventListener('click', async (dkdEvent) => {
  const dkdButton = dkdActionButton(dkdEvent.target);
  const dkdButtonText = dkdNormalize(dkdText(dkdButton));

  if (dkdButtonText.includes('baglantiyi kopyala') && dkdIsCourierProfilePage()) {
    const dkdVisibleUrlNode = Array.from(document.querySelectorAll('a,div,p,span')).find((dkdItem) => dkdText(dkdItem).includes('https://www.draborneagle.com/DraBornGate/'));
    const dkdVisibleUrl = dkdText(dkdVisibleUrlNode).match(/https:\/\/www\.draborneagle\.com\/DraBornGate\/[^\s]+/)?.[0];
    if (dkdVisibleUrl) {
      dkdEvent.preventDefault();
      dkdEvent.stopImmediatePropagation();
      try {
        await navigator.clipboard.writeText(dkdVisibleUrl);
        dkdToast('Kişisel bağlantı kopyalandı', 'success');
      } catch {
        dkdToast('Bağlantı kopyalanamadı', 'error');
      }
      return;
    }
  }

  const dkdCourierForm = dkdFindCourierForm();
  if (dkdCourierForm && dkdButton && dkdCourierForm.contains(dkdButton) && /(gecis|talep|olustur|kaydet|gonder)/.test(dkdButtonText) && !DKD_V21.courierSiteChosen) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    dkdToast('Önce site adını aratıp sonuçlardan seçim yapın.', 'error');
    dkdCourierForm.querySelector('.dkd-v21-site-search input')?.focus();
    return;
  }

  if (dkdShouldLoad(dkdButton)) dkdStartLoading(dkdButton);
}, true);

document.addEventListener('submit', (dkdEvent) => {
  const dkdForm = dkdFindCourierForm();
  if (dkdForm && dkdEvent.target === dkdForm && !DKD_V21.courierSiteChosen) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    dkdToast('Kurye geçişi için önce bir site seçin.', 'error');
    dkdForm.querySelector('.dkd-v21-site-search input')?.focus();
  }
}, true);

const dkdCleanRoute = sessionStorage.getItem('dkd_gate_clean_personal_route');
if (dkdCleanRoute) {
  history.replaceState({}, '', dkdCleanRoute);
  sessionStorage.removeItem('dkd_gate_clean_personal_route');
}

const dkdObserver = new MutationObserver(dkdQueuePatch);
dkdObserver.observe(document.documentElement, { childList: true, subtree: true });
dkdQueuePatch();
