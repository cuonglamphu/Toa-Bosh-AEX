window.ReportCharts = {
  setupDefaults() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (typeof Chart !== 'undefined') {
      Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
      Chart.defaults.color = '#64748b';
      Chart.defaults.devicePixelRatio = dpr;
    }
    return dpr;
  },
  crispOptions(extra = {}) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      animation: { duration: 400 },
      ...extra
    };
  }
};
