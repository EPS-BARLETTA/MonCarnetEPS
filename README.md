# ScanCarnet - Carnet d'entraînement (PWA MVP)

ScanCarnet est la version matérielle du carnet d'entraînement pour élèves — simple, local-first et prêt pour l'évaluation.

## Contenu
- index.html : interface principale (profil, cycles, échauffement, séances, export, partage).
- sw.js : service worker (cache-first).
- manifest.webmanifest : PWA manifest.
- apps_script.txt : code Apps Script (doPost) à coller dans un Google Sheet si tu veux centraliser les envois.
- README.md : ce fichier.

## Pages de garde & pied de page
L'application affiche maintenant une page de garde (splash) avec le nom **ScanCarnet**.
Le pied de page montre : "ScanCarnet — Équipe EPS Lycée Vauban — LUXEMBOURG".

## Déploiement rapide
1. Crée un repo GitHub (ex: `ScanCarnet`) et pousse ces fichiers sur la branche `main`.
2. Active GitHub Pages (branch `main` / folder `/root`).
3. Ouvre l'URL et sur iPad : Partager → Ajouter à l'écran d'accueil pour installer la PWA.

## Apps Script (optionnel)
- Ouvre Google Sheets → Extensions → Apps Script, colle le contenu de `apps_script.txt`.
- Déploie comme Web App (Exécuter en tant que : Moi, Accès : Anyone).
- Copie l'URL et mets-la dans `index.html` variable `APPS_SCRIPT_WEBHOOK`. Replace aussi `SECRET_TOKEN`.

## Notes RGPD
Informe élèves/parents que des timestamps et données seront collectées et conservées. Prévois une politique de conservation.

