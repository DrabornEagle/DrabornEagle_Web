# DraBornPS v0.6 Software Update

Pre-update source checkpoint: `37f014c8b5d41d41fdf9402d9432ffa5642e3388` (2026-09-19).
Full repository backup: `dkd-drabornps-pre-v0.6-20260919`.

## Changes

- Games-style Projects selector for DraBornGo, DraBornPark, DraBornSea, DraBornGate, DraBornOdds and DraBornPortal.
- Six original raster application concept mockups and an original Miami sunset wallpaper; no CSS-drawn project devices.
- Pink, turquoise, peach and violet controls across Home, Projects, Store, Library, Settings and Control Center.
- Shared console assets and a root entry synchronization script. Existing application routes and release downloads stay available.
- Project links participate in keyboard/gamepad navigation; browser Back restores Games/Projects/Media and the selected project.
- Project scrolling supports pull-to-refresh without interfering with a scrolled page.
- Existing games, local saves, sound settings and background music lifecycle retained.

## Verified destinations — 2026-09-19

| Project | Website | Additional destination |
| --- | --- | --- |
| DraBornGo | https://www.draborneagle.com/draborngo/ | None advertised |
| DraBornPark | https://www.draborneagle.com/DraBornPark/ | Official site links to https://play.google.com/store/apps/details?id=com.draborneagle.drabornpark |
| DraBornSea | No published destination found | Development status shown |
| DraBornGate | https://www.draborneagle.com/DraBornGate/ | None advertised |
| DraBornOdds | https://www.draborneagle.com/DraBornOdds/ | Website provides app access |
| DraBornPortal | https://www.draborneagle.com/DraBornPortal/ | https://www.draborneagle.com/DraBornPortal/App/ |

All listed project website URLs returned HTTP 200. The advertised DraBornPark Google Play destination returned HTTP 404, including with Turkish locale parameters. The official destination is retained without inventing a replacement package or claiming that installation is available.

## Validation and progress

- JavaScript syntax: passed for all 15 console/game scripts.
- Six-project rendering and action destinations: passed.
- All entry point assets exist locally.
- Live desktop: all six projects selected correctly; all seven project images (six covers + selected artwork) loaded; browser Back returned from Projects to Games.
- Live 390 × 844 mobile: project selection and horizontal rail scrolling worked; project web/APK buttons were reachable above the footer after scrolling; no document overflow.
- Live 360 × 800 mobile: Store featured button fits fully inside its hero at 48px height; APEX DRIFT opened its playable canvas and pause menu.
- Live 844 × 390 landscape: no horizontal document overflow.
- Root URL opened v0.6 with Games and Projects, retaining the root address.
- Root synchronization and deployment workflow validation passed. Temporary responsive preview removed after verification.
- Small final fix: preserve the mobile Search button when the version badge is present.

## Artwork provenance

Generated with the built-in imagegen tool. Mockups depict application concepts; their interface text and example values are illustrative.
Project assets: `assets/projects/dkd-{go,park,sea,gate,odds,portal}-v06.webp`.
Wallpaper: `assets/wallpapers/dkd-miami-v06.webp`.
Prompt set is recorded in `assets/projects/dkd-artwork-prompts.json`.

Implementation commit: `08e9f12f90ec21b8b5ff1ed9dc8f1c22f9201f09`.
Root synchronization commit: `0ab927ca24420fc92b102a887266fc030680b4d0`.
