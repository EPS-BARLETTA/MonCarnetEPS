# Patch SLIM – Réparation + PDF complet sans changer l’UI

Ce patch :
- **corrige** l’erreur JS qui bloquait l’application,
- **supprime** les boutons ajoutés (on revient à *Exporter CSV* et *Générer PDF* uniquement),
- **améliore** le bouton *Générer PDF* : le PDF contient **toutes** les séances avec pagination A4.

## Installer
1. Remplacez votre `index.html` par celui de ce patch.
2. Ajoutez `scancarnet-tools.js` à la racine du projet.
3. Poussez sur GitHub. GitHub Pages sera à jour dans quelques secondes.

Aucune autre modification, aucune dépendance nouvelle (les CDN jsPDF/html2canvas sont déjà là).