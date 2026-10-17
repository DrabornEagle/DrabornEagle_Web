# DraBornPS v0.7.1 Software Update

Date: 2026-10-17.
Pre-update checkpoint: `ffdaed50b1998c8e4ca6905773f25603907b32f9`.
Backup branch: `backup/drabornps-pre-v0.7.1-20261017`.

## Changes

- DraBornOffice appears immediately after DraBornGo; DraBornSeries follows Office and all existing projects retain their relative order.
- Original Miami coastal game-studio mockup shows the office simulation on laptop and phone screens.
- The project card describes team management, projects, office upgrades, budget and research. Its verified web destination is `https://www.draborneagle.com/office/`.
- Shared responsive rail and showcase support desktop, tablet and mobile browsers.
- Root and `/DraBornPS/` entry points declare v0.7.1 and share the same versioned assets.
- DraBornOffice is included in the homepage's structured project list and accessible HTML links.

## Artwork

Asset: `assets/projects/dkd-office-v071.webp`.
Dimensions: 1536 × 1024, opaque WebP, 347084 bytes.
Generated with the built-in imagegen tool; the device screens depict an illustrative project concept.
Full prompt: `assets/projects/dkd-office-v071-prompt.json`.

## Validation

- JavaScript syntax passed for the three modified console scripts.
- Homepage synchronization, structured data parsing and whitespace checks passed.
- Live layouts passed at 1920 × 1080, 1366 × 768, 768 × 1024, 390 × 844, 360 × 800, 844 × 390 and 320 × 740 using both public entry points.
- Every layout showed eight projects, DraBornGo → DraBornOffice → DraBornSeries, v0.7.1, the `02 / 08` counter and the correct Office link.
- All project images loaded; no horizontal document overflow or action extending beyond its card was observed.
- Mobile, tablet and landscape action buttons were 48px tall and reachable above the footer after scrolling/focusing.
- The mobile rail reached DraBornPortal and returned to Office correctly; the Office button opened the actual DraBornOffice v0.3 Miami Shores game.
- Browser Back from Media restored Projects with DraBornOffice selected on the production homepage.
- Temporary responsive verification page removed after these checks.

Implementation commit: `4e0f21427b7a4bb8a72f28b2a3ee00249b01a31f`.
