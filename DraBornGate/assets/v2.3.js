const DKD_V23 = {
  registrationActive: false,
  registrationStartedAt: 0,
  roleUserChanged: false,
  platformUserChanged: false,
  sitePageActive: false,
  siteChosen: false,
  siteValue: '',
  siteLabel: '',
  patchQueued: false,
};

function dkdV23Text(dkdElement) {
  return String(dkdElement?.textContent || '').replace(/\s+/g, ' ').trim();
}

function dkdV23Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dkdV23Visible(dkdElement) {
  if (!dkdElement) return false;
  const dkdStyle = getComputedStyle(dkdElement);
  const dkdRect = dkdElement.getBoundingClientRect();
  return dkdStyle.display !== 'none' && dkdStyle.visibility !== 'hidden' && dkdRect.width > 1 && dkdRect.height > 1;
}

function dkdV23ExactNodes(dkdValue) {
  const dkdTarget = dkdV23Normalize(dkdValue);
  return Array.from(document.querySelectorAll('button,[role="button"],label,div,span,strong,h1,h2,h3,p'))
    .filter((dkdElement) => dkdV23Visible(dkdElement) && dkdV23Normalize(dkdV23Text(dkdElement)) === dkdTarget);
}

function dkdV23IsRegistration() {
  const dkdPage = dkdV23Normalize(document.body.innerText);
  return dkdPage.includes('draborngate agina katil')
    && dkdPage.includes('premium hesabi olustur')
    && dkdPage.includes('kurye')
    && dkdPage.includes('site sakini');
}

function dkdV23FindRoleCard(dkdRoleName) {
  const dkdRole = dkdV23Normalize(dkdRoleName);
  const dkdOtherRoles = ['kurye', 'guvenlik', 'site yonetimi', 'site sakini'].filter((dkdItem) => dkdItem !== dkdRole);
  for (const dkdNode of dkdV23ExactNodes(dkdRoleName)) {
    let dkdCurrent = dkdNode;
    let dkdFallback = null;
    for (let dkdDepth = 0; dkdDepth < 7 && dkdCurrent && dkdCurrent !== document.body; dkdDepth += 1) {
      const dkdRect = dkdCurrent.getBoundingClientRect();
      const dkdContent = dkdV23Normalize(dkdV23Text(dkdCurrent));
      const dkdHasOtherRole = dkdOtherRoles.some((dkdItem) => dkdContent.includes(dkdItem));
      const dkdCardSize = dkdRect.width > 180 && dkdRect.height >= 62 && dkdRect.height <= 230;
      if (dkdCardSize && !dkdHasOtherRole && dkdContent.includes(dkdRole)) {
        dkdFallback = dkdCurrent;
        const dkdInteractive = dkdCurrent.matches('button,[role="button"],label')
          || dkdCurrent.querySelector('input[type="radio"]')
          || dkdCurrent.tabIndex >= 0
          || /(role|option|choice|select|card|tile)/i.test(String(dkdCurrent.className || ''));
        if (dkdInteractive) return dkdCurrent;
      }
      dkdCurrent = dkdCurrent.parentElement;
    }
    if (dkdFallback) return dkdFallback;
  }
  return null;
}

function dkdV23Activate(dkdElement) {
  if (!dkdElement) return;
  const dkdRadio = dkdElement.querySelector('input[type="radio"]');
  if (dkdRadio && !dkdRadio.checked) {
    dkdRadio.click();
    return;
  }
  dkdElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
  dkdElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
  dkdElement.click();
}

function dkdV23EnsureRegistrationDefaults() {
  const dkdRegistration = dkdV23IsRegistration();
  if (!dkdRegistration) {
    DKD_V23.registrationActive = false;
    DKD_V23.registrationStartedAt = 0;
    DKD_V23.roleUserChanged = false;
    DKD_V23.platformUserChanged = false;
    return;
  }

  if (!DKD_V23.registrationActive) {
    DKD_V23.registrationActive = true;
    DKD_V23.registrationStartedAt = Date.now();
    DKD_V23.roleUserChanged = false;
    DKD_V23.platformUserChanged = false;
  }

  const dkdElapsed = Date.now() - DKD_V23.registrationStartedAt;
  if (!DKD_V23.roleUserChanged && dkdElapsed < 3600) {
    const dkdCourierCard = dkdV23FindRoleCard('Kurye');
    if (dkdCourierCard) dkdV23Activate(dkdCourierCard);
  }

  if (!DKD_V23.platformUserChanged && dkdElapsed < 4600) {
    dkdV23EnsurePlatform();
  }
}

function dkdV23FindSelectByLabel(dkdLabelText) {
  const dkdTarget = dkdV23Normalize(dkdLabelText);
  const dkdLabels = Array.from(document.querySelectorAll('label,div,span,p,strong'))
    .filter((dkdElement) => dkdV23Visible(dkdElement) && dkdV23Normalize(dkdV23Text(dkdElement)) === dkdTarget);

  for (const dkdLabel of dkdLabels) {
    let dkdScope = dkdLabel.parentElement;
    for (let dkdDepth = 0; dkdDepth < 7 && dkdScope; dkdDepth += 1) {
      const dkdSelect = dkdScope.querySelector('select');
      if (dkdSelect) return dkdSelect;
      dkdScope = dkdScope.parentElement;
    }
  }
  return null;
}

function dkdV23SetSelectValue(dkdSelect, dkdValue) {
  if (!dkdSelect) return;
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
  else dkdSelect.value = dkdValue;
  Array.from(dkdSelect.options).forEach((dkdOption) => {
    dkdOption.selected = dkdOption.value === dkdValue;
  });
  dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
  dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

function dkdV23EnsurePlatform() {
  const dkdSelect = dkdV23FindSelectByLabel('Teslimat Platformu / Kurum');
  if (!dkdSelect) return;
  const dkdOptions = Array.from(dkdSelect.options);
  const dkdUber = dkdOptions.find((dkdOption) => {
    const dkdTextValue = dkdV23Normalize(dkdOption.textContent);
    return dkdTextValue.includes('trendyol go') || dkdTextValue.includes('uber/trendyol');
  });
  if (!dkdUber) return;

  dkdUber.textContent = 'Uber/Trendyol GO';
  const dkdPlaceholder = dkdOptions.find((dkdOption) => !dkdOption.value);
  const dkdExpected = dkdPlaceholder?.nextElementSibling || dkdSelect.firstElementChild;
  if (dkdExpected !== dkdUber) {
    if (dkdPlaceholder) dkdSelect.insertBefore(dkdUber, dkdPlaceholder.nextSibling);
    else dkdSelect.insertBefore(dkdUber, dkdSelect.firstChild);
  }
  if (dkdSelect.value !== dkdUber.value) dkdV23SetSelectValue(dkdSelect, dkdUber.value);
}

function dkdV23IsCourierPassPage() {
  const dkdPage = dkdV23Normalize(document.body.innerText);
  return dkdPage.includes('yeni kurye gecisi')
    && dkdPage.includes('musteri adi')
    && dkdPage.includes('siparis numarasi');
}

function dkdV23FindSiteSelect() {
  if (!dkdV23IsCourierPassPage()) return null;
  return dkdV23FindSelectByLabel('Site');
}

function dkdV23GateSelect() {
  return dkdV23FindSelectByLabel('Kapı') || dkdV23FindSelectByLabel('Kapi');
}

function dkdV23SiteIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h4M9 11h4M9 15h4M17 9h2a1 1 0 0 1 1 1v11"></path></svg>';
}

function dkdV23SearchIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>';
}

function dkdV23OptionText(dkdElement) {
  return String(dkdElement?.textContent || '').trim();
}

function dkdV23MountSiteSearch(dkdSelect) {
  if (!dkdSelect) return;
  if (!DKD_V23.sitePageActive) {
    DKD_V23.sitePageActive = true;
    DKD_V23.siteChosen = false;
    DKD_V23.siteValue = '';
    DKD_V23.siteLabel = '';
  }

  document.querySelectorAll('.dkd-v21-site-search').forEach((dkdElement) => dkdElement.remove());
  dkdSelect.classList.add('dkd-v23-native-site');

  if (!DKD_V23.siteChosen) {
    if (dkdSelect.value) dkdV23SetSelectValue(dkdSelect, '');
    const dkdGate = dkdV23GateSelect();
    if (dkdGate) {
      dkdGate.disabled = true;
      dkdGate.classList.add('dkd-v23-locked');
    }
  } else if (Array.from(dkdSelect.options).some((dkdOption) => dkdOption.value === DKD_V23.siteValue)) {
    if (dkdSelect.value !== DKD_V23.siteValue) dkdV23SetSelectValue(dkdSelect, DKD_V23.siteValue);
    const dkdGate = dkdV23GateSelect();
    if (dkdGate) {
      dkdGate.disabled = false;
      dkdGate.classList.remove('dkd-v23-locked');
    }
  }

  let dkdWidget = dkdSelect.parentElement?.querySelector(':scope > .dkd-v23-site-search');
  if (dkdWidget) return;

  dkdWidget = document.createElement('div');
  dkdWidget.className = 'dkd-v23-site-search';
  dkdWidget.innerHTML = `
    <div class="dkd-v23-site-input-shell">
      <span>${dkdV23SearchIcon()}</span>
      <input type="search" autocomplete="off" inputmode="search" placeholder="Site adı veya şehir yazarak ara" aria-label="Site ara">
      <b>ARA</b>
    </div>
    <div class="dkd-v23-site-selected" hidden></div>
    <div class="dkd-v23-site-results" hidden></div>
    <p>Site otomatik seçilmez. En az 2 harf yazarak sonuçlardan seçim yapın.</p>
  `;
  dkdSelect.parentElement?.insertBefore(dkdWidget, dkdSelect);

  const dkdInput = dkdWidget.querySelector('input');
  const dkdResults = dkdWidget.querySelector('.dkd-v23-site-results');
  const dkdSelected = dkdWidget.querySelector('.dkd-v23-site-selected');

  const dkdRenderSelected = () => {
    if (!DKD_V23.siteChosen) {
      dkdSelected.hidden = true;
      dkdSelected.innerHTML = '';
      return;
    }
    dkdSelected.hidden = false;
    dkdSelected.innerHTML = `<span>${dkdV23SiteIcon()}</span><div><small>SEÇİLEN SİTE</small><strong>${DKD_V23.siteLabel}</strong></div><i>✓</i>`;
    dkdInput.value = DKD_V23.siteLabel;
  };

  const dkdRenderResults = () => {
    const dkdQuery = dkdV23Normalize(dkdInput.value);
    if (dkdQuery.length < 2) {
      dkdResults.hidden = true;
      dkdResults.innerHTML = '';
      return;
    }
    const dkdOptions = Array.from(dkdSelect.options)
      .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
      .map((dkdOption) => ({ value: dkdOption.value, label: dkdV23OptionText(dkdOption) }))
      .filter((dkdOption) => dkdV23Normalize(dkdOption.label).includes(dkdQuery))
      .slice(0, 15);
    dkdResults.hidden = false;
    dkdResults.innerHTML = dkdOptions.length
      ? dkdOptions.map((dkdOption) => `<button type="button" data-dkd-site="${encodeURIComponent(dkdOption.value)}"><span>${dkdV23SiteIcon()}</span><strong>${dkdOption.label}</strong><i>SEÇ</i></button>`).join('')
      : '<div class="dkd-v23-site-empty">Eşleşen aktif site bulunamadı.</div>';
  };

  dkdInput.addEventListener('input', () => {
    if (DKD_V23.siteChosen && dkdInput.value !== DKD_V23.siteLabel) {
      DKD_V23.siteChosen = false;
      DKD_V23.siteValue = '';
      DKD_V23.siteLabel = '';
      dkdV23SetSelectValue(dkdSelect, '');
      dkdSelected.hidden = true;
      const dkdGate = dkdV23GateSelect();
      if (dkdGate) {
        dkdGate.disabled = true;
        dkdGate.classList.add('dkd-v23-locked');
      }
    }
    dkdRenderResults();
  });
  dkdInput.addEventListener('focus', dkdRenderResults);
  dkdResults.addEventListener('click', (dkdEvent) => {
    const dkdButton = dkdEvent.target.closest('[data-dkd-site]');
    if (!dkdButton) return;
    const dkdValue = decodeURIComponent(dkdButton.dataset.dkdSite || '');
    const dkdOption = Array.from(dkdSelect.options).find((dkdItem) => dkdItem.value === dkdValue);
    if (!dkdOption) return;
    DKD_V23.siteChosen = true;
    DKD_V23.siteValue = dkdOption.value;
    DKD_V23.siteLabel = dkdV23OptionText(dkdOption);
    dkdV23SetSelectValue(dkdSelect, dkdOption.value);
    const dkdGate = dkdV23GateSelect();
    if (dkdGate) {
      dkdGate.disabled = false;
      dkdGate.classList.remove('dkd-v23-locked');
    }
    dkdResults.hidden = true;
    dkdRenderSelected();
  });
  dkdRenderSelected();
}

function dkdV23EnsureSiteSearch() {
  const dkdSelect = dkdV23FindSiteSelect();
  if (!dkdSelect) {
    if (DKD_V23.sitePageActive) {
      DKD_V23.sitePageActive = false;
      DKD_V23.siteChosen = false;
      DKD_V23.siteValue = '';
      DKD_V23.siteLabel = '';
    }
    return;
  }
  dkdV23MountSiteSearch(dkdSelect);
}

function dkdV23HideCardByText(dkdNeedles, dkdClassName) {
  const dkdElements = Array.from(document.querySelectorAll('div,section,article,aside,span,p,h1,h2,h3,strong'));
  for (const dkdElement of dkdElements) {
    const dkdTextValue = dkdV23Normalize(dkdV23Text(dkdElement));
    if (!dkdNeedles.every((dkdNeedle) => dkdTextValue.includes(dkdNeedle))) continue;
    let dkdCurrent = dkdElement;
    for (let dkdDepth = 0; dkdDepth < 6 && dkdCurrent && dkdCurrent !== document.body; dkdDepth += 1) {
      const dkdRect = dkdCurrent.getBoundingClientRect();
      if (dkdRect.width > 220 && dkdRect.height >= 90 && dkdRect.height <= 520) {
        dkdCurrent.classList.add(dkdClassName);
        dkdCurrent.setAttribute('aria-hidden', 'true');
        break;
      }
      dkdCurrent = dkdCurrent.parentElement;
    }
  }
}

function dkdV23HideUnwantedCards() {
  dkdV23HideCardByText(['canli senkron', 'web', 'uygulama'], 'dkd-v23-hidden-card');
  dkdV23HideCardByText(['guvenlik modu', 'aktif'], 'dkd-v23-hidden-card');
}

function dkdV23ShortCourierUrl(dkdValue) {
  return String(dkdValue || '').replace(
    /https:\/\/www\.draborneagle\.com\/DraBornGate\/[^/\s]+\/((?:kurye|courier)-[^/?#\s]+)/gi,
    'https://www.draborneagle.com/DraBornGate/$1',
  );
}

function dkdV23FixCourierUrls() {
  const dkdRoot = document.querySelector('#dkd-app') || document.body;
  const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
  const dkdNodes = [];
  while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);
  dkdNodes.forEach((dkdNode) => {
    const dkdUpdated = dkdV23ShortCourierUrl(dkdNode.nodeValue);
    if (dkdUpdated !== dkdNode.nodeValue) dkdNode.nodeValue = dkdUpdated;
  });
  document.querySelectorAll('a[href],input[value],textarea').forEach((dkdElement) => {
    const dkdCurrent = dkdElement.matches('a') ? dkdElement.getAttribute('href') : dkdElement.value;
    const dkdUpdated = dkdV23ShortCourierUrl(dkdCurrent);
    if (dkdUpdated === dkdCurrent) return;
    if (dkdElement.matches('a')) dkdElement.setAttribute('href', dkdUpdated);
    else dkdElement.value = dkdUpdated;
  });
}

const DKD_V23_TRANSLATIONS = new Map([
  ['gates', 'Kapılar'], ['staff', 'Güvenlik Personeli'], ['residents', 'Site Sakinleri'],
  ['courier passes month', 'Aylık Kurye Geçişi'], ['visitor passes month', 'Aylık Ziyaretçi Geçişi'],
  ['dashboard', 'Ana Merkez'], ['overview', 'Genel Bakış'], ['applications', 'Başvurular'],
  ['reports', 'Raporlar'], ['settings', 'Ayarlar'], ['notifications', 'Bildirimler'],
  ['status', 'Durum'], ['pending', 'Bekleyen'], ['approved', 'Onaylanan'], ['rejected', 'Reddedilen'],
]);

function dkdV23TranslateAndVersion() {
  const dkdRoot = document.querySelector('#dkd-app') || document.body;
  const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
  const dkdNodes = [];
  while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);
  dkdNodes.forEach((dkdNode) => {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(dkdNode.parentElement?.tagName)) return;
    let dkdValue = String(dkdNode.nodeValue || '');
    const dkdNormalized = dkdV23Normalize(dkdValue);
    if (DKD_V23_TRANSLATIONS.has(dkdNormalized)) dkdValue = DKD_V23_TRANSLATIONS.get(dkdNormalized);
    dkdValue = dkdValue
      .replace(/DraBornGate Web v2\.[0-2](?:\.\d+)?/gi, 'DraBornGate Web v2.3.0')
      .replace(/\bWEB v2\.[0-2](?:\.\d+)?/g, 'WEB v2.3')
      .replace(/\bWeb v2\.[0-2](?:\.\d+)?/g, 'Web v2.3');
    if (dkdValue !== dkdNode.nodeValue) dkdNode.nodeValue = dkdValue;
  });
  document.documentElement.dataset.dkdWebVersion = '2.3.0';
}

function dkdV23ActionButton(dkdTarget) {
  return dkdTarget?.closest?.('button,input[type="submit"],[role="button"],.btn');
}

function dkdV23ShouldLoad(dkdButton) {
  if (!dkdButton || dkdButton.closest('nav,aside,[class*="bottom"],[class*="tab"],[class*="menu"]')) return false;
  if (dkdButton.matches('[data-dkd-site]')) return false;
  const dkdLabel = dkdV23Normalize(dkdV23Text(dkdButton) || dkdButton.value);
  return dkdButton.matches('[type="submit"],input[type="submit"]')
    || /(olustur|kaydet|gonder|onayla|reddet|dogrula|yenile|bul|ara|sil|giris|kayit|hesap|tamamla|kopyala|gecis|talep)/.test(dkdLabel);
}

function dkdV23StartLoading(dkdButton) {
  if (!dkdButton) return;
  dkdButton.classList.add('dkd-v23-loading');
  dkdButton.setAttribute('aria-busy', 'true');
  document.documentElement.classList.add('dkd-v23-global-loading');
  clearTimeout(dkdButton._dkdV23LoadingTimer);
  dkdButton._dkdV23LoadingTimer = setTimeout(() => {
    dkdButton.classList.remove('dkd-v23-loading');
    dkdButton.removeAttribute('aria-busy');
    if (!document.querySelector('.dkd-v23-loading')) document.documentElement.classList.remove('dkd-v23-global-loading');
  }, 3000);
}

function dkdV23Patch() {
  DKD_V23.patchQueued = false;
  dkdV23EnsureRegistrationDefaults();
  dkdV23EnsureSiteSearch();
  dkdV23HideUnwantedCards();
  dkdV23FixCourierUrls();
  dkdV23TranslateAndVersion();
}

function dkdV23QueuePatch() {
  if (DKD_V23.patchQueued) return;
  DKD_V23.patchQueued = true;
  requestAnimationFrame(dkdV23Patch);
}

document.addEventListener('pointerdown', (dkdEvent) => {
  const dkdButton = dkdV23ActionButton(dkdEvent.target);
  if (dkdButton && !dkdButton.disabled) dkdButton.classList.add('dkd-v23-pressed');

  if (dkdV23IsRegistration()) {
    const dkdRoleNames = ['Kurye', 'Güvenlik', 'Site Yönetimi', 'Site Sakini'];
    for (const dkdRoleName of dkdRoleNames) {
      const dkdCard = dkdV23FindRoleCard(dkdRoleName);
      if (dkdCard?.contains(dkdEvent.target)) {
        DKD_V23.roleUserChanged = dkdRoleName !== 'Kurye';
        break;
      }
    }
    const dkdPlatform = dkdV23FindSelectByLabel('Teslimat Platformu / Kurum');
    if (dkdPlatform && (dkdPlatform === dkdEvent.target || dkdPlatform.contains(dkdEvent.target))) {
      DKD_V23.platformUserChanged = true;
    }
  }
}, true);

['pointerup', 'pointercancel'].forEach((dkdEventName) => {
  document.addEventListener(dkdEventName, () => {
    document.querySelectorAll('.dkd-v23-pressed').forEach((dkdElement) => dkdElement.classList.remove('dkd-v23-pressed'));
  }, true);
});

document.addEventListener('click', async (dkdEvent) => {
  const dkdButton = dkdV23ActionButton(dkdEvent.target);
  const dkdLabel = dkdV23Normalize(dkdV23Text(dkdButton));

  if (dkdLabel.includes('baglantiyi kopyala')) {
    const dkdPageText = dkdV23ShortCourierUrl(document.body.innerText);
    const dkdUrl = dkdPageText.match(/https:\/\/www\.draborneagle\.com\/DraBornGate\/(?:kurye|courier)-[^\s]+/i)?.[0];
    if (dkdUrl) {
      dkdEvent.preventDefault();
      dkdEvent.stopImmediatePropagation();
      try { await navigator.clipboard.writeText(dkdUrl); } catch { /* Tarayıcı iznine bağlıdır. */ }
    }
  }

  if (dkdV23ShouldLoad(dkdButton)) dkdV23StartLoading(dkdButton);
  setTimeout(dkdV23QueuePatch, 50);
  setTimeout(dkdV23QueuePatch, 260);
}, true);

document.addEventListener('submit', (dkdEvent) => {
  const dkdSiteSelect = dkdV23FindSiteSelect();
  if (dkdSiteSelect && dkdEvent.target.contains(dkdSiteSelect) && !DKD_V23.siteChosen) {
    dkdEvent.preventDefault();
    dkdEvent.stopImmediatePropagation();
    dkdSiteSelect.parentElement?.querySelector('.dkd-v23-site-search input')?.focus();
    return;
  }
  dkdV23StartLoading(dkdEvent.submitter || dkdEvent.target.querySelector('[type="submit"]'));
}, true);

const dkdV23Observer = new MutationObserver(dkdV23QueuePatch);
dkdV23Observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
window.addEventListener('popstate', dkdV23QueuePatch);
window.addEventListener('hashchange', dkdV23QueuePatch);
dkdV23QueuePatch();
