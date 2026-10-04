# DraBornPS v0.7 Software Update

Date: 2026-10-04.
Pre-update checkpoint: `53156e3513eadaa78eec99ce5711ad75e9dc9b0f`.
Backup branch: `backup/drabornps-pre-v0.7-20261004`.

## Changes

- DraBornSeries appears immediately after DraBornGo in the Projects selector.
- New original Miami sunset mockup with matching Android and web streaming screens, cinematic series artwork and the DraBornSeries name.
- DraBornSeries project details include series discovery, watchlist, VIP features, Android + Web access and the verified website `https://www.draborneagle.com/DraBornSeries/`.
- Existing responsive project rail and showcase are shared across desktop, tablet and mobile.
- Root and `/DraBornPS/` entry points both declare v0.7 and load the same versioned assets.
- About and version labels follow the declared release version; the homepage synchronization helper uses the declared version for the existing Support preloader.
- DraBornSeries was added to the homepage's structured project list and non-JavaScript links.

## Artwork

Asset: `assets/projects/dkd-series-v07.webp`.
Dimensions: 1536 × 1024, opaque WebP, 249642 bytes.
Generated with the built-in imagegen tool; device interfaces and fictional series posters are illustrative mockups.
Full prompt: `assets/projects/dkd-series-v07-prompt.json`.

## Validation

- JavaScript syntax passed for all 16 console/game scripts and the homepage synchronization helper.
- Homepage synchronization and whitespace checks passed.
- DraBornSeries website returned HTTP 200 with the DraBornSeries page title.
- Live root and `/DraBornPS/` layouts verified at 1920 × 1080, 1366 × 768, 768 × 1024, 390 × 844, 360 × 800, 844 × 390 and 320 × 740.
- All seven layouts showed DraBornGo followed by DraBornSeries, the correct `02 / 07` counter, v0.7 and zero broken project images or horizontal document overflow.
- Mobile, tablet and landscape action buttons were 48px tall and reachable above the system footer after scrolling/focusing.
- Clicking the mobile project website button opened the actual DraBornSeries website.
- Browser Back from Media restored Projects with DraBornSeries selected.
- Production homepage showed the full DraBornSeries mockup and detail panel; GitHub Pages publication and Vercel deployment both succeeded.
- Temporary responsive verification page removed after these checks.

Implementation commit: `fa7f6f5cada12eea2e4f1b60aff86aa94b2bbe8b`.
