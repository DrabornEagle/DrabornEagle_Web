const DKD_V323_UI_VERSION = '3.2.3';
const dkdV323CategoryOpen = new Set();
let dkdV323QueueOpen = false;
let dkdV323PatchQueued = false;
const dkdV323SiteState = { active: false, value: '', label: '' };

function dkdV323Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV323ExactText(dkdText, dkdRoot = document) {
  const dkdWanted = dkdV323Normalize(dkdText);
  return [...dkdRoot.querySelectorAll('h1,h2,h3,h4,strong,b,span,p,label,button,a,[role="button"]')]
    .find((dkdElement) => dkdV323Normalize(dkdElement.textContent) === dkdWanted);
}

function dkdV323ClosestCard(dkdElement) {
  let dkdNode = dkdElement;
  for (let dkdDepth = 0; dkdNode && dkdDepth < 8; dkdDepth += 1, dkdNode = dkdNode.parentElement) {
    const dkdRect = dkdNode.getBoundingClientRect();
    const dkdText = String(dkdNode.textContent || '').trim();
    if (dkdRect.width > 180 && dkdRect.height > 80 && dkdRect.height < 560 && dkdText.length < 900) return dkdNode;
  }
  return dkdElement?.closest('article,section,li,div');
}

function dkdV323PatchSimpleTheme() {
  const dkdRoot = document.querySelector('#dkd-v31-root');
  if (!dkdRoot) return;
  dkdRoot.classList.add('dkd-v323-simple-root');

  const dkdFinder = dkdRoot.querySelector('.dkd-v31-finder');
  if (dkdFinder) {
    dkdFinder.classList.add('dkd-v323-premium-finder');
    dkdFinder.querySelector('.dkd-v31-finder-copy p')?.remove();
    const dkdHeading = dkdFinder.querySelector('.dkd-v31-finder-copy h1');
    if (dkdHeading) dkdHeading.textContent = 'Kuryeni Bul ve Eşleştir';
    const dkdBadge = dkdFinder.querySelector('.dkd-v31-finder-copy>span');
    if (dkdBadge) dkdBadge.textContent = 'GÜVENLİ EŞLEŞTİRME · 6 HANELİ KOD';
  }

  const dkdQueue = dkdRoot.querySelector('.dkd-v31-live-queue');
  if (dkdQueue && dkdQueue.dataset.dkdV323Bound !== 'true') {
    dkdQueue.dataset.dkdV323Bound = 'true';
    dkdQueue.open = dkdV323QueueOpen;
    dkdQueue.addEventListener('toggle', () => { dkdV323QueueOpen = dkdQueue.open; });
  } else if (dkdQueue) {
    dkdQueue.open = dkdV323QueueOpen;
  }

  for (const dkdCategory of dkdRoot.querySelectorAll('.dkd-v31-queue-category')) {
    const dkdKey = dkdCategory.dataset.dkdV31Category || '';
    dkdCategory.open = dkdV323CategoryOpen.has(dkdKey);
    if (dkdCategory.dataset.dkdV323Bound === 'true') continue;
    dkdCategory.dataset.dkdV323Bound = 'true';
    dkdCategory.addEventListener('toggle', () => {
      if (dkdCategory.open) dkdV323CategoryOpen.add(dkdKey);
      else dkdV323CategoryOpen.delete(dkdKey);
    });
  }
}

function dkdV323PatchPassModal() {
  const dkdModal = document.querySelector('#dkd-v31-global-modal:not([hidden]) .dkd-v31-pass-modal');
  if (!dkdModal) return;
  dkdModal.classList.add('dkd-v323-pass-modal');
  const dkdHeaderSpan = dkdModal.querySelector('header>div>span');
  if (dkdHeaderSpan) dkdHeaderSpan.textContent = 'GÜVENLİ KURYE EŞLEŞTİRME';
  const dkdHeaderTitle = dkdModal.querySelector('header h2');
  if (dkdHeaderTitle) dkdHeaderTitle.textContent = 'Kurye ve Teslimat Bilgileri';
  const dkdHeaderInfo = dkdModal.querySelector('header p');
  if (dkdHeaderInfo) dkdHeaderInfo.textContent = 'Kod, kurye, plaka, gönderi ve hedef adres bilgilerini kontrol edin.';
}

function dkdV323PatchStats() {
  const dkdCards = [];
  for (const dkdLabel of ['Tamamlanan', 'Aktif Geçiş', 'Aktif Site']) {
    const dkdText = dkdV323ExactText(dkdLabel);
    const dkdCard = dkdText && dkdV323ClosestCard(dkdText);
    if (!dkdCard || dkdCard.closest('#dkd-v31-root,#dkd-v31-global-modal')) continue;
    dkdCard.classList.add('dkd-v323-stat-card');
    if (!dkdCards.includes(dkdCard)) dkdCards.push(dkdCard);

    const dkdLive = [...dkdCard.querySelectorAll('span,strong,b,p')]
      .find((dkdNode) => dkdV323Normalize(dkdNode.textContent) === 'canli');
    if (dkdLive) dkdLive.classList.add('dkd-v323-stat-live');
  }

  if (dkdCards.length >= 2) {
    const dkdParent = dkdCards[0].parentElement;
    if (dkdParent && dkdCards.every((dkdCard) => dkdCard.parentElement === dkdParent)) dkdParent.classList.add('dkd-v323-stat-grid');
  }

  const dkdSiteLabel = dkdV323ExactText('Aktif Site');
  const dkdSiteCard = dkdSiteLabel && dkdV323ClosestCard(dkdSiteLabel);
  if (!dkdSiteCard || dkdSiteCard.dataset.dkdV323CourierSite === 'true') return;
  const dkdPageText = dkdV323Normalize(document.body.innerText);
  if (!dkdPageText.includes('kurye')) return;

  dkdSiteCard.dataset.dkdV323CourierSite = 'true';
  dkdSiteLabel.textContent = 'Site Bağlantısı';
  const dkdDescription = [...dkdSiteCard.querySelectorAll('p,span,small')]
    .find((dkdNode) => dkdV323Normalize(dkdNode.textContent).includes('erisilebilir site agi'));
  if (dkdDescription) dkdDescription.textContent = 'Geçiş oluştururken seçilir';
  const dkdNumber = [...dkdSiteCard.querySelectorAll('strong,b,h1,h2,h3,span,p')]
    .find((dkdNode) => /^\d+$/.test(String(dkdNode.textContent || '').trim()));
  if (dkdNumber) dkdNumber.textContent = 'YOK';
}

function dkdV323FindLabeledSelect(dkdLabelText) {
  const dkdLabel = dkdV323ExactText(dkdLabelText);
  if (!dkdLabel) return null;
  let dkdScope = dkdLabel.parentElement;
  for (let dkdDepth = 0; dkdScope && dkdDepth < 7; dkdDepth += 1, dkdScope = dkdScope.parentElement) {
    const dkdSelect = dkdScope.querySelector('select');
    if (dkdSelect) return dkdSelect;
  }
  return null;
}

function dkdV323SetSelect(dkdSelect, dkdValue) {
  const dkdSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  if (dkdSetter) dkdSetter.call(dkdSelect, dkdValue);
  else dkdSelect.value = dkdValue;
  dkdSelect.dispatchEvent(new Event('input', { bubbles: true }));
  dkdSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

function dkdV323ResetSitePage() {
  dkdV323SiteState.active = false;
  dkdV323SiteState.value = '';
  dkdV323SiteState.label = '';
}

function dkdV323PatchSiteSearch() {
  const dkdPageText = dkdV323Normalize(document.body.innerText);
  const dkdOnPage = dkdPageText.includes('yeni kurye gecisi') && dkdPageText.includes('musteri adi') && dkdPageText.includes('siparis numarasi');
  if (!dkdOnPage) {
    if (dkdV323SiteState.active) dkdV323ResetSitePage();
    return;
  }

  const dkdSelect = dkdV323FindLabeledSelect('Site');
  if (!dkdSelect) return;
  dkdV323SiteState.active = true;
  dkdSelect.classList.add('dkd-v323-native-site');
  document.querySelectorAll('.dkd-v23-site-search').forEach((dkdNode) => dkdNode.remove());

  let dkdEmpty = [...dkdSelect.options].find((dkdOption) => dkdOption.value === '');
  if (!dkdEmpty) {
    dkdEmpty = new Option('Site seçilmedi', '', true, true);
    dkdEmpty.disabled = true;
    dkdSelect.insertBefore(dkdEmpty, dkdSelect.firstChild);
  }

  if (!dkdV323SiteState.value && dkdSelect.value) {
    dkdV323SetSelect(dkdSelect, '');
    const dkdGate = dkdV323FindLabeledSelect('Kapı') || dkdV323FindLabeledSelect('Kapi');
    if (dkdGate) {
      dkdV323SetSelect(dkdGate, '');
      dkdGate.disabled = true;
    }
  }

  let dkdWidget = dkdSelect.parentElement?.querySelector(':scope > .dkd-v323-site-search');
  if (dkdWidget) return;
  dkdWidget = document.createElement('div');
  dkdWidget.className = 'dkd-v323-site-search';
  dkdWidget.innerHTML = `
    <label>Site Ara</label>
    <div class="dkd-v323-site-input"><span aria-hidden="true">⌕</span><input type="search" autocomplete="off" inputmode="search" placeholder="Site adı veya şehir yazın" aria-label="Site adı veya şehir ara"><b>ARA</b></div>
    <div class="dkd-v323-site-selected" hidden></div>
    <div class="dkd-v323-site-results" hidden></div>
  `;
  dkdSelect.parentElement?.insertBefore(dkdWidget, dkdSelect);

  const dkdInput = dkdWidget.querySelector('input');
  const dkdResults = dkdWidget.querySelector('.dkd-v323-site-results');
  const dkdSelected = dkdWidget.querySelector('.dkd-v323-site-selected');

  const dkdRenderSelected = () => {
    if (!dkdV323SiteState.value) {
      dkdSelected.hidden = true;
      dkdSelected.innerHTML = '';
      return;
    }
    dkdSelected.hidden = false;
    dkdSelected.innerHTML = `<div><small>SEÇİLEN SİTE</small><strong>${dkdV323SiteState.label}</strong></div><button type="button">Değiştir</button>`;
  };

  const dkdRenderResults = () => {
    const dkdQuery = dkdV323Normalize(dkdInput.value);
    if (dkdQuery.length < 2) {
      dkdResults.hidden = true;
      dkdResults.innerHTML = '';
      return;
    }
    const dkdMatches = [...dkdSelect.options]
      .filter((dkdOption) => dkdOption.value && !dkdOption.disabled)
      .map((dkdOption) => ({ value: dkdOption.value, label: String(dkdOption.textContent || '').trim() }))
      .filter((dkdOption) => dkdV323Normalize(dkdOption.label).includes(dkdQuery))
      .slice(0, 12);
    dkdResults.hidden = false;
    dkdResults.innerHTML = dkdMatches.length
      ? dkdMatches.map((dkdOption) => `<button type="button" data-dkd-v323-site="${encodeURIComponent(dkdOption.value)}"><span>▦</span><strong>${dkdOption.label}</strong><b>SEÇ</b></button>`).join('')
      : '<p>Eşleşen aktif site bulunamadı.</p>';
  };

  dkdInput.addEventListener('input', dkdRenderResults);
  dkdInput.addEventListener('focus', dkdRenderResults);
  dkdResults.addEventListener('click', (dkdEvent) => {
    const dkdButton = dkdEvent.target.closest('[data-dkd-v323-site]');
    if (!dkdButton) return;
    const dkdValue = decodeURIComponent(dkdButton.dataset.dkdV323Site || '');
    const dkdOption = [...dkdSelect.options].find((dkdItem) => dkdItem.value === dkdValue);
    if (!dkdOption) return;
    dkdV323SiteState.value = dkdOption.value;
    dkdV323SiteState.label = String(dkdOption.textContent || '').trim();
    dkdV323SetSelect(dkdSelect, dkdOption.value);
    const dkdGate = dkdV323FindLabeledSelect('Kapı') || dkdV323FindLabeledSelect('Kapi');
    if (dkdGate) dkdGate.disabled = false;
    dkdInput.value = dkdV323SiteState.label;
    dkdResults.hidden = true;
    dkdRenderSelected();
  });
  dkdSelected.addEventListener('click', () => {
    dkdV323SiteState.value = '';
    dkdV323SiteState.label = '';
    dkdV323SetSelect(dkdSelect, '');
    const dkdGate = dkdV323FindLabeledSelect('Kapı') || dkdV323FindLabeledSelect('Kapi');
    if (dkdGate) {
      dkdV323SetSelect(dkdGate, '');
      dkdGate.disabled = true;
    }
    dkdInput.value = '';
    dkdRenderSelected();
    dkdInput.focus();
  });
  dkdRenderSelected();
}

function dkdV323PatchVersion() {
  document.documentElement.dataset.dkdWebVersion = DKD_V323_UI_VERSION;
  const dkdWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (dkdWalker.nextNode()) {
    const dkdNode = dkdWalker.currentNode;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(dkdNode.parentElement?.tagName)) continue;
    const dkdValue = String(dkdNode.nodeValue || '');
    const dkdUpdated = dkdValue.replace(/\b(?:WEB|Web)\s+v3\.2\.2\b/g, (dkdMatch) => dkdMatch.replace('3.2.2', '3.2.3'));
    if (dkdUpdated !== dkdValue) dkdNode.nodeValue = dkdUpdated;
  }
}

function dkdV323Patch() {
  dkdV323PatchQueued = false;
  dkdV323PatchVersion();
  dkdV323PatchSimpleTheme();
  dkdV323PatchPassModal();
  dkdV323PatchStats();
  dkdV323PatchSiteSearch();
}

function dkdV323QueuePatch() {
  if (dkdV323PatchQueued) return;
  dkdV323PatchQueued = true;
  requestAnimationFrame(dkdV323Patch);
}

new MutationObserver(dkdV323QueuePatch).observe(document.body, { childList: true, subtree: true });
window.addEventListener('popstate', dkdV323QueuePatch);
window.addEventListener('hashchange', dkdV323QueuePatch);
document.addEventListener('click', () => setTimeout(dkdV323QueuePatch, 40), true);
dkdV323QueuePatch();
