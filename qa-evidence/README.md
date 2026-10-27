# Web validation — 27 October 2026

The screenshot records the deployed Nashi interface at https://www.draborneagle.com/nashi-app/ .

Validation completed: 34 Banana tests, 2 API bridge tests, TypeScript checks, Vite production build, the upstream public release/history audit (530 historic blobs), Nashi DOM tests with actual PNG and CSV/TSV bytes, native FFmpeg output checks, and a real browser MP4-to-MP3 export. Tablet previews at 768 and 1024 pixels were inspected; the empty Banana gallery now keeps Create Folder above its composer.

The web release is commit 9ae354ce900a8cb3737e1fc55a9060fb7bfc4602. GitHub Pages workflow 40560009326 and the matching Vercel production deployment succeeded. Banana AI generation/cloud sharing require the dedicated backend and provider configuration documented in banana-studio/WEB_SETUP.md. Native-only Nashi limitations are documented in nashi-app/WEB_STATUS.md.
