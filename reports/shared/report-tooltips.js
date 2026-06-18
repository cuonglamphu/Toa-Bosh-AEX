window.ReportTooltips = {
  init() {
    const portal = document.getElementById('ui-tooltip');
    if (!portal) return;
    const content = portal.querySelector('.tip-content');
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('.tip-trigger');
      if (t) {
        content.textContent = t.getAttribute('data-tip');
        portal.classList.add('is-visible');
        const r = t.getBoundingClientRect();
        portal.style.top = (r.top - portal.offsetHeight - 8) + 'px';
        portal.style.left = Math.max(8, r.left + r.width / 2 - portal.offsetWidth / 2) + 'px';
      } else if (!portal.contains(e.target)) {
        portal.classList.remove('is-visible');
      }
    });
  }
};
