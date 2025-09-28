# ScanCarnet v1.7.3 — **Single-file fix** (plus de 404 JS)
- Tout le JS est **inline** dans `index.html` (plus de dépendance `scancarnet-app.js`).
- **Boutons OK** même si une ancienne version est en cache, grâce au **nettoyage SW** au chargement.
- **PDF pro** (titres colorés, marges, numéros de page, pas de coupure) + **Guide coloré** + **Import CSV**.

## Installation
1) Remplace **uniquement** `index.html` à la racine du repo.
2) `git add index.html && git commit -m "v1.7.3 single-file fix" && git push`
3) Ouvre la page et force le rechargement (Ctrl+F5 / Cmd+Shift+R). Sur iPad : ferme & rouvre l’onglet.
