const DKD_V301_VERSION = '3.0.1';
const dkdV301State = {
  sources: [],
  selectedId: '',
  signature: '',
  candidateSignature: '',
  candidateHits: 0,
  emptyHits: 0,
  initialized: false,
  feedback: null,
  busy: false,
  lastSync: new Date(),
  routeAt: { finder: 0, queue: 0 },
  refreshing: false,
};

function dkdV301Normalize(dkdValue) {
  return String(dkdValue || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function dkdV301Escape(dkdValue) {
  return String(dkdValue || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function dkdV301Hash(dkdValue) {
  let dkdHash = 2166136261;
  for (const dkdChar of String(dkdValue || '')) {
    dkdHash ^= dkdChar.charCodeAt(0);
    dkdHash = Math.imul(dkdHash, 16777619);
  }
  return `dkd-v301-${(dkdHash >>> 0).toString(36)}`;
}

function dkdV301IsSimple() {
  return dkdV301Normalize(location.pathname).includes('guvenlik sade tema') ||
    sessionStorage.getItem('dkd_gate_security_theme') === 'simple' ||
    sessionStorage.getItem('dkd_gate_force_theme') === 'simple';
}

function dkdV301NativeElements(dkdSelector) {
  return [...document.querySelectorAll(dkdSelector)]
    .filter((dkdElement) => !dkdElement.closest('#dkd-v30-root,#dkd-v28-root'));
}

function dkdV301ClickNativeView(dkdKind, dkdForce = false) {
  const dkdNow = Date.now();
  if (!dkdForce && dkdNow - dkdV301State.routeAt[dkdKind] < 2200) return false;
  dkdV301State.routeAt[dkdKind] = dkdNow;

  const dkdNeedles = dkdKind === 'finder'
    ? ['kurye kodu dogrula', 'kuryeni bul', '6 haneli kurye kodu', 'kodu dogrula', 'kurye kodu']
    : ['canli kurye kuyrugu', 'kurye kuyrugu', 'kapida bekleyenler', 'gecis talepleri', 'bekleyen kuryeler'];

  const dkdTargets = dkdV301NativeElements('button,a,[role="button"]')
    .filter((dkdElement) => !dkdElement.disabled);

  for (const dkdNeedle of dkdNeedles) {
    const dkdExact = dkdTargets.find((dkdElement) =>
      dkdV301Normalize([dkdElement.textContent, dkdElement.getAttribute('aria-label'), dkdElement.title].join(' ')) === dkdNeedle
    );
    const dkdTarget = dkdExact || dkdTargets.find((dkdElement) =>
      dkdV301Normalize([dkdElement.textContent, dkdElement.getAttribute('aria-label'), dkdElement.title].join(' ')).includes(dkdNeedle)
    );
    if (dkdTarget) {
      dkdTarget.click();
      return true;
    }
  }
  return false;
}

function dkdV301IsCodeInput(dkdInput) {
  if (!(dkdInput instanceof HTMLInputElement) || dkdInput.closest('#dkd-v30-root,#dkd-v28-root')) return false;
  if (dkdInput.disabled || dkdInput.type === 'hidden') return false;
  const dkdType = String(dkdInput.type || 'text').toLowerCase();
  if (!['text', 'tel', 'number', 'password'].includes(dkdType)) return false;
  const dkdClue = dkdV301Normalize([
    dkdInput.placeholder,
    dkdInput.getAttribute('aria-label'),
    dkdInput.name,
    dkdInput.id,
    dkdInput.parentElement?.textContent?.slice(0, 420),
  ].join(' '));
  const dkdSix = dkdInput.maxLength === 6 || dkdInput.getAttribute('maxlength') === '6';
  return dkdSix || (dkdClue.includes('kod') && /kurye|eslestirme|6 haneli/.test(dkdClue));
}

function dkdV301IsVerifyButton(dkdButton) {
  if (!dkdButton || dkdButton.closest('#dkd-v30-root,#dkd-v28-root')) return false;
  const dkdText = dkdV301Normalize([
    dkdButton.textContent,
    dkdButton.value,
    dkdButton.getAttribute('aria-label'),
    dkdButton.title,
  ].join(' '));
  return /kodu eslestir|kodu dogrula|kuryeni bul|eslestir|dogrula|onayla/.test(dkdText);
}

function dkdV301FindBridge() {
  const dkdBridges = [];
  for (const dkdInput of dkdV301NativeElements('input').filter(dkdV301IsCodeInput)) {
    let dkdNode = dkdInput.closest('form,dialog,[role="dialog"]') || dkdInput.parentElement;
    let dkdBest = null;
    for (let dkdDepth = 0; dkdNode && dkdDepth < 12; dkdDepth += 1, dkdNode = dkdNode.parentElement) {
      if (dkdNode.closest('#dkd-v30-root,#dkd-v28-root')) break;
      const dkdButton = [...dkdNode.querySelectorAll('button,[role="button"],input[type="submit"]')]
        .find(dkdV301IsVerifyButton);
      if (!dkdButton) continue;
      const dkdClue = dkdV301Normalize([
        dkdInput.placeholder,
        dkdInput.getAttribute('aria-label'),
        dkdNode.textContent?.slice(0, 900),
      ].join(' '));
      const dkdScore = String(dkdNode.textContent || '').length -
        (dkdClue.includes('kurye') ? 900 : 0) -
        (dkdInput.maxLength === 6 ? 500 : 0);
      if (!dkdBest || dkdScore < dkdBest.score) dkdBest = { input: dkdInput, button: dkdButton, container: dkdNode, score: dkdScore };
      if (dkdScore < 200) break;
    }
    if (dkdBest) dkdBridges.push(dkdBest);
  }
  return dkdBridges.sort((dkdA, dkdB) => dkdA.score - dkdB.score)[0] || null;
}

async function dkdV301EnsureBridge() {
  let dkdBridge = dkdV301FindBridge();
  if (dkdBridge) return dkdBridge;
  dkdV301ClickNativeView('finder', true);
  for (let dkdAttempt = 0; dkdAttempt < 28; dkdAttempt += 1) {
    await new Promise((dkdResolve) => setTimeout(dkdResolve, 100));
    dkdBridge = dkdV301FindBridge();
    if (dkdBridge) return dkdBridge;
  }
  return null;
}

function dkdV301Clean(dkdValue, dkdLabel = '') {
  let dkdText = String(dkdValue || '').replace(/\s+/g, ' ').trim();
  if (!dkdLabel) return dkdText;
  const dkdEscaped = dkdLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return dkdText.replace(new RegExp(`^${dkdEscaped}\\s*[:\\-]?\\s*`, 'i'), '').trim();
}

function dkdV301Read(dkdContainer, dkdLabels, dkdMax = 360) {
  if (!dkdContainer) return '';
  for (const dkdElement of dkdContainer.querySelectorAll('dt,dd,label,strong,b,span,p,div,li,td,th')) {
    if (dkdElement.closest('#dkd-v30-root,#dkd-v28-root')) continue;
    const dkdText = dkdV301Clean(dkdElement.textContent);
    if (!dkdText || dkdText.length > dkdMax + 140) continue;
    const dkdNormalized = dkdV301Normalize(dkdText);
    for (const dkdLabel of dkdLabels) {
      const dkdKey = dkdV301Normalize(dkdLabel);
      if (dkdNormalized !== dkdKey && !dkdNormalized.startsWith(`${dkdKey} `)) continue;
      const dkdInline = dkdV301Clean(dkdText, dkdLabel);
      if (dkdInline && dkdInline !== dkdText && dkdInline.length <= dkdMax) return dkdInline;
      const dkdSibling = dkdV301Clean(dkdElement.nextElementSibling?.textContent);
      if (dkdSibling && dkdSibling.length <= dkdMax && dkdV301Normalize(dkdSibling) !== dkdKey) return dkdSibling;
    }
  }

  const dkdLines = String(dkdContainer.innerText || dkdContainer.textContent || '')
    .split(/\n+/).map((dkdLine) => dkdV301Clean(dkdLine)).filter(Boolean);
  for (let dkdIndex = 0; dkdIndex < dkdLines.length; dkdIndex += 1) {
    for (const dkdLabel of dkdLabels) {
      const dkdKey = dkdV301Normalize(dkdLabel);
      const dkdNormalizedLine = dkdV301Normalize(dkdLines[dkdIndex]);
      if (dkdNormalizedLine !== dkdKey && !dkdNormalizedLine.startsWith(`${dkdKey} `)) continue;
      const dkdInline = dkdV301Clean(dkdLines[dkdIndex], dkdLabel);
      if (dkdInline && dkdInline !== dkdLines[dkdIndex] && dkdInline.length <= dkdMax) return dkdInline;
      if (dkdLines[dkdIndex + 1]?.length <= dkdMax) return dkdLines[dkdIndex + 1];
    }
  }
  return '';
}

function dkdV301Details(dkdContainer, dkdIndex) {
  const dkdText = String(dkdContainer?.innerText || dkdContainer?.textContent || '');
  const dkdRead = (dkdLabels, dkdMax) => dkdV301Read(dkdContainer, dkdLabels, dkdMax);
  const dkdSite = dkdRead(['Site', 'Site Adı', 'Yerleşke', 'Proje'], 140);
  const dkdBlock = dkdRead(['Blok', 'Bina'], 70);
  const dkdApartment = dkdRead(['Daire', 'Daire No', 'Kapı No'], 70);
  const dkdAddress = [dkdSite, dkdBlock && `${dkdBlock} Blok`, dkdApartment && `Daire ${dkdApartment}`].filter(Boolean).join(' · ');
  return {
    courier: dkdRead(['Kurye', 'Kurye Adı', 'Kurye Ad Soyad', 'Ad Soyad', 'Adı Soyadı', 'Sürücü', 'Sürücü Adı'], 110) || `Kurye ${String(dkdIndex + 1).padStart(2, '0')}`,
    phone: dkdRead(['Telefon', 'Kurye Telefonu', 'Telefon Numarası', 'Cep Telefonu'], 50) || dkdText.match(/(?:\+?90\s*)?(?:0?5\d{2})[\s.-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}/)?.[0] || 'Telefon bilgisi bekleniyor',
    company: dkdRead(['Firma', 'Platform', 'Kurye Firması', 'Kargo Firması', 'Hizmet', 'Şirket'], 120) || 'Platform bilgisi bekleniyor',
    vehicle: dkdRead(['Araç', 'Araç Tipi', 'Motosiklet', 'Motor', 'Model'], 120) || 'Motosiklet',
    plate: dkdRead(['Plaka', 'Araç Plakası'], 50) || dkdText.toUpperCase().match(/\b\d{2}\s?[A-ZÇĞİÖŞÜ]{1,3}\s?\d{2,4}\b/)?.[0] || 'Plaka bilgisi bekleniyor',
    origin: dkdRead(['Nereden Geliyor', 'Nereden', 'Çıkış Noktası', 'Çıkış Adresi', 'Gönderici Adresi', 'Gönderici', 'Alınacak Adres', 'Teslim Alma Adresi', 'İşletme Adresi', 'İşletme', 'Mağaza', 'Restoran'], 420) || 'Çıkış noktası senkronize ediliyor',
    destination: dkdRead(['Gideceği Tam Adres', 'Gideceği Adres', 'Nereye Gidecek', 'Nereye', 'Hedef Adres', 'Teslimat Adresi', 'Teslim Edilecek Adres', 'Alıcı Adresi', 'Tam Adres', 'Adres'], 460) || dkdAddress || 'Hedef adres senkronize ediliyor',
    site: dkdSite || 'Site bilgisi bekleniyor',
    block: dkdBlock || '—',
    apartment: dkdApartment || '—',
    resident: dkdRead(['Site Sakini', 'Alıcı', 'Teslim Alacak', 'Teslim Alacak Kişi', 'Daire Sakini', 'Müşteri'], 120) || 'Alıcı bilgisi bekleniyor',
    order: dkdRead(['Sipariş No', 'Sipariş Numarası', 'Takip No', 'Gönderi No', 'Talep No', 'Kayıt No'], 120) || 'Kayıt numarası bekleniyor',
    arrival: dkdRead(['Varış', 'Tahmini Varış', 'Kapıya Geliş', 'Geliş Saati', 'Oluşturulma', 'Talep Saati'], 120) || 'Şimdi',
    distance: dkdRead(['Mesafe', 'Uzaklık'], 70) || '—',
    status: dkdRead(['Durum', 'Kurye Durumu', 'Geçiş Durumu'], 100) || 'Kapıda bekliyor',
    note: dkdRead(['Not', 'Açıklama', 'Teslimat Notu', 'Güvenlik Notu', 'Kurye Notu'], 460) || 'Ek teslimat notu bulunmuyor',
  };
}

function dkdV301CardScore(dkdElement) {
  const dkdText = dkdV301Normalize(dkdElement.textContent);
  if (dkdText.length < 28 || dkdText.length > 2600) return 0;
  let dkdScore = 0;
  for (const dkdSignal of ['kurye', 'courier', 'surucu', 'plaka', 'telefon', 'motosiklet', 'firma', 'platform']) {
    if (dkdText.includes(dkdSignal)) dkdScore += 1;
  }
  for (const dkdSignal of ['adres', 'blok', 'daire', 'site', 'nereden', 'nereye', 'hedef', 'teslimat']) {
    if (dkdText.includes(dkdSignal)) dkdScore += 1;
  }
  for (const dkdSignal of ['bekliyor', 'kapida', 'gecis', 'talep', 'siparis', 'aktif']) {
    if (dkdText.includes(dkdSignal)) dkdScore += 1;
  }
  if ([...dkdElement.attributes].some((dkdAttribute) => /request|courier|kurye|queue|talep|order|siparis/i.test(`${dkdAttribute.name} ${dkdAttribute.value}`))) dkdScore += 2;
  return dkdScore;
}

function dkdV301ScanQueue() {
  const dkdRaw = dkdV301NativeElements([
    'article', 'li', 'tr', '[role="listitem"]',
    '[data-request-id]', '[data-courier-id]', '[data-order-id]',
    '[class*="queue"]', '[class*="courier"]', '[class*="kurye"]', '[class*="request"]', '[class*="talep"]',
  ].join(','))
    .map((dkdElement) => ({ element: dkdElement, score: dkdV301CardScore(dkdElement) }))
    .filter((dkdItem) => dkdItem.score >= 3)
    .sort((dkdA, dkdB) => String(dkdA.element.textContent || '').length - String(dkdB.element.textContent || '').length);

  const dkdCards = [];
  for (const dkdItem of dkdRaw) {
    if (dkdCards.some((dkdCard) => dkdItem.element.contains(dkdCard))) continue;
    dkdCards.push(dkdItem.element);
  }

  const dkdSources = [];
  const dkdSeen = new Set();
  for (const [dkdIndex, dkdCard] of dkdCards.entries()) {
    const dkdDetails = dkdV301Details(dkdCard, dkdIndex);
    const dkdAttributes = [...dkdCard.attributes]
      .filter((dkdAttribute) => /id|request|courier|kurye|order|siparis|talep|queue/i.test(dkdAttribute.name))
      .map((dkdAttribute) => `${dkdAttribute.name}:${dkdAttribute.value}`)
      .join('|');
    const dkdFingerprint = [dkdAttributes, dkdDetails.order, dkdDetails.courier, dkdDetails.plate, dkdDetails.origin, dkdDetails.destination]
      .filter(Boolean).join('|');
    if (!dkdFingerprint || dkdSeen.has(dkdFingerprint)) continue;
    dkdSeen.add(dkdFingerprint);
    dkdSources.push({ id: dkdV301Hash(dkdFingerprint), details: dkdDetails, fingerprint: dkdFingerprint, container: dkdCard });
  }
  return dkdSources;
}

function dkdV301SetNativeValue(dkdInput, dkdValue) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(dkdInput, dkdValue);
  dkdInput.dispatchEvent(new Event('input', { bubbles: true }));
  dkdInput.dispatchEvent(new Event('change', { bubbles: true }));
}

async function dkdV301Submit(dkdRenderFinder, dkdRefresh) {
  const dkdCode = String(document.querySelector('#dkd-v30-code')?.value || '').replace(/\D/g, '').slice(0, 6);
  if (dkdCode.length !== 6) {
    dkdV301State.feedback = { type: 'error', text: 'Lütfen 6 haneli kurye kodunu eksiksiz girin.' };
    dkdRenderFinder();
    return;
  }

  dkdV301State.busy = true;
  dkdV301State.feedback = { type: 'loading', text: 'Modern doğrulama ekranı açılıyor ve kurye kodu kontrol ediliyor…' };
  dkdRenderFinder();

  const dkdBridge = await dkdV301EnsureBridge();
  if (!dkdBridge) {
    dkdV301State.busy = false;
    dkdV301State.feedback = { type: 'error', text: 'Kurye kodu doğrulama alanı açılamadı. Güvenlik oturumunu yenileyip tekrar deneyin.' };
    dkdRenderFinder();
    return;
  }

  dkdV301SetNativeValue(dkdBridge.input, dkdCode);
  await new Promise((dkdResolve) => setTimeout(dkdResolve, 180));
  dkdBridge.button.click();

  setTimeout(() => {
    dkdV301State.busy = false;
    dkdV301State.feedback = { type: 'success', text: 'Kurye kodu doğrulama sistemine gönderildi. Sonuç canlı kuyruktan kontrol ediliyor.' };
    dkdRenderFinder();
    setTimeout(() => {
      dkdV301ClickNativeView('queue', true);
      dkdRefresh();
    }, 650);
  }, 780);
}

window.dkdV301Data = {
  version: DKD_V301_VERSION,
  state: dkdV301State,
  normalize: dkdV301Normalize,
  escape: dkdV301Escape,
  isSimple: dkdV301IsSimple,
  clickNativeView: dkdV301ClickNativeView,
  scanQueue: dkdV301ScanQueue,
  submit: dkdV301Submit,
};
