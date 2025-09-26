ScanCarnet - Fixed package ready to push to GitHub
- Unregisters any old service worker on load and clears caches to avoid stale JS.
- Index.html has robust event listener attachment after DOMContentLoaded.
- Exports: CSV (includes warmup) and PDF (html2canvas + jsPDF).
- Files included: index.html, sw.js, manifest.webmanifest, README.txt

To deploy:
1) Replace the repo contents with these files (upload or git push).
2) If a previous service worker was registered, you (or your students) may need to clear site data in the browser or open the URL with ?no-cache=1.
3) After deployment, test: Démarrer → Profil → Cycle → Nouvelle séance → Export CSV/PDF.

If you want, I can also add icon PNG files (192 & 512) into the ZIP.
