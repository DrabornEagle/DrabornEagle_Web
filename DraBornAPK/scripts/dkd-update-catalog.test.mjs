import test from "node:test";
import assert from "node:assert/strict";
import { dkdBuildCatalog } from "./dkd-update-catalog.mjs";

test("select highest stable published APK with matching package ID", () => {
  const dkdExample = {
    packages: {
      "org.example.sample": {
        metadata: { name: { "en-US": "Example APK", "tr-TR": "Örnek APK" } },
        versions: {
          "100": { manifest: { versionCode: 100, versionName: "1.0" }, file: { name: "/org.example.sample_100.apk", sha256: "abc" }, releaseChannels: [] },
          "101": { manifest: { versionCode: 101, versionName: "1.1 beta" }, file: { name: "/org.example.sample_101.apk", sha256: "abc" }, releaseChannels: ["beta"] },
          "99": { manifest: { versionCode: 99, versionName: "0.9" }, file: { name: "/another.app_99.apk", sha256: "abc" } }
        }
      }
    }
  };
  for (let dkdNumber = 0; dkdNumber < 120; dkdNumber += 1) {
    const dkdId = "org.example.app" + dkdNumber;
    dkdExample.packages[dkdId] = {
      versions: { "1": { manifest: { versionCode: 1 }, file: { name: "/" + dkdId + "_1.apk", sha256: "abc" } } }
    };
  }
  const dkdCatalog = dkdBuildCatalog(dkdExample);
  assert.equal(dkdCatalog.packages["org.example.sample"].versionCode, 100);
  assert.equal(dkdCatalog.packages["org.example.sample"].title, "Örnek APK");
  assert.equal(Object.keys(dkdCatalog.packages).length, 121);
});

test("reject invalid repository index", () => {
  assert.throws(() => dkdBuildCatalog({ packages: {} }), /too small/);
});
