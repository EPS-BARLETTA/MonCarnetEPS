# ScanCarnet — build v1.7.4 (single-file, ready for GitHub Pages)

Ce paquet contient un `index.html` unique avec toute l'application :
- Profil, Cycles, Échauffement, Séances
- Export CSV (UTF‑8 + BOM, sauts de ligne OK)
- Export PDF pro (titres, marges, pagination, pas de coupure de blocs)
- Import CSV (reconstruction & reprise du travail)
- Aide (gros bouton) + bouton "Retour au menu"
- Nettoyage automatique du Service Worker + caches

## Déploiement
1. Remplacer `index.html` à la racine du repo.
2. Commit & push :
   git add index.html
   git commit -m "deploy: v1.7.4 single-file app (CSV/PDF/import + Help back)"
   git push
3. Recharger la page GitHub Pages (Ctrl+F5 / Cmd+Shift+R). Sur iPad : fermer puis rouvrir l’URL.

## Note
- Garder un seul point d'entrée : `index.html`. Supprimer tout `index2.html`, `index3.html`, etc.
