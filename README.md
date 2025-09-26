# ScanCarnet v2 - Carnet d'entraînement (PWA MVP)

Mises à jour : formulaire simplifié pour la séance — deux grands blocs :
- Échauffement (multi-lignes) — texte modifiable, lié au cycle si souhaité
- Compte-rendu / séance — grand bloc texte libre

La date est figée automatiquement lors de l'enregistrement (impossible à modifier par l'élève).

## Contenu du ZIP
- index.html
- sw.js
- manifest.webmanifest
- apps_script.txt (code Apps Script doPost)
- README.md

## Déploiement rapide
1. Crée un repo GitHub et pousse ces fichiers sur la branche main.
2. Active GitHub Pages (branch main / root).
3. Ouvre l'URL, sur iPad : Partager → Ajouter à l'écran d'accueil.

## Notes
- Si tu as toujours l'erreur « Objectif / volume / RPE requis » c'était la validation précédente — elle est supprimée dans cette version.
- Sauvegarde régulière recommandée (bouton Télécharger .json) si les iPad sont configurés pour nettoyer les données.

## RPE
RPE = "Rate of Perceived Exertion" — échelle d'effort perçu. Ici on utilisait une échelle 0-10.
En bref : c'est la note que l'élève donne à l'effort. Pas obligatoire dans cette version simplifiée.
