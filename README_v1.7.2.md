# ScanCarnet v1.7.2 — FIX boutons inactifs (JS error) + SW cleanup

**Quoi :**
- Corrige un bug JS (`SectionTitle`) qui empêchait *tous les boutons* de marcher.
- Ajoute une **désinscription du Service Worker** et vidage du cache au chargement (évite les anciennes versions coincées).
- Conserve le **PDF pro** (titres colorés, numéros de page, pas de coupure) et le **guide coloré** + import CSV.

**Installation :**
1. Remplace `index.html` et `scancarnet-app.js` par ceux de ce ZIP.
2. Commit + push. Ouvre la page, puis **Ctrl+F5** (ou sur iPad : fermer l’onglet, ré-ouvrir).

**Astuce si toujours bloqué :**
- Ouvre la page, puis **Réinitialiser** (bouton), ou *Réglages Safari → Effacer historique et données de sites*.
