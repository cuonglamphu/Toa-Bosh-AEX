window.CCTV_VENDORS = {
  honeywell: {
    key: 'honeywell', name: 'Honeywell',
    logo: '../../assets/Heneywell_logo.png',
    color: '#c8102e', colorLight: 'rgba(200,16,46,.12)', cls: 'hw', colClass: 'col-honeywell'
  },
  hanwha: {
    key: 'hanwha', name: 'Hanwha',
    logo: '../../assets/Hanwa_logo.png',
    color: '#f37321', colorLight: 'rgba(243,115,33,.12)', cls: 'han', colClass: 'col-hanwha'
  },
  axis: {
    key: 'axis', name: 'AXIS',
    logo: '../../assets/Axis_logo.png',
    color: '#7c3aed', colorLight: 'rgba(124,58,237,.1)', cls: 'ax', colClass: 'col-axis'
  }
};

window.VendorUi = {
  logo(v, size = 'md') {
    const cls = size === 'sm' ? 'vendor-logo-wrap sm' : 'vendor-logo-wrap';
    return `<span class="${cls}"><img src="${v.logo}" alt="${v.name}" class="vendor-logo-img" loading="lazy" /></span>`;
  },
  /** Red gradient Tabulator headers — white text vendor name */
  titleTextFormatter(v) {
    return () => `<span class="vendor-head-name">${v.name}</span>`;
  },
  /** Logo pill for non-Tabulator contexts (kept for compatibility) */
  titleFormatter(v) {
    return () => `<span class="vendor-head-logo">${VendorUi.logo(v, 'sm')}</span>`;
  }
};
