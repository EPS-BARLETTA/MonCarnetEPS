# ScanCarnet – Patch SLIM v1.2

Ce patch garde **exactement** la même UI (2 boutons : CSV & PDF) et apporte :

- **PDF** multipage propre (cartes de séance, entête/pied, pagination A4) – bouton **Générer PDF** amélioré.
- **CSV** robuste (BOM UTF‑8 + sauts de ligne préservés).
- **Anti‑perte** discret : un champ **Importer un CSV sauvegardé** dans l’écran *Cycle*, pour reconstruire tout le carnet après un vidage de cache.

## Installation
1. Remplace `index.html` par celui du patch.
2. Ajoute `scancarnet-tools.js` à la racine du projet.
3. Pousse sur GitHub (Pages se met à jour).

## Rappel RGPD
- Les données restent **sur l’appareil** (localStorage).
- Les exports **PDF/CSV** sont des fichiers locaux (Fichiers/Drive). L’import CSV permet de récupérer les séances.

