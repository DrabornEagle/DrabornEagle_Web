(() => {
  const DKD_VERSION = '3.1.2';
  const DKD_PROJECT_REF = 'guuwomvszlwhkmstewfl';
  const DKD_BRIDGE_KEY = 'dkd_gate_live_session_v312';
  const dkdFetch = window.fetch.bind(window);
  const dkdSetItem = Storage.prototype.setItem;
  let dkdWriting = false;

  function dkdDecodeJwt(dkdToken) {
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

  function dkdIsProjectToken(dkdToken) {
    if (!/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(String(dkdToken || ''))) return false;
    const dkdPayload = dkdDecodeJwt(dkdToken);
    if (!dkdPayload?.sub) return false;
    const dkdIssuer = String(dkdPayload.iss || '');
    const dkdRef = String(dkdPayload.ref || dkdPayload.project_ref || '');
    return dkdIssuer.includes(DKD_PROJECT_REF) || dkdRef === DKD_PROJECT_REF;
  }

  function dkdFindSession(dkdValue, dkdDepth = 0) {
    if (dkdDepth > 8 || dkdValue == null) return null;
    if (typeof dkdValue === 'string') {
      if (dkdIsProjectToken(dkdValue)) return { access_token: dkdValue, refresh_token: '' };
      try {
        return dkdFindSession(JSON.parse(dkdValue), dkdDepth + 1);
      } catch {
        return null;
      }
    }
    if (Array.isArray(dkdValue)) {
      for (const dkdItem of dkdValue) {
        const dkdSession = dkdFindSession(dkdItem, dkdDepth + 1);
        if (dkdSession) return dkdSession;
      }
      return null;
    }
    if (typeof dkdValue === 'object') {
      const dkdAccessToken = dkdValue.access_token || dkdValue.accessToken || dkdValue.token;
      if (dkdIsProjectToken(dkdAccessToken)) {
        return {
          access_token: dkdAccessToken,
          refresh_token: typeof (dkdValue.refresh_token || dkdValue.refreshToken) === 'string'
            ? (dkdValue.refresh_token || dkdValue.refreshToken)
            : '',
        };
      }
      for (const dkdKey of ['currentSession', 'session', 'data', 'value', 'auth', 'user']) {
        const dkdSession = dkdFindSession(dkdValue[dkdKey], dkdDepth + 1);
        if (dkdSession) return dkdSession;
      }
    }
    return null;
  }

  function dkdCaptureSession(dkdValue) {
    const dkdSession = dkdFindSession(dkdValue);
    if (!dkdSession?.access_token) return false;
    const dkdPrevious = dkdFindSession(sessionStorage.getItem(DKD_BRIDGE_KEY));
    const dkdMerged = {
      access_token: dkdSession.access_token,
      refresh_token: dkdSession.refresh_token || dkdPrevious?.refresh_token || '',
    };
    window.__DKD_GATE_LAST_ACCESS_TOKEN__ = dkdMerged.access_token;
    window.__DKD_GATE_LAST_SESSION__ = dkdMerged;
    if (!dkdWriting) {
      try {
        dkdWriting = true;
        dkdSetItem.call(sessionStorage, DKD_BRIDGE_KEY, JSON.stringify(dkdMerged));
      } catch {
        // Pencere belleğindeki oturum kullanılmaya devam eder.
      } finally {
        dkdWriting = false;
      }
    }
    window.dispatchEvent(new CustomEvent('dkd-gate-session-ready'));
    return true;
  }

  function dkdScanStores() {
    for (const dkdStore of [localStorage, sessionStorage]) {
      for (let dkdIndex = 0; dkdIndex < dkdStore.length; dkdIndex += 1) {
        const dkdKey = dkdStore.key(dkdIndex);
        if (dkdKey === DKD_BRIDGE_KEY) continue;
        try {
          if (dkdCaptureSession(dkdStore.getItem(dkdKey))) return true;
        } catch {
          // Bozuk kayıt atlanır.
        }
      }
    }
    return false;
  }

  Storage.prototype.setItem = function dkdObservedSetItem(dkdKey, dkdValue) {
    const dkdResult = dkdSetItem.call(this, dkdKey, dkdValue);
    if (!dkdWriting && dkdKey !== DKD_BRIDGE_KEY) dkdCaptureSession(dkdValue);
    return dkdResult;
  };

  window.fetch = async function dkdObservedFetch(dkdInput, dkdInit = {}) {
    try {
      const dkdHeaders = new Headers(dkdInit.headers || (dkdInput instanceof Request ? dkdInput.headers : undefined));
      const dkdBearer = (dkdHeaders.get('authorization') || '').match(/^Bearer\s+(.+)$/i)?.[1];
      if (dkdBearer) dkdCaptureSession({ access_token: dkdBearer });
    } catch {
      // Gerçek istek engellenmez.
    }
    const dkdResponse = await dkdFetch(dkdInput, dkdInit);
    try {
      const dkdUrl = typeof dkdInput === 'string' || dkdInput instanceof URL
        ? String(dkdInput)
        : String(dkdInput?.url || '');
      if (dkdUrl.includes(DKD_PROJECT_REF) && /\/auth\/v1\/(?:token|verify|user)/.test(dkdUrl)) {
        dkdResponse.clone().json().then(dkdCaptureSession).catch(() => undefined);
      }
    } catch {
      // Oturum içermeyen yanıt atlanır.
    }
    return dkdResponse;
  };

  function dkdPatchText(dkdNode) {
    const dkdText = String(dkdNode?.nodeValue || '');
    if (!dkdText) return;
    const dkdContext = String(dkdNode.parentElement?.textContent || dkdText)
      .toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
    let dkdNext = dkdText.trim() === 'DG' ? 'DBG' : dkdText;
    if (/draborngate|guvenlik sade tema|\bweb\b/.test(dkdContext)) {
      dkdNext = dkdNext.replace(/\bv(?:2(?:\.\d+){1,2}|3(?:\.\d+){0,2})\b/gi, `v${DKD_VERSION}`);
      dkdNext = dkdNext.replace(/\bWEB\s+V3\b/gi, `WEB v${DKD_VERSION}`);
    }
    if (dkdNext !== dkdText) dkdNode.nodeValue = dkdNext;
  }

  function dkdPatchRoot(dkdRoot) {
    if (!dkdRoot) return;
    if (dkdRoot.nodeType === Node.TEXT_NODE) return dkdPatchText(dkdRoot);
    if (!(dkdRoot instanceof Element || dkdRoot instanceof Document || dkdRoot instanceof DocumentFragment)) return;
    const dkdWalker = document.createTreeWalker(dkdRoot, NodeFilter.SHOW_TEXT);
    while (dkdWalker.nextNode()) dkdPatchText(dkdWalker.currentNode);
  }

  window.__DKD_GATE_WEB_VERSION__ = DKD_VERSION;
  window.__DKD_GATE_V312_ACTIVE__ = true;
  sessionStorage.setItem('dkd_gate_web_version', DKD_VERSION);
  document.documentElement.classList.add('dkd-version-lock');
  dkdScanStores();
  dkdPatchRoot(document.documentElement);

  new MutationObserver((dkdMutations) => {
    for (const dkdMutation of dkdMutations) {
      if (dkdMutation.type === 'characterData') dkdPatchText(dkdMutation.target);
      for (const dkdNode of dkdMutation.addedNodes) dkdPatchRoot(dkdNode);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  window.addEventListener('storage', dkdScanStores);
  window.dkdV312CaptureSession = dkdCaptureSession;
  window.dkdV312ScanStores = dkdScanStores;
})();
