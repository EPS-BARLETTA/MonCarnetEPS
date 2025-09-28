
/*!
 * ScanCarnet Add‑ons (PDF complet + sauvegarde locale + import/export + partage)
 * Version: 1.0.0
 * Ce fichier est 100% additif : il n’écrase aucune fonction existante.
 * Il expose une API globale: window.ScanCarnetTools
 *
 * Dépendances optionnelles (chargées par la page appelante si nécessaire) :
 *  - jsPDF v2 (https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js)
 *  - html2canvas v1.4+ (https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js)
 *
 * RGPD : Les données sont stockées en localStorage sur l’appareil uniquement.
 */

(function () {
  "use strict";

  var STORE_KEY = "scancarnet.seances.v1";

  function ensureDeps() {
    if (!(window.jspdf && window.jspdf.jsPDF)) {
      throw new Error("jsPDF non chargé. Ajoutez <script src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'></script>");
    }
    if (!window.html2canvas) {
      throw new Error("html2canvas non chargé. Ajoutez <script src='https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'></script>");
    }
  }

  function injectPrintCSS() {
    if (document.getElementById("scancarnet-print-css")) return;
    var style = document.createElement("style");
    style.id = "scancarnet-print-css";
    style.textContent = "@media print { .page-break { page-break-before: always; } }";
    document.head.appendChild(style);
  }

  function addHeaderFooter(pdf, title) {
    var pageCount = pdf.internal.getNumberOfPages();
    var margin = 24;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    for (var i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      // En-tête
      pdf.text(String(title || "Carnet d’entraînement"), margin, 22);
      // Pied de page
      var footer = "ScanCarnet \u2013 " + new Date().toLocaleDateString() + " \u2013 Page " + i + "/" + pageCount;
      pdf.text(footer, margin, pdf.internal.pageSize.getHeight() - 16);
    }
  }

  async function generateFullPDF(opts) {
    ensureDeps();
    opts = opts || {};
    var rootSelector = opts.rootSelector || "#carnet-root";
    var title = opts.title || "Carnet d\u2019entraînement";

    var root = document.querySelector(rootSelector);
    if (!root) { alert("Zone \u00e0 imprimer introuvable (" + rootSelector + ")."); return; }

    injectPrintCSS();

    var a4 = { pt: { w: 595.28, h: 841.89 } }; // A4 portrait en points
    var scale = Math.min(2, (window.devicePixelRatio || 1) * 1.5);

    var canvas = await window.html2canvas(root, { scale: scale, backgroundColor: "#ffffff", useCORS: true });
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });

    var pageWidth = a4.pt.w;
    var pageHeight = a4.pt.h;

    var imgWidth = pageWidth;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;

    var y = 0;
    while (y < imgHeight) {
      var pageCanvas = document.createElement("canvas");
      var sliceHeight = Math.min(pageHeight, imgHeight - y);
      pageCanvas.width = (pageWidth * canvas.width) / imgWidth;
      pageCanvas.height = (sliceHeight * canvas.width) / imgWidth;

      var ctx = pageCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0, (y * canvas.width) / imgWidth,
        canvas.width, (sliceHeight * canvas.width) / imgWidth,
        0, 0,
        pageCanvas.width, pageCanvas.height
      );

      var pageImg = pageCanvas.toDataURL("image/jpeg", 0.95);
      if (y > 0) pdf.addPage();
      pdf.addImage(pageImg, "JPEG", 0, 0, pageWidth, sliceHeight);
      y += pageHeight;
    }

    addHeaderFooter(pdf, title);
    return pdf;
  }

  async function getPDFBlob(opts) {
    var pdf = await generateFullPDF(opts);
    return pdf.output("blob");
  }

  function saveDataLocally(dataObj) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(dataObj || {}));
      return true;
    } catch (e) { console.error(e); return false; }
  }

  function loadDataLocally() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { console.error(e); return null; }
  }

  function exportDataJSON(filename) {
    filename = filename || "scancarnet-donnees.json";
    var raw = localStorage.getItem(STORE_KEY) || "{}";
    var blob = new Blob([raw], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importDataJSONFromFile(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () {
        try {
          var obj = JSON.parse(r.result);
          localStorage.setItem(STORE_KEY, JSON.stringify(obj));
          resolve(obj);
        } catch (e) { reject(e); }
      };
      r.onerror = reject;
      r.readAsText(file);
    });
  }

  async function sharePDF(opts) {
    opts = opts || {};
    var title = opts.title || "Carnet d\u2019entraînement";
    try {
      var blob = await getPDFBlob(opts);
      var file = new File([blob], "Carnet.pdf", { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: "Carnet d\u2019entraînement au format PDF."
        });
      } else {
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "Carnet.pdf";
        a.click();
        URL.revokeObjectURL(url);
        alert("Le PDF a \u00e9t\u00e9 t\u00e9l\u00e9charg\u00e9. Joignez-le manuellement \u00e0 votre e-mail.");
        window.location.href = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent("Veuillez joindre le PDF t\u00e9l\u00e9charg\u00e9.");
      }
    } catch (e) {
      console.error(e);
      alert("Partage impossible. Le PDF va \u00eatre t\u00e9l\u00e9charg\u00e9.");
      var blob2 = await getPDFBlob(opts);
      var url2 = URL.createObjectURL(blob2);
      var a2 = document.createElement("a");
      a2.href = url2;
      a2.download = "Carnet.pdf";
      a2.click();
      URL.revokeObjectURL(url2);
    }
  }

  window.ScanCarnetTools = {
    STORE_KEY: STORE_KEY,
    generateFullPDF: generateFullPDF,
    getPDFBlob: getPDFBlob,
    saveDataLocally: saveDataLocally,
    loadDataLocally: loadDataLocally,
    exportDataJSON: exportDataJSON,
    importDataJSONFromFile: importDataJSONFromFile,
    sharePDF: sharePDF
  };
})();
