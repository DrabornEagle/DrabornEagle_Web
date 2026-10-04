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
- Live responsive verification is performed after publication; results recorded in the final release checkpoint.
