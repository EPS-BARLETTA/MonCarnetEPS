# Patch ScanCarnet – PDF complet + sauvegarde locale + import/export + partage

Ce patch ajoute **sans casser l’existant** :
- Bouton **PDF complet** (pagination A4, toutes les séances visibles).
- **Sauvegarde locale** RGPD (localStorage, rien en ligne).
- **Export/Import JSON** pour reprendre le travail sur un autre appareil.
- **Partager** le PDF (feuille de partage iOS/iPadOS ; repli en téléchargement).

## Fichiers inclus
- `index.html` (patché : ajoute 5 boutons et le branchement JS).
- `scancarnet-tools.js` (module additif).
- `README_PATCH.md` (ce fichier).

## Déploiement
1. Remplacer votre `index.html` par celui de ce patch.
2. Ajouter `scancarnet-tools.js` à la racine du projet.
3. Pousser sur GitHub → Pages.

> En cas de souci, vous pouvez revenir à votre `index.html` précédent : les ajouts sont non destructifs.
