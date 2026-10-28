/**
 * DraBornAPK catalog refresh.
 * F-Droid index-v2.json is used exclusively for discovery. Do not treat this
 * metadata as a verified APK signature: users should install from F-Droid
 * with its own verification when strong trust guarantees are needed.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dkdScriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const dkdOutputFile = path.resolve(dkdScriptDirectory, "../data/catalog.json");
const dkdPackagePattern = /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/;

export function dkdBuildCatalog(dkdIndex) {
  if (!dkdIndex || !dkdIndex.packages || typeof dkdIndex.packages !== "object") {
    throw new Error("Invalid F-Droid index-v2 structure");
  }
  const dkdPackages = Object.create(null);
  for (const [dkdPackageId, dkdApp] of Object.entries(dkdIndex.packages)) {
    if (!dkdPackagePattern.test(dkdPackageId) || !dkdApp || typeof dkdApp !== "object") continue;
    if (!dkdApp.versions || typeof dkdApp.versions !== "object") continue;
    let dkdReleases = [];
    for (const dkdVersion of Object.values(dkdApp.versions)) {
      const dkdCode = Number(dkdVersion?.manifest?.versionCode);
      const dkdApkName = String(dkdVersion?.file?.name || "").replace(/^\/+/, "");
      if (!Number.isSafeInteger(dkdCode) || dkdCode < 1) continue;
      if (dkdApkName !== dkdPackageId + "_" + dkdCode + ".apk") continue;
      if (!dkdVersion?.file?.sha256 && !dkdVersion?.file?.hash) continue;
      dkdReleases.push({
        versionCode: dkdCode,
        versionName: String(dkdVersion.manifest.versionName || dkdCode).slice(0, 70),
        apkName: dkdApkName,
        isStable: !Array.isArray(dkdVersion.releaseChannels) || dkdVersion.releaseChannels.length === 0
      });
    }
    dkdReleases = dkdReleases.filter((dkdItem) => dkdItem.isStable);
    dkdReleases.sort((dkdLeft, dkdRight) => dkdRight.versionCode - dkdLeft.versionCode);
    const dkdBest = dkdReleases[0];
    if (!dkdBest) continue;
    const dkdLocalizedName = dkdApp.metadata?.name;
    const dkdLabel =
      typeof dkdLocalizedName === "string" ? dkdLocalizedName :
      dkdLocalizedName && typeof dkdLocalizedName === "object"
        ? (dkdLocalizedName["tr-TR"] || dkdLocalizedName.tr || dkdLocalizedName["en-US"] || dkdLocalizedName.en || Object.values(dkdLocalizedName)[0])
        : dkdPackageId;
    dkdPackages[dkdPackageId] = {
      title: String(dkdLabel || dkdPackageId).slice(0, 120),
      versionCode: dkdBest.versionCode,
      versionName: dkdBest.versionName,
      apkName: dkdBest.apkName
    };
  }
  if (Object.keys(dkdPackages).length < 100) throw new Error("Catalog too small: refused to replace existing data");
  return { schema: 1, generatedAt: new Date().toISOString(), source: "https://f-droid.org/repo/index-v2.json", packages: dkdPackages };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dkdController = new AbortController();
  const dkdTimeout = setTimeout(() => dkdController.abort(), 80000);
  try {
    const dkdResult = await fetch("https://f-droid.org/repo/index-v2.json", {
      headers: { "Accept": "application/json", "User-Agent": "DraBornAPK-Catalog/0.1" },
      signal: dkdController.signal
    });
    if (!dkdResult.ok) throw new Error("F-Droid index error: " + dkdResult.status);
    const dkdIndex = await dkdResult.json();
    const dkdCatalog = dkdBuildCatalog(dkdIndex);
    await mkdir(path.dirname(dkdOutputFile), { recursive: true });
    const dkdExisting = await readFile(dkdOutputFile, "utf-8").catch(() => "");
    let dkdOldPackages = null;
    try { dkdOldPackages = JSON.parse(dkdExisting).packages; } catch { /* Initial seed */ }
    const dkdEqual = JSON.stringify(dkdOldPackages) === JSON.stringify(dkdCatalog.packages);
    if (dkdEqual) {
      console.log("No F-Droid package changes. Catalog entries:", Object.keys(dkdCatalog.packages).length);
    } else {
      await writeFile(dkdOutputFile, JSON.stringify(dkdCatalog) + "\n", "utf8");
      console.log("Updated", Object.keys(dkdCatalog.packages).length, "F-Droid packages");
    }
  } catch (dkdError) {
    console.error("Catalog update failed; previous catalog retained:", dkdError);
    process.exitCode = 1;
  } finally {
    clearTimeout(dkdTimeout);
  }
}
