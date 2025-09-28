# ScanCarnet – FIX CSP v1.5

**Problème résolu :** la CSP stricte bloquait les *scripts inline*, donc les boutons ne répondaient plus.  
**Correctif :** tout le JavaScript a été déplacé dans `scancarnet-app.js` (chargé depuis le même domaine). CSP conservée.

## Fichiers
- `index.html` (CSP, aucun JS inline)
- `scancarnet-tools.js` (PDF helper)
- `scancarnet-app.js` (toute la logique de l’app)

## Installation
1. Remplacer les fichiers par ceux du ZIP.
2. `git add . && git commit -m "Fix CSP v1.5 (external JS)" && git push`
3. Recharger GitHub Pages.
