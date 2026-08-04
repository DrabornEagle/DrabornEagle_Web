(() => {
  'use strict';

  const DKD_V25_VERSION = '2.5.2';
  const DKD_V25_THEME_KEY = 'dkd_gate_security_theme';
  const DKD_V25_FORCE_KEY = 'dkd_gate_force_theme';
  const DKD_V25_SIMPLE_PATH = '/DraBornGate/Guvenlik-Sade-Tema/';
  const DKD_V25_STATE = {
    queued: false,
    queueOpenedAt: 0,
    renderTimer: 0,
  };

  function dkdV25Normalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function dkdV25Text(dkdElement) {
    return String(dkdElement?.innerText || dkdElement?.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function dkdV25IsSimpleMode() {
    return location.pathname.toLocaleLowerCase('tr-TR').includes('/guvenlik-sade-tema')
      || sessionStorage.getItem(DKD_V25_THEME_KEY) === 'simple'
      || sessionStorage.getItem(DKD_V25_FORCE_KEY) === 'simple'
      || Boolean(document.querySelector('.dkd-v24-simple-shell'));
  }

  function dkdV25ReplaceVersions() {
    const dkdRoot = document.querySelector('#dkd-app') || document.body;
    if (!dkdRoot) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    const dkdNodes = [];
    while (dkdWalker.nextNode()) dkdNodes.push(dkdWalker.currentNode);
    dkdNodes.forEach((dkdNode) => {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(dkdNode.parentElement?.tagName)) return;
      const dkdCurrent = String(dkdNode.nodeValue || '');
      const dkdUpdated = dkdCurrent
        .replace(/DraBornGate Web v2\.[0-4](?:\.\d+)?/gi, `DraBornGate Web v${DKD_V25_VERSION}`)
        .replace(/\bWEB v2\.[0-4](?:\.\d+)?/g, 'WEB v2.5')
        .replace(/\bWeb v2\.[0-4](?:\.\d+)?/g, 'Web v2.5')
        .replace(/\bv2\.[0-4]\.0\b/g, `v${DKD_V25_VERSION}`);
      if (dkdUpdated !== dkdCurrent) dkdNode.nodeValue = dkdUpdated;
    });
    document.documentElement.dataset.dkdWebVersion = DKD_V25_VERSION;
    if (/DraBornGate Web v2\.[0-4]/i.test(document.title)) {
      document.title = document.title.replace(/DraBornGate Web v2\.[0-4](?:\.\d+)?/i, `DraBornGate Web v${DKD_V25_VERSION}`);
    }
  }

  function dkdV25Interactive(dkdElement) {
    if (!dkdElement) return null;
    return dkdElement.closest?.('button,a,[role="button"],input[type="submit"]') || dkdElement;
  }

  function dkdV25FindThemeCard(dkdAction, dkdType) {
    let dkdCurrent = dkdAction;
    const dkdNeedles = dkdType === 'modern'
      ? ['modern tema', 'mevcut guvenlik merkezi']
      : ['sade tema', 'hizli kurye eslestirme'];
    for (let dkdDepth = 0; dkdDepth < 9 && dkdCurrent && dkdCurrent !== document.body; dkdDepth += 1) {
      const dkdContent = dkdV25Normalize(dkdV25Text(dkdCurrent));
      if (dkdNeedles.every((dkdNeedle) => dkdContent.includes(dkdNeedle))) return dkdCurrent;
      dkdCurrent = dkdCurrent.parentElement;
    }
    return null;
  }

  function dkdV25FixThemeChooserLayout() {
    const dkdElements = Array.from(document.querySelectorAll('button,a,[role="button"],div,span,strong,p'));
    dkdElements.forEach((dkdElement) => {
      const dkdLabel = dkdV25Normalize(dkdV25Text(dkdElement));
      const dkdType = dkdLabel.includes('modern temayi ac') ? 'modern'
        : dkdLabel.includes('sade temayi ac') ? 'simple'
          : '';
      if (!dkdType) return;
      const dkdAction = dkdV25Interactive(dkdElement);
      const dkdCard = dkdV25FindThemeCard(dkdAction, dkdType);
      if (!dkdCard || !dkdAction || dkdCard === dkdAction) return;
      dkdCard.classList.add('dkd-v25-theme-card', `dkd-v25-theme-card-${dkdType}`);
      dkdAction.classList.add('dkd-v25-theme-action');
      if (dkdAction.parentElement !== dkdCard) dkdCard.appendChild(dkdAction);
    });
  }

  function dkdV25FindExactAction(dkdPattern, dkdExcludeSimple = false) {
    return Array.from(document.querySelectorAll('button,a,[role="button"],input[type="submit"]'))
      .find((dkdElement) => {
        if (dkdExcludeSimple && dkdElement.closest('.dkd-v24-simple-shell,.dkd-v25-simple-list')) return false;
        return dkdPattern.test(dkdV25Normalize(dkdV25Text(dkdElement) || dkdElement.value));
      }) || null;
  }

  function dkdV25Visible(dkdElement) {
    if (!dkdElement) return false;
    const dkdStyle = getComputedStyle(dkdElement);
    const dkdRect = dkdElement.getBoundingClientRect();
    return dkdStyle.display !== 'none' && dkdStyle.visibility !== 'hidden' && Number(dkdStyle.opacity || 1) !== 0 && dkdRect.width > 1 && dkdRect.height > 1;
  }

  function dkdV25EnsureModernToSimpleSwitch() {
    const dkdChooser = document.querySelector('.dkd-v24-theme-backdrop');
    if (dkdV25IsSimpleMode() || document.querySelector('.dkd-v25-modern-to-simple') || dkdV25Visible(dkdChooser)) return;
    const dkdPage = dkdV25Normalize(document.body?.innerText);
    if (!dkdPage.includes('guvenlik merkezi') || !dkdPage.includes('kurye kuyrugu') || !dkdPage.includes('cikis yap')) return;
    const dkdExit = dkdV25FindExactAction(/^cikis yap$/);
    if (!dkdExit?.parentElement) return;
    const dkdButton = document.createElement('button');
    dkdButton.type = 'button';
    dkdButton.className = 'dkd-v25-modern-to-simple';
    dkdButton.innerHTML = '<span aria-hidden="true">⚡</span><strong>Sade Temaya Geç</strong><small>Yalnızca kurye eşleştirme ekranını aç</small>';
    dkdButton.addEventListener('click', () => {
      sessionStorage.setItem(DKD_V25_THEME_KEY, 'simple');
      sessionStorage.setItem(DKD_V25_FORCE_KEY, 'simple');
      location.assign(DKD_V25_SIMPLE_PATH);
    });
    dkdExit.parentElement.insertBefore(dkdButton, dkdExit);
  }

  function dkdV25SourceAction(dkdCard) {
    return Array.from(dkdCard?.querySelectorAll?.('button,a,[role="button"],input[type="submit"]') || [])
      .find((dkdElement) => {
        const dkdLabel = dkdV25Normalize(dkdV25Text(dkdElement) || dkdElement.value);
        return /(kodu eslestir|kod eslestir|eslestir|eslestirme|kodu gir|kod gir|dogrula|gecisi onayla|onayla)/.test(dkdLabel);
      }) || null;
  }

  function dkdV25CardFromAction(dkdAction) {
    let dkdCurrent = dkdAction;
    let dkdFallback = null;
    for (let dkdDepth = 0; dkdDepth < 10 && dkdCurrent && dkdCurrent !== document.body; dkdDepth += 1) {
      if (dkdCurrent.closest('.dkd-v24-simple-shell,.dkd-v24-theme-backdrop,.dkd-v25-simple-list')) return null;
      if (dkdCurrent.matches('nav,aside')) return null;
      const dkdContent = dkdV25Normalize(dkdV25Text(dkdCurrent));
      const dkdLength = dkdContent.length;
      const dkdHasCourier = /(kurye|plaka|siparis|platform|gecis|musteri|kapida|bekliyor)/.test(dkdContent);
      if (dkdHasCourier && dkdLength >= 24 && dkdLength <= 3200) {
        dkdFallback = dkdCurrent;
        if (dkdCurrent.matches('article,li,[class*="card"],[class*="item"],[class*="pass"],[class*="request"]')) return dkdCurrent;
      }
      dkdCurrent = dkdCurrent.parentElement;
    }
    return dkdFallback;
  }

  function dkdV25SourceCards() {
    const dkdCards = [];
    const dkdSeen = new Set();
    const dkdActions = Array.from(document.querySelectorAll('button,a,[role="button"],input[type="submit"]'))
      .filter((dkdElement) => {
        if (dkdElement.closest('.dkd-v24-simple-shell,.dkd-v24-theme-backdrop,.dkd-v25-simple-list')) return false;
        const dkdLabel = dkdV25Normalize(dkdV25Text(dkdElement) || dkdElement.value);
        return /(kodu eslestir|kod eslestir|eslestir|eslestirme|kodu gir|kod gir|dogrula|gecisi onayla|incele)/.test(dkdLabel);
      });
    dkdActions.forEach((dkdAction) => {
      const dkdCard = dkdV25CardFromAction(dkdAction);
      if (dkdCard && !dkdSeen.has(dkdCard)) {
        dkdSeen.add(dkdCard);
        dkdCards.push(dkdCard);
      }
    });

    if (!dkdCards.length) {
      const dkdCandidates = Array.from(document.querySelectorAll('article,li,tr,section,div,[class*=\"row\"]'))
        .filter((dkdElement) => {
          if (dkdElement.closest('.dkd-v24-simple-shell,.dkd-v24-theme-backdrop,.dkd-v25-simple-list,nav,aside')) return false;
          const dkdContent = dkdV25Normalize(dkdV25Text(dkdElement));
          if (dkdContent.length < 45 || dkdContent.length > 2400) return false;
          if (/^(kurye kuyrugu|guvenlik merkezi)$/.test(dkdContent) || dkdContent.includes('premium menu')) return false;
          const dkdHints = ['kurye', 'plaka', 'siparis', 'platform', 'gecis', 'musteri', 'kapida', 'bekliyor'];
          const dkdScore = dkdHints.filter((dkdHint) => dkdContent.includes(dkdHint)).length;
          return dkdScore >= 1 && dkdContent.includes('kurye') && Boolean(dkdElement.querySelector('button,a,[role="button"],input'));
        })
        .sort((dkdLeft, dkdRight) => dkdV25Text(dkdLeft).length - dkdV25Text(dkdRight).length);
      dkdCandidates.forEach((dkdCandidate) => {
        if (dkdCards.some((dkdCard) => dkdCard.contains(dkdCandidate) || dkdCandidate.contains(dkdCard))) return;
        dkdCards.push(dkdCandidate);
      });
    }
    return dkdCards;
  }

  function dkdV25OpenQueuePage() {
    if (!dkdV25IsSimpleMode() || Date.now() - DKD_V25_STATE.queueOpenedAt < 1800) return;
    DKD_V25_STATE.queueOpenedAt = Date.now();
    const dkdActions = Array.from(document.querySelectorAll('button,a,[role="button"]'))
      .filter((dkdElement) => !dkdElement.closest('.dkd-v24-simple-shell,.dkd-v24-theme-backdrop,.dkd-v25-simple-list'));
    const dkdTarget = dkdActions.find((dkdElement) => /^kurye kuyrugu$/.test(dkdV25Normalize(dkdV25Text(dkdElement))))
      || dkdActions.find((dkdElement) => /gecis talepleri/.test(dkdV25Normalize(dkdV25Text(dkdElement))))
      || dkdActions.find((dkdElement) => /^guvenlik merkezi$/.test(dkdV25Normalize(dkdV25Text(dkdElement))));
    if (dkdTarget) {
      dkdTarget.click();
      setTimeout(dkdV25QueuePatch, 180);
      setTimeout(dkdV25QueuePatch, 650);
    }
  }

  function dkdV25SimpleShell() {
    const dkdDirect = document.querySelector('.dkd-v24-simple-shell');
    if (dkdDirect) return dkdDirect;
    const dkdHeading = Array.from(document.querySelectorAll('h1,h2,h3,strong'))
      .find((dkdElement) => dkdV25Normalize(dkdV25Text(dkdElement)) === 'gelen kuryeler');
    return dkdHeading?.closest('main,section,div') || null;
  }

  function dkdV25FindInfoCard(dkdShell) {
    const dkdLabel = Array.from(dkdShell.querySelectorAll('h1,h2,h3,strong,span,p'))
      .find((dkdElement) => dkdV25Normalize(dkdV25Text(dkdElement)) === 'guvenli eslestirme');
    let dkdCurrent = dkdLabel;
    for (let dkdDepth = 0; dkdDepth < 6 && dkdCurrent && dkdCurrent !== dkdShell; dkdDepth += 1) {
      const dkdContent = dkdV25Normalize(dkdV25Text(dkdCurrent));
      if (dkdContent.includes('guvenli eslestirme') && dkdContent.length < 700) return dkdCurrent;
      dkdCurrent = dkdCurrent.parentElement;
    }
    return null;
  }

  function dkdV25EnsureSimpleList(dkdShell) {
    let dkdList = dkdShell.querySelector('.dkd-v25-simple-list');
    if (dkdList) return dkdList;
    dkdList = document.createElement('div');
    dkdList.className = 'dkd-v25-simple-list';
    dkdList.setAttribute('aria-live', 'polite');
    const dkdInfo = dkdV25FindInfoCard(dkdShell);
    if (dkdInfo?.parentElement) dkdInfo.parentElement.insertBefore(dkdList, dkdInfo);
    else dkdShell.appendChild(dkdList);
    return dkdList;
  }

  function dkdV25Lines(dkdCard) {
    const dkdIgnored = /(kodu eslestir|kod eslestir|eslestir|dogrula|onayla|reddet|detay|yenile)/;
    const dkdUnique = [];
    String(dkdCard?.innerText || '')
      .split(/\n+/)
      .map((dkdLine) => dkdLine.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .forEach((dkdLine) => {
        const dkdNormalized = dkdV25Normalize(dkdLine);
        if (!dkdNormalized || dkdIgnored.test(dkdNormalized)) return;
        if (!dkdUnique.some((dkdItem) => dkdV25Normalize(dkdItem) === dkdNormalized)) dkdUnique.push(dkdLine);
      });
    return dkdUnique.slice(0, 14);
  }

  function dkdV25CardId(dkdCard, dkdIndex) {
    const dkdSource = dkdV25Normalize(dkdV25Text(dkdCard)).slice(0, 500);
    let dkdHash = 0;
    for (let dkdIndexValue = 0; dkdIndexValue < dkdSource.length; dkdIndexValue += 1) {
      dkdHash = ((dkdHash << 5) - dkdHash + dkdSource.charCodeAt(dkdIndexValue)) | 0;
    }
    return `dkd_v25_${Math.abs(dkdHash)}_${dkdIndex}`;
  }

  function dkdV25NativeValue(dkdInput, dkdValue) {
    const dkdSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    if (dkdSetter) dkdSetter.call(dkdInput, dkdValue);
    else dkdInput.value = dkdValue;
    dkdInput.dispatchEvent(new Event('input', { bubbles: true }));
    dkdInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function dkdV25NativeCodeInput(dkdScope) {
    const dkdInputs = Array.from((dkdScope || document).querySelectorAll('input'))
      .filter((dkdInput) => !dkdInput.closest('.dkd-v24-simple-shell,.dkd-v25-simple-list'));
    return dkdInputs.find((dkdInput) => {
      const dkdHint = dkdV25Normalize(`${dkdInput.placeholder || ''} ${dkdInput.getAttribute('aria-label') || ''}`);
      return dkdInput.maxLength === 6 || /(6 haneli|eslestirme kodu|gecis kodu|kod)/.test(dkdHint);
    }) || null;
  }

  async function dkdV25WaitForNativeInput(dkdScope) {
    for (let dkdTry = 0; dkdTry < 24; dkdTry += 1) {
      const dkdInput = dkdV25NativeCodeInput(dkdScope) || dkdV25NativeCodeInput(document);
      if (dkdInput) return dkdInput;
      await new Promise((dkdResolve) => setTimeout(dkdResolve, 100));
    }
    return null;
  }

  function dkdV25ConfirmAction(dkdSourceCard, dkdOriginalAction) {
    const dkdScope = document.querySelector('[role="dialog"],dialog,[class*="modal"],[class*="dialog"]') || dkdSourceCard || document;
    const dkdActions = Array.from(dkdScope.querySelectorAll('button,a,[role="button"],input[type="submit"]'))
      .filter((dkdElement) => !dkdElement.closest('.dkd-v24-simple-shell,.dkd-v25-simple-list'));
    return dkdActions.find((dkdElement) => {
      if (dkdElement === dkdOriginalAction) return false;
      return /^(eslestir|kodu eslestir|dogrula|onayla|tamamla)$/.test(dkdV25Normalize(dkdV25Text(dkdElement) || dkdElement.value));
    }) || null;
  }

  async function dkdV25SubmitMatch(dkdSourceCard, dkdCode, dkdButton) {
    const dkdCleanCode = String(dkdCode || '').replace(/\D/g, '').slice(0, 6);
    const dkdMessage = dkdButton.closest('.dkd-v25-courier-card')?.querySelector('.dkd-v25-match-message');
    if (dkdCleanCode.length !== 6) {
      if (dkdMessage) dkdMessage.textContent = 'Lütfen 6 haneli eşleştirme kodunu girin.';
      return;
    }
    dkdButton.disabled = true;
    dkdButton.classList.add('dkd-v25-loading');
    if (dkdMessage) dkdMessage.textContent = 'Kurye eşleştirme ekranı doğrulanıyor…';

    try {
      let dkdNativeInput = dkdV25NativeCodeInput(dkdSourceCard);
      const dkdOriginalAction = dkdV25SourceAction(dkdSourceCard);
      if (!dkdNativeInput && dkdOriginalAction) dkdOriginalAction.click();
      dkdNativeInput = dkdNativeInput || await dkdV25WaitForNativeInput(dkdSourceCard);
      if (!dkdNativeInput) throw new Error('Kod alanı bulunamadı. Kurye Kuyruğu yenileniyor.');
      dkdV25NativeValue(dkdNativeInput, dkdCleanCode);
      const dkdConfirm = dkdV25ConfirmAction(dkdSourceCard, dkdOriginalAction) || dkdOriginalAction;
      if (!dkdConfirm) throw new Error('Eşleştirme düğmesi bulunamadı.');
      dkdConfirm.click();
      if (dkdMessage) dkdMessage.textContent = 'Kod gönderildi. Sonuç güvenlik kayıtlarından doğrulanıyor.';
      setTimeout(dkdV25QueuePatch, 300);
      setTimeout(dkdV25QueuePatch, 1200);
    } catch (dkdError) {
      if (dkdMessage) dkdMessage.textContent = String(dkdError?.message || dkdError);
      dkdV25OpenQueuePage();
    } finally {
      setTimeout(() => {
        dkdButton.disabled = false;
        dkdButton.classList.remove('dkd-v25-loading');
      }, 900);
    }
  }

  function dkdV25BuildCard(dkdSourceCard, dkdIndex) {
    const dkdLines = dkdV25Lines(dkdSourceCard);
    const dkdTitle = dkdLines.find((dkdLine) => !/(bekliyor|kurye talebi|gecis talebi|kod hazir)/i.test(dkdLine)) || `Gelen Kurye ${dkdIndex + 1}`;
    const dkdCard = document.createElement('article');
    dkdCard.className = 'dkd-v25-courier-card';
    dkdCard.dataset.dkdSourceId = dkdV25CardId(dkdSourceCard, dkdIndex);
    const dkdDetailLines = dkdLines.filter((dkdLine) => dkdLine !== dkdTitle).slice(0, 10);
    dkdCard.innerHTML = `
      <div class="dkd-v25-card-top">
        <div class="dkd-v25-card-icon">K</div>
        <div class="dkd-v25-card-copy"><span>CANLI GEÇİŞ TALEBİ</span><h3>${dkdTitle}</h3></div>
        <b>BEKLİYOR</b>
      </div>
      <div class="dkd-v25-card-details">${dkdDetailLines.map((dkdLine) => `<p>${dkdLine}</p>`).join('')}</div>
      <label class="dkd-v25-code-label">6 HANELİ EŞLEŞTİRME KODU</label>
      <div class="dkd-v25-code-row">
        <input type="tel" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" aria-label="6 haneli eşleştirme kodu">
        <button type="button" class="dkd-v25-match-button">Kodu Eşleştir</button>
      </div>
      <div class="dkd-v25-match-message" aria-live="polite">Kurye bilgilerini kontrol edip kodu girin.</div>
    `;
    const dkdInput = dkdCard.querySelector('input');
    dkdInput.addEventListener('input', () => {
      const dkdClean = dkdInput.value.replace(/\D/g, '').slice(0, 6);
      if (dkdInput.value !== dkdClean) dkdInput.value = dkdClean;
    });
    dkdCard.querySelector('.dkd-v25-match-button').addEventListener('click', (dkdEvent) => {
      void dkdV25SubmitMatch(dkdSourceCard, dkdInput.value, dkdEvent.currentTarget);
    });
    return dkdCard;
  }

  function dkdV25UpdateSimpleMeta(dkdShell, dkdCount) {
    const dkdLeaves = Array.from(dkdShell.querySelectorAll('span,b,strong,p,div'))
      .filter((dkdElement) => !dkdElement.children.length);
    dkdLeaves.forEach((dkdElement) => {
      const dkdValue = dkdV25Normalize(dkdV25Text(dkdElement));
      if (/^\d+ bekleyen$/.test(dkdValue)) dkdElement.textContent = `${dkdCount} bekleyen`;
    });
    const dkdEmptyLabel = Array.from(dkdShell.querySelectorAll('h1,h2,h3,strong,p'))
      .find((dkdElement) => dkdV25Normalize(dkdV25Text(dkdElement)).includes('bekleyen kurye bulunmuyor'));
    let dkdEmptyCard = dkdEmptyLabel;
    for (let dkdDepth = 0; dkdDepth < 6 && dkdEmptyCard && dkdEmptyCard !== dkdShell; dkdDepth += 1) {
      const dkdContent = dkdV25Normalize(dkdV25Text(dkdEmptyCard));
      if (dkdContent.includes('bekleyen kurye bulunmuyor') && dkdContent.length < 900) break;
      dkdEmptyCard = dkdEmptyCard.parentElement;
    }
    dkdEmptyCard?.classList.toggle('dkd-v25-hide-empty', dkdCount > 0);
    document.body.classList.toggle('dkd-v25-has-mirrored-cards', dkdCount > 0);
  }

  function dkdV25RenderSimpleQueue() {
    if (!dkdV25IsSimpleMode()) return;
    const dkdShell = dkdV25SimpleShell();
    if (!dkdShell) return;
    const dkdList = dkdV25EnsureSimpleList(dkdShell);
    const dkdSources = dkdV25SourceCards();
    if (!dkdSources.length) {
      dkdList.replaceChildren();
      dkdV25UpdateSimpleMeta(dkdShell, 0);
      dkdV25OpenQueuePage();
      return;
    }
    const dkdPreviousCodes = new Map(Array.from(dkdList.querySelectorAll('.dkd-v25-courier-card')).map((dkdCard) => [
      dkdCard.dataset.dkdSourceId,
      dkdCard.querySelector('input')?.value || '',
    ]));
    const dkdFragment = document.createDocumentFragment();
    dkdSources.forEach((dkdSource, dkdIndex) => {
      const dkdCard = dkdV25BuildCard(dkdSource, dkdIndex);
      const dkdCode = dkdPreviousCodes.get(dkdCard.dataset.dkdSourceId);
      if (dkdCode) dkdCard.querySelector('input').value = dkdCode;
      dkdFragment.appendChild(dkdCard);
    });
    dkdList.replaceChildren(dkdFragment);
    dkdV25UpdateSimpleMeta(dkdShell, dkdSources.length);
  }

  function dkdV25Patch() {
    DKD_V25_STATE.queued = false;
    dkdV25ReplaceVersions();
    dkdV25FixThemeChooserLayout();
    dkdV25EnsureModernToSimpleSwitch();
    dkdV25RenderSimpleQueue();
  }

  function dkdV25QueuePatch() {
    if (DKD_V25_STATE.queued) return;
    DKD_V25_STATE.queued = true;
    requestAnimationFrame(dkdV25Patch);
  }

  const dkdV25Observer = new MutationObserver(() => {
    clearTimeout(DKD_V25_STATE.renderTimer);
    DKD_V25_STATE.renderTimer = setTimeout(dkdV25QueuePatch, 45);
  });
  dkdV25Observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener('popstate', dkdV25QueuePatch);
  window.addEventListener('hashchange', dkdV25QueuePatch);
  document.addEventListener('click', () => {
    setTimeout(dkdV25QueuePatch, 60);
    setTimeout(dkdV25QueuePatch, 360);
  }, true);
  setInterval(dkdV25QueuePatch, 1100);
  dkdV25QueuePatch();
})();
