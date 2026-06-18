/**
 * Shared PDF export — html2canvas + jsPDF
 * Usage: ReportPdf.init({ filename, rootId, buttonIds, contentMaxWidth })
 */
window.ReportPdf = (function () {
  const DEFAULTS = {
    rootId: 'report-export-root',
    buttonIds: ['btn-export-pdf-nav', 'btn-export-pdf-fab'],
    contentMaxWidth: 1024,
    margin: 10,
    format: 'a4'
  };

  let config = { ...DEFAULTS };
  let savedDetailsState = [];

  function expandAllDetails() {
    savedDetailsState = [];
    document.querySelectorAll('details').forEach((d) => {
      savedDetailsState.push({ el: d, open: d.open });
      d.open = true;
    });
  }

  function restoreDetailsState() {
    savedDetailsState.forEach(({ el, open }) => { el.open = open; });
    savedDetailsState = [];
  }

  function redrawTables(layout) {
    if (typeof Tabulator === 'undefined') return;
    document.querySelectorAll('[id^="table-"]').forEach((el) => {
      Tabulator.findTable(el).forEach((table) => {
        if (layout) table.setLayout(layout);
        table.redraw(true);
      });
    });
  }

  function setButtonsLoading(loading) {
    config.buttonIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.disabled = loading;
      if (loading) {
        el.dataset.prevHtml = el.innerHTML;
        el.innerHTML = id.includes('fab') ? '…' : 'Đang xuất PDF…';
      } else if (el.dataset.prevHtml) {
        el.innerHTML = el.dataset.prevHtml;
      }
    });
  }

  function hideNoPrint() {
    const hidden = [];
    document.querySelectorAll('.no-print').forEach((el) => {
      hidden.push({ el, display: el.style.display });
      el.style.display = 'none';
    });
    return hidden;
  }

  function restoreHidden(hidden) {
    hidden.forEach(({ el, display }) => { el.style.display = display; });
  }

  async function prepareLayout() {
    document.body.classList.add('pdf-exporting');
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 50));

    expandAllDetails();
    if (typeof config.onPrepare === 'function') config.onPrepare();
    redrawTables('fitDataTable');

    if (typeof Chart !== 'undefined') {
      document.querySelectorAll('canvas').forEach((canvas) => {
        const chart = Chart.getChart(canvas);
        if (chart) { chart.resize(); chart.update('none'); }
      });
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  function getBlocks() {
    if (typeof config.getBlocks === 'function') {
      const root = document.getElementById(config.rootId);
      return config.getBlocks(root) || [];
    }
    const root = document.getElementById(config.rootId);
    if (!root) return [];
    const header = root.querySelector('header');
    const sections = root.querySelectorAll('main .report-section');
    const footer = root.querySelector('footer');
    return [header, ...sections, footer].filter(Boolean);
  }

  async function captureBlock(block) {
    const html2canvasFn = window.html2canvas;
    if (!html2canvasFn) throw new Error('html2canvas not loaded');
    return html2canvasFn(block, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY,
      width: block.scrollWidth,
      height: block.scrollHeight,
      windowWidth: Math.max(block.scrollWidth, config.contentMaxWidth),
      onclone: (doc) => {
        doc.body.classList.add('pdf-exporting');
        const clonedRoot = doc.getElementById(config.rootId);
        if (clonedRoot) {
          clonedRoot.style.width = 'auto';
          clonedRoot.style.maxWidth = 'none';
        }
      }
    });
  }

  function appendCanvas(pdf, canvas, state) {
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = config.margin;
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;
    const imgHmm = (canvas.height * contentW) / canvas.width;
    let offsetHmm = 0;

    while (offsetHmm < imgHmm - 0.5) {
      if (!state.firstPage) pdf.addPage();
      state.firstPage = false;
      const sliceHmm = Math.min(contentH, imgHmm - offsetHmm);
      const slicePx = (sliceHmm * canvas.width) / contentW;
      const srcY = (offsetHmm * canvas.width) / contentW;
      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = Math.max(1, Math.ceil(slicePx));
      const ctx = slice.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, srcY, canvas.width, slice.height, 0, 0, canvas.width, slice.height);
      pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', margin, margin, contentW, sliceHmm);
      offsetHmm += sliceHmm;
    }
  }

  async function exportPdf() {
    const jsPDF = window.jspdf?.jsPDF;
    const html2canvasFn = window.html2canvas;

    if (!jsPDF || !html2canvasFn) {
      document.body.classList.add('pdf-exporting');
      window.print();
      document.body.classList.remove('pdf-exporting');
      return;
    }

    setButtonsLoading(true);
    const hidden = hideNoPrint();

    try {
      await prepareLayout();
      const pdf = new jsPDF({ unit: 'mm', format: config.format, orientation: 'portrait' });
      const state = { firstPage: true };
      for (const block of getBlocks()) {
        appendCanvas(pdf, await captureBlock(block), state);
      }
      pdf.save(config.filename);
    } catch (err) {
      console.warn('PDF export failed:', err);
      alert('Xuất PDF gặp lỗi. Dùng In → Save as PDF.');
      window.print();
    } finally {
      document.body.classList.remove('pdf-exporting');
      restoreHidden(hidden);
      restoreDetailsState();
      setButtonsLoading(false);
      redrawTables('fitColumns');
      if (typeof Chart !== 'undefined') {
        document.querySelectorAll('canvas').forEach((canvas) => {
          const chart = Chart.getChart(canvas);
          if (chart) chart.resize();
        });
      }
    }
  }

  function init(opts = {}) {
    config = { ...DEFAULTS, ...opts };
    window.exportReportPdf = exportPdf;
  }

  return { init, exportPdf };
})();
