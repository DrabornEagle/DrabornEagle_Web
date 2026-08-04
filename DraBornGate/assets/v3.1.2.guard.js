(() => {
  const DKD_V312_VERSION = '3.1.2';
  const DKD_V312_PROJECT_REF = 'guuwomvszlwhkmstewfl';
  const DKD_V312_BRIDGE_KEY = 'dkd_gate_live_session_v312';
  const dkdOriginalFetch = window.fetch.bind(window);
  const dkdOriginalSetItem = Storage.prototype.setItem;
  let dkdBridgeWriting = false;

  function dkdV312Normalize(dkdValue) {
    return String(dkdValue || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function dkdV312DecodeJwt(dkdToken) {
    try {
      const dkdPart = String(dkdToken || '').split('.')[1];
      if (!dkdPart) return null;
      const dkdBase64 = dkdPart.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(dkdPart.length / 4) * 4, '=');
      return JSON.parse(decodeURIComponent(Array.from(atob(dkdBase64), (dkdChar) =>
        `%${dkdChar.charCodeAt(0).toString(16).padStart(2, '0')}`
      ).join('')));
    } catch {
      return null;
    }
  }

  function dkdV312IsProjectToken(dkdToken, dkdAllowExpired = true) {
    if (!/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(String(dkdToken || ''))) return false;
    const dkdPayload = dkdV312DecodeJwt(dkdToken);
    if (!dkdPayload?.sub) return false;
    const dkdIssuer = String(dkdPayload.iss || '');
    const dkdRef = String(dkdPayload.ref || dkdPayload.project_ref || '');
    if (!dkdIssuer.includes(DKD_V312_PROJECT_REF) && dkdRef !== DKD_V312_PROJECT_REF) return false;
    if (!dkdAllowExpired && Number(dkdPayload.exp || 0) <= Math.floor(Date.now() / 1000) + 15) return false;
    return true;
  }

  function dkdV312FindSession(dkdValue, dkdDepth = 0) {
    if (dkdDepth > 8 || dkdValue == null) return null;
    if (typeof dkdValue === 'string') {
      if (dkdV312IsProjectToken(dkdValue)) return { access_token: dkdValue, refresh_token: '' };
      try {
        return dkdV312FindSession(JSON.parse(dkdValue), dkdDepth + 1);
      } catch {
        return null;
      }
    }
    if (Array.isArray(dkdValue)) {
      for (const dkdItem of dkdValue) {
        const dkdSession = dkdV312FindSession(dkdItem, dkdDepth + 1);
        if (dkdSession) return dkdSession;
      }
      return null;
    }
    if (typeof dkdValue === 'object') {
      const dkdAccessToken = dkdValue.access_token || dkdValue.accessToken || dkdValue.token;
      if (dkdV312IsProjectToken(dkdAccessToken)) {
        return {
          access_token: dkdAccessToken,
          refresh_token: typeof (dkdValue.refresh_token || dkdValue.refreshToken) === 'string'
            ? (dkdValue.refresh_token || dkdValue.refreshToken)
            : '',
        };
      }
      for (const dkdKey of ['currentSession', 'session', 'data', 'value', 'auth', 'user']) {
        const dkdSession = dkdV312FindSession(dkdValue[dkdKey], dkdDepth + 1);
        if (dkdSession) return dkdSession;
      }
    }
    return null;
  }

  function dkdV312CaptureSession(dkdValue) {
    const dkdSession = dkdV312FindSession(dkdValue);
    if (!dkdSession?.access_token) return false;
    window.__DKD_GATE_LAST_ACCESS_TOKEN__ = dkdSession.access_token;
    window.__DKD_GATE_LAST_SESSION__ = dkdSession;
    if (!dkdBridgeWriting) {
      try {
        dkdBridgeWriting = true;
        dkdOriginalSetItem.call(sessionStorage, DKD_V312_BRIDGE_KEY, JSON.stringify(dkdSession));
      } catch {
        // Bellek köprüsü kullanılamasa bile pencere değişkeni çalışır.
      } finally {
        dkdBridgeWriting = false;
      }
    }
    window.dispatchEvent(new CustomEvent('dkd-gate-session-ready', { detail: { project_ref: DKD_V312_PROJECT_REF } }));
    return true;
  }

  function dkdV312ScanStores() {
    for (const dkdStore of [localStorage, sessionStorage]) {
      for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
        const dkdKey = dkdStore.key(dkdIndex);
        if (dkdKey === DKD_V312_BRIDGE_KEY) continue;
        try {
          if (dkdV312CaptureSession(dkdStore.getItem(dkdKey))) return true;
        } catch {
          // Bozuk veya erişilemeyen kayıtlar atlanır.
        }
      }
    }
    return false;
  }

  Storage.prototype.setItem = function dkdV312ObservedSetItem(dkdKey, dkdValue) {
    const dkdResult = dkdOriginalSetItem.call(this, dkdKey, dkdValue);
    if (!dkdBridgeWriting && dkdKey !== DKD_V312_BRIDGE_KEY) dkdV312CaptureSession(dkdValue);
    return dkdResult;
  };

  window.fetch = async function dkdV312ObservedFetch(dkdInput, dkdInit = {}) {
    try {
      const dkdRequestHeaders = new Headers(
        dkdInit.headers || (dkdInput instanceof Request ? dkdInput.headers : undefined)
      );
      const dkdAuthorization = dkdRequestHeaders.get('authorization') || '';
      const dkdBearer = dkdAuthorization.match(/^Bearer\s+(.+)$/i)?.[1] || '';
      if (dkdBearer) dkdV312CaptureSession({ access_token: dkdBearer });
    } catch {
      // Header okunamazsa gerçek istek yine devam eder.
    }

    const dkdResponse = await dkdOriginalFetch(dkdInput, dkdInit);
    try {
      const dkdUrl = typeof dkdInput === 'string' || dkdInput instanceof URL
        ? String(dkdInput)
        : String(dkdInput?.url || '');
      if (dkdUrl.includes(DKD_V312_PROJECT_REF) && /\/auth\/v1\/(?:token|verify|user)/.test(dkdUrl)) {
        dkdResponse.clone().json().then(dkdV312CaptureSession).catch(() => undefined);
      }
    } catch {
      // Yanıt kopyası oturum içermiyorsa sessizce atlanır.
    }
    return dkdResponse;
  };

  function dkdV312PatchTextNode(dkdNode) {
    const dkdText = String(dkdNode?.nodeValue || '');
    if (!dkdText) return;
    const dkdNormalized = dkdV312Normalize(dkdText);
    let dkdNext = dkdText;
    if (dkdText.trim() === 'DG') dkdNext = 'DBG';
    if (/(draborngate|guvenlik sade tema|web)/.test(dkdNormalized)) {
      dkdNext = dkdNext.replace(/\bv(?:2(?:\.\d+) {0}|2(?:\.\d+){1,2}|3(?:\.\d+){0,2})\b/gi, `v${DKD_V312_VERSION}`);
      dkdNext = dkdNext.replace(/\bWEB\s+V3\b/gi, `WEB v${DKD_V312_VERSION}`);
    }
    if (dkdNext !== dkdText) dkdNode.nodeValue = dkdNext;
  }

  function dkdV312PatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) {
      dkdV312PatchTextNode(dkdRoot);
      return;
    }
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdV312PatchTextNode(dkdWalker.currentNode);
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_V312_VERSION;
  window.__DKD_GATE_V312_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_V312_VERSION);
  document.documentElement.classList.add('dkd-version-lock');
  dkdV312ScanStores();
  dkdV312PatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdV312PatchTextNode(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdV312PatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  window.addEventListener('storage', () => dkdV312ScanStores());
  window.dkdV312CaptureSession = dkdV312CaptureSession;
  window.dkdV312ScanStores = dkdV312ScanStores;
})();
