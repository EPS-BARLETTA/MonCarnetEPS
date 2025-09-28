# ScanCarnet – PDF FIX v1.6

**Objectif :** PDF propre sans coupure de blocs + pouvoir récupérer/éditer les données dans l'app.

- PDF généré en **jsPDF direct** (pas d'images) → chaque séance est une **unité indivisible**, pas de coupe entre 2 pages.
- Export **CSV** (UTF‑8 BOM, sauts de ligne conservés).
- **Importer un CSV sauvegardé** (écran *Cycle*) reconstruit profil + échauffement + séances → on peut **reprendre l’édition**.
- Pas de Service Worker (pas de cache collant).

**Installation**
1. Remplacer `index.html` et `scancarnet-app.js` par ceux du ZIP.
2. Commit + push, puis recharger GitHub Pages.
