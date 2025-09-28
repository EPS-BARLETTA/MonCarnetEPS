
/*! ScanCarnet Tools SLIM – v1.5 */
(function () {
  "use strict";
  function injectPrintCSS() {
    if (document.getElementById("scancarnet-print-css")) return;
    var style = document.createElement("style");
    style.id = "scancarnet-print-css";
    style.textContent = "@media print { .page-break { page-break-before: always; } }";
    document.head.appendChild(style);
  }
  async function generateFullPDF(opts) {
    opts = opts || {};
    var rootSelector = opts.rootSelector || "#carnet-root";
    var title = opts.title || "Carnet d’entraînement";
    var root = document.querySelector(rootSelector);
    if (!root) { alert("Zone à imprimer introuvable (" + rootSelector + ")."); return; }
    injectPrintCSS();
    var a4 = { pt: { w: 595.28, h: 841.89 } };
    var scale = Math.min(2, (window.devicePixelRatio || 1) * 1.5);
    var canvas = await window.html2canvas(root, { scale: scale, backgroundColor: "#ffffff", useCORS: true });
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
    var pageWidth = a4.pt.w, pageHeight = a4.pt.h;
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
    try {
      var pages = pdf.internal.getNumberOfPages();
      var margin = 24;
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(10);
      for (var i = 1; i <= pages; i++) {
        pdf.setPage(i);
        pdf.text(title, margin, 22);
        pdf.text("ScanCarnet – " + new Date().toLocaleDateString() + " – Page " + i + "/" + pages, margin, pdf.internal.pageSize.getHeight() - 16);
      }
    } catch(e) {}
    return pdf;
  }
  window.ScanCarnetTools = { generateFullPDF: generateFullPDF };
})();
