
# ScanCarnet – Add‑ons PDF + Sauvegarde locale (RGPD friendly)

Ces fichiers **n'altèrent pas** votre application actuelle. Ils ajoutent :
- Génération **PDF complète** (toutes les séances, pagination A4, en‑tête/pied).
- **Sauvegarde locale** des données (localStorage, iPad/ordi/smartphone) – pas de serveur → conforme RGPD.
- **Export/Import JSON** pour reprendre le travail sur un autre appareil.
- **Partager/Envoyer** (feuille de partage iOS/iPadOS → Mail/Fichiers avec le PDF en PJ). Repli en téléchargement.

## Fichiers fournis

- `scancarnet-tools.js` : module autonome exposant `window.ScanCarnetTools`.
- `integration-example.html` : exemple minimal d’intégration (à titre de démo, **ne remplace aucun fichier**).

## Intégration (2 étapes)

### 1) Inclure les scripts dans la page qui affiche toutes les séances

```html
<!-- Dépendances -->
<script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

<!-- Add‑ons -->
<script src="scancarnet-tools.js"></script>
```

### 2) Ajouter la barre d’outils et brancher les boutons

Ajoutez près de votre tableau/liste des séances :

```html
<div class="toolbar" style="display:flex; gap:.5rem; flex-wrap:wrap; margin:.5rem 0;">
  <button id="btn_pdf">📄 PDF</button>
  <button id="btn_share">📤 Partager / Envoyer</button>
  <button id="btn_save">💾 Enregistrer</button>
  <button id="btn_export">⬇️ Export JSON</button>
  <label style="display:inline-flex;align-items:center;gap:.5rem;cursor:pointer;">
    ⬆️ Import JSON
    <input type="file" id="file_import" accept="application/json" style="display:none;">
  </label>
</div>

<!-- Encapsule TOUT le carnet dans ce conteneur -->
<div id="carnet-root">
  <!-- vos entêtes + TOUTES les séances -->
</div>
```

Puis en bas de page :

```html
<script>
  // Adaptez ces deux fonctions à VOTRE état de données existant :
  function getCurrentData() {
    // Exemple : retournez l’objet qui contient toutes les séances + infos élève
    // return { seances: window.SEANCES || [], athlete: window.ATHLETE || {} };
    return window.SCANCARNET_DATA || {};
  }

  function applyLoadedData(obj) {
    // Exemple : appliquez l’objet et rafraîchissez l’affichage
    // window.SEANCES = obj.seances || [];
    // renderSeances();
    window.SCANCARNET_DATA = obj || {};
    if (window.renderCarnet) window.renderCarnet();
  }

  // Auto‑chargement au démarrage si des données locales existent
  (function() {
    var boot = window.ScanCarnetTools.loadDataLocally();
    if (boot) applyLoadedData(boot);
  })();

  // Brancher les boutons
  document.getElementById('btn_pdf')?.addEventListener('click', () => {
    window.ScanCarnetTools.generateFullPDF({ rootSelector: '#carnet-root', title: 'Carnet d’entraînement' })
      .then(pdf => pdf.save('Carnet.pdf'));
  });

  document.getElementById('btn_share')?.addEventListener('click', () => {
    window.ScanCarnetTools.sharePDF({ rootSelector: '#carnet-root', title: 'Carnet d’entraînement' });
  });

  document.getElementById('btn_save')?.addEventListener('click', () => {
    const ok = window.ScanCarnetTools.saveDataLocally(getCurrentData());
    alert(ok ? 'Données enregistrées sur cet appareil.' : 'Échec de l’enregistrement.');
  });

  document.getElementById('btn_export')?.addEventListener('click', () => {
    window.ScanCarnetTools.exportDataJSON();
  });

  document.getElementById('file_import')?.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const obj = await window.ScanCarnetTools.importDataJSONFromFile(file);
      applyLoadedData(obj);
      alert('Données importées.');
    } catch (err) {
      console.error(err);
      alert('Import impossible (fichier invalide).');
    } finally {
      e.target.value = '';
    }
  });
</script>
```

> **Important :** Rien n’est envoyé sur un serveur. Les données restent **locales** (localStorage).  
> Pour déplacer sur un autre appareil : utilisez **Export JSON** puis **Import JSON**.

## Démo rapide

Ouvrez `integration-example.html` et scrollez : le PDF généré contient **toutes** les séances visibles dans `#carnet-root` (découpage multi‑pages A4).

## FAQ

- **iPad / iPhone :** iOS 16+ permet `navigator.share({ files: [...] })` → pièce jointe PDF dans Mail/Fichiers.  
  Repli si indisponible : téléchargement + ouverture d’un mail vierge (à compléter manuellement).
- **Mises en page** : ajoutez `<div class="page-break"></div>` pour forcer un saut de page dans le PDF.
- **Performance** : si le carnet est très long, la génération peut prendre quelques secondes.

