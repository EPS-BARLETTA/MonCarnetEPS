# ScanCarnet – SECURE NO-SW v1.4

- **Pas de service worker** (aucun cache persistant) → moins de surprises lors des mises à jour.
- **UI inchangée** (2 boutons : CSV & PDF).
- **PDF multipage** pro (cartes, entête/pied, A4).
- **CSV robuste** (UTF-8 BOM, sauts de ligne préservés).
- **Anti-perte** : import CSV discret (écran Cycle) pour reconstruire le carnet.

## Installation
1. Remplacer `index.html` par celui-ci.
2. Ajouter `scancarnet-tools.js` à la racine.
3. Commit & push sur GitHub. Recharger la page publique.

## Conseils
- Demander aux élèves de **conserver un CSV** dans Fichiers/iCloud. En cas de perte : *Cycle → Importer un CSV sauvegardé*.
- RGPD : tout reste local (localStorage + fichiers CSV/PDF côté appareil).
