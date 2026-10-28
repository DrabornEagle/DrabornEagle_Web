// DraBornAPK v0.1: public metadata lookup only. Never proxies APK binaries.
const dkdPackagePattern = /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/;

function dkdDecodeHtml(value) {
  return String(value || "")
    .replace(/&#(?:x([0-9a-f]+)|([0-9]+));/gi, (_, hex, decimal) => {
      const codePoint = parseInt(hex || decimal, hex ? 16 : 10);
      return Number.isSafeInteger(codePoint) && codePoint > 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint) : "";
    })
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
}

function dkdExtractMeta(html, property) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const match = tag.match(/\b(?:name|property)\s*=\s*(["'])(.*?)\1/i);
    if (match?.[2] !== property) continue;
    const content = tag.match(/\bcontent\s*=\s*(["'])([\s\S]*?)\1/i);
    if (content) return dkdDecodeHtml(content[2]);
  }
  return "";
}

async function dkdFetchTimeout(url, options = {}, millis = 5500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), millis);
  try { return await fetch(url, { ...options, signal: controller.signal, redirect: "follow" }); }
  finally { clearTimeout(timeout); }
}

async function dkdPlayMetadata(packageName) {
  try {
    const url = "https://play.google.com/store/apps/details?id=" + encodeURIComponent(packageName) + "&hl=tr";
    const response = await dkdFetchTimeout(url, { headers: { "Accept": "text/html", "User-Agent": "Mozilla/5.0 (compatible; DraBornAPK-Metadata/0.1)" } });
    if (!response.ok) return {};
    const html = (await response.text()).slice(0, 500000);
    let title = dkdExtractMeta(html, "og:title").replace(/\s*[-–|]\s*(Google Play.*|Apps on Google Play.*|Google Play'deki.*)$/i, "").trim();
    if (!title) {
      const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      title = match ? dkdDecodeHtml(match[1]).replace(/\s*[-–|]\s*(Google Play.*|Apps on Google Play.*)$/i, "").trim() : "";
    }
    const image = dkdExtractMeta(html, "og:image");
    let icon = null;
    try {
      const parsed = new URL(image);
      if (parsed.protocol === "https:" && ["play-lh.googleusercontent.com", "lh3.googleusercontent.com"].includes(parsed.hostname)) icon = parsed.href;
    } catch { /* No usable icon */ }
    return { title: title && title.length <= 120 ? title : null, icon };
  } catch { return {}; }
}

async function dkdFdroidMetadata(packageName) {
  const pageUrl = "https://f-droid.org/packages/" + encodeURIComponent(packageName) + "/";
  try {
    const response = await dkdFetchTimeout("https://f-droid.org/api/v1/packages/" + encodeURIComponent(packageName), { headers: { "Accept": "application/json" } });
    if (!response.ok) return { found: false };
    const data = await response.json();
    if (data.packageName !== packageName || !Array.isArray(data.packages)) return { found: false };
    const versions = data.packages.filter((item) => Number.isSafeInteger(item.versionCode) && item.versionCode > 0);
    const release = versions.find((item) => item.versionCode === data.suggestedVersionCode) || versions[0];
    if (!release) return { found: true, pageUrl };
    const downloadUrl = "https://f-droid.org/repo/" + packageName + "_" + release.versionCode + ".apk";
    let verifiedUrl = null;
    try {
      const head = await dkdFetchTimeout(downloadUrl, { method: "HEAD" }, 4200);
      // Only publish a direct link after the expected APK exists on the official host.
      const destination = new URL(head.url);
      if (head.ok && (destination.hostname === "f-droid.org" || destination.hostname.endsWith(".f-droid.org"))) {
        verifiedUrl = downloadUrl;
      }
    } catch { /* Some mirrors/regions block HEAD; let the user visit the publisher page. */ }
    return {
      found: true, pageUrl,
      versionName: typeof release.versionName === "string" ? release.versionName.slice(0, 40) : null,
      versionCode: release.versionCode,
      downloadUrl: verifiedUrl
    };
  } catch { return { found: false, lookupFailed: true }; }
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=300");
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  const packageName = String(req.query?.package || "");
  if (!dkdPackagePattern.test(packageName) || packageName.length > 180) {
    return res.status(400).json({ error: "invalid_package" });
  }
  const [play, fdroid] = await Promise.all([
    dkdPlayMetadata(packageName),
    dkdFdroidMetadata(packageName)
  ]);
  return res.status(200).json({
    packageName, title: play.title || null, icon: play.icon || null,
    playUrl: "https://play.google.com/store/apps/details?id=" + encodeURIComponent(packageName),
    fdroid
  });
}
