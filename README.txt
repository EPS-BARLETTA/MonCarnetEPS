ScanCarnet-local-v9
-------------------
Local-only version (no Google, no server).

Features:
- Uses IndexedDB for reliable local storage (migration from previous localStorage if present).
- Offline-first: everything saved locally on device (iPad/phone/PC).
- Fixed, immutable timestamps: dateISO (Europe/Luxembourg) + created_atISO (UTC) saved at each session creation.
- Export CSV (includes warmup), Generate PDF, Backup JSON (download), Reset/Clear all.
- No server or Google integration to respect GDPR / local-only policy.
- Includes minimal sw.js and manifest.webmanifest to avoid stale SW issues and support 'Add to home screen'.

Deployment:
- Replace repo files with index.html, sw.js, manifest.webmanifest, README.txt (and optional icons).
- After deploy, if old service worker exists on clients, they should unregister it (DevTools -> Application -> Service Workers -> Unregister) or clear site data on iPad Safari.
