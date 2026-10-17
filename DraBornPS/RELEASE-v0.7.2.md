# DraBornPS v0.7.2 Software Update

Date: 2026-10-17.
Pre-update checkpoint: `7b3201a6220aa185de142eeb351f4c76600d2d6d`.
Backup branch: `backup/drabornps-pre-v0.7.2-20261017`.

## Changes

- Added DraBornStyle and DraBornGames with original raster mockups and their existing public web destinations.
- Project order: DraBornSeries → DraBornOffice → DraBornOdds → DraBornGames → DraBornStyle → DraBornGo → DraBornGate → DraBornSea → DraBornPark → DraBornPortal.
- DraBornStyle sits between Games and Go; the other projects follow the requested relative order.
- Projects initially selects DraBornSeries. The selector counter now covers ten projects.
- DraBornPortal's tile mark is exactly `Portal`; DraBornGames uses `Games`.
- Both public entry points share v0.7.2 assets and the same responsive Projects layout.
- Homepage structured project metadata and HTML discovery links include the new projects without removing the existing extra ecosystem links.

## Artwork

Generated with the built-in imagegen tool; device interfaces and game covers depict illustrative project concepts.

| Asset | Dimensions | File size | Full prompt |
| --- | --- | --- | --- |
| `assets/projects/dkd-style-v072.webp` | 1536 × 1024 | 266330 bytes | `assets/projects/dkd-style-v072-prompt.json` |
| `assets/projects/dkd-games-v072.webp` | 1536 × 1024 | 240366 bytes | `assets/projects/dkd-games-v072-prompt.json` |

## Validation

- JavaScript syntax and homepage synchronization passed.
- Artwork is optimized as opaque WebP and existing project artwork is retained.
- Implementation commit: `51549f7d283217c75b27f14929ac4268920dacc8`; public deployment completed successfully.
- Live browser checks passed at 1920 × 1080, 1366 × 768, 390 × 844, 360 × 800, 768 × 1024, 844 × 390 and 320 × 740 using viewport-sized frames.
- Both entry points report v0.7.2. All ten tiles appear in the documented order, with Series selected first and the exact `Games` / `Portal` marks.
- Both new project selections load their intended artwork without broken images or page-level horizontal overflow at all seven sizes. Counters are `04 / 10` for Games and `05 / 10` for Style.
- Each new web action remains reachable above the footer and inside the viewport; mobile actions are 48 px tall. Actual clicks open the existing Games portal and Style application.
- The mobile rail reaches Portal (`10 / 10`) and returns to Style. Tablet and landscape keyboard selection also reaches Portal.
- Returning from Media to Projects retains the selected Games card.
- The temporary responsive verification page was removed after these checks.
