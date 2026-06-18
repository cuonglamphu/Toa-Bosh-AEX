/**
 * CCTV report bootstrap — data tables, charts, narrative
 */
(function () {
  const V = window.CCTV_VENDORS;
  const INS = window.CCTV_INSIGHTS || {};
  const SECTION_WEIGHTS = { I: 0.35, II: 0.25, III: 0.15, IV: 0.25 };

  const pill = (level, text) =>
    `<span class="pill pill-${level === 'pass' ? 'pass' : level === 'warn' ? 'warn' : 'fail'}">${text}</span>`;

  const wrapTip = (html, tip) => {
    if (!tip) return html;
    const safe = String(tip).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<span class="tip-trigger" tabindex="0" data-tip="${safe}">${html}</span>`;
  };

  const vendorCell = (v) => {
    const c = v.comply || { level: 'na', label: '—' };
    const tip = [v.brand, v.model, v.data].filter(Boolean).join(' · ');
    return wrapTip(pill(c.level, c.label), tip);
  };

  const vendorByKey = { honeywell: V.honeywell, hanwha: V.hanwha, axis: V.axis };
  const vendorByName = { Honeywell: V.honeywell, 'Hanwha Vision': V.hanwha, AXIS: V.axis };

  const vendorHeaderCol = (field, v, extra = {}) => ({
    title: v.name,
    field,
    formatter: 'html',
    cssClass: v.colClass,
    hozAlign: 'center',
    headerSort: false,
    titleFormatter: VendorUi.titleTextFormatter(v),
    ...extra
  });

  const vendorCols = () => [
    { title: 'Tiêu chí', field: 'criteria', minWidth: 120, widthGrow: 1, headerSort: false },
    { title: 'Baseline spec', field: 'spec', minWidth: 140, widthGrow: 2, headerSort: false, formatter: 'textarea' },
    vendorHeaderCol('honeywell', V.honeywell, { minWidth: 100, widthShrink: 0 }),
    vendorHeaderCol('hanwha', V.hanwha, { minWidth: 100, widthShrink: 0 }),
    vendorHeaderCol('axis', V.axis, { minWidth: 100, widthShrink: 0 })
  ];

  const TABLE_LAYOUT = 'fitDataTable';

  function scoreRows(rows, key) {
    let pass = 0, warn = 0, fail = 0;
    rows.forEach(r => {
      const l = r[key]?.comply?.level || 'na';
      if (l === 'pass') pass++;
      else if (l === 'warn') warn++;
      else if (l === 'fail') fail++;
    });
    const total = rows.length || 1;
    const raw = pass + warn * 0.5;
    return { pass, warn, fail, total, pct: Math.round(raw / total * 100), score10: Math.round(raw / total * 10 * 100) / 100 };
  }

  function weightedTotal(sections, key) {
    let sum = 0;
    sections.forEach(sec => { sum += scoreRows(sec.rows, key).score10 * (SECTION_WEIGHTS[sec.id] || 0.25); });
    return Math.round(sum * 100) / 100;
  }

  function allRows(sections) { return sections.flatMap(s => s.rows); }

  async function loadReportData() {
    if (window.CCTV_DATA) return window.CCTV_DATA;
    if (location.protocol === 'file:') throw new Error('Thiếu cctv-data.js');
    const r = await fetch('../../data/cctv-data.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }

  function buildVendorOverview(sections) {
    const rows = allRows(sections);
    return [
      { v: V.honeywell, model: 'HN35640800NR / HC35W / HC60WB', wt: weightedTotal(sections, 'honeywell'), s: scoreRows(rows, 'honeywell') },
      { v: V.hanwha, model: 'XRN-6420 / XND-8080 / XNO-A8084', wt: weightedTotal(sections, 'hanwha'), s: scoreRows(rows, 'hanwha') },
      { v: V.axis, model: 'S1264 Rack / P1487-LE', wt: weightedTotal(sections, 'axis'), s: scoreRows(rows, 'axis') }
    ].map(d => `
      <div class="vendor-card ${d.v.cls}">
        ${VendorUi.logo(d.v)}
        <p class="font-bold text-2xl mt-3">${d.wt}<span class="text-sm font-normal text-neutral-500"> /10</span></p>
        <p class="text-xs text-neutral-500 mt-1">${d.s.pct}% comply · ${d.s.pass} full · ${d.s.warn} partial</p>
        <p class="text-xs text-neutral-400 mt-2">${d.model}</p>
      </div>`).join('');
  }

  function buildPartialSummary(sections) {
    const items = [];
    sections.forEach(sec => sec.rows.forEach(r => {
      ['honeywell', 'hanwha', 'axis'].forEach(k => {
        if (r[k]?.comply?.level === 'warn') {
          items.push({ sec: sec.id, stt: r.stt, criteria: r.criteria, v: vendorByKey[k], model: r[k].model, data: r[k].data });
        }
      });
    }));
    if (!items.length) return '';
    return `<p class="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2">⚠️ Red flags — Partial (REV01)</p>
      <div class="source-box">${items.map(i =>
      `<div class="py-1.5 border-b border-neutral-100 last:border-0 flex flex-wrap items-center gap-2">${VendorUi.logo(i.v, 'sm')}<span>${i.sec}-${i.stt} ${i.criteria} · <span class="text-neutral-400">${i.model}</span>${i.data ? ` — ${i.data}` : ''}</span></div>`
    ).join('')}</div>`;
  }

  const KPI_META = {
    Honeywell: { rank: 2, tag: '1 partial · BOQ an toàn nhất' },
    Hanwha: { rank: 3, tag: '4 partial · AI & TCO' },
    AXIS: { rank: 1, tag: 'Comply cao nhất · audit elevator' }
  };

  function buildConclusionKpi(vendors) {
    const sorted = [...vendors].sort((a, b) => b.s - a.s);
    const topScore = sorted[0]?.s;
    return vendors.map(d => {
      const meta = KPI_META[d.n] || {};
      const isLeader = d.s === topScore;
      const partialLine = d.partials === 0 && d.flag
        ? `0 partial · ⚠ ${d.flag}`
        : `${d.partials} partial${d.partials !== 1 ? '' : ''}${d.flag && d.partials ? ' · ' + d.flag : ''}`;
      return `
      <div class="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-center conclusion-kpi-card ${isLeader ? 'is-leader' : ''}">
        <span class="conclusion-rank">#${meta.rank || '—'}</span>
        ${VendorUi.logo(d.v, 'sm')}
        <p class="text-2xl font-bold mt-2">${d.s}<span class="text-sm font-normal text-neutral-500">/10</span></p>
        <p class="conclusion-kpi-meta">${partialLine}<br/>${meta.tag || ''}</p>
      </div>`;
    }).join('');
  }

  function buildConclusionHtml({ wH, wW, wA, conclusion: c }) {
    if (!c.verdict) {
      return `<p class="text-sm text-neutral-600">Honeywell ${wH}/10 · Hanwha ${wW}/10 · AXIS ${wA}/10 — làm rõ partial trước LOA.</p>`;
    }
    const altHtml = (c.alternatives || []).map(a => `
      <div class="conclusion-rec-alt">
        <strong>Phương án ${a.scenario} — ${a.vendor}</strong><br/>${a.when}
      </div>`).join('');
    const actionsHtml = (c.actionItems || []).map(a => `
      <li><span class="action-vendor">${a.vendor}</span><span>${a.item}</span></li>`).join('');

    return `
      <span class="conclusion-verdict">${c.verdict}</span>

      <div class="conclusion-block">
        <h3>Tổng hợp đánh giá</h3>
        <p>Ba nhà cung cấp đều đạt ngưỡng kỹ thuật enterprise trên REV01 (48 tiêu chí, 4 nhóm thiết bị), nhưng quyết định CCTV Gia Bình Phase 1.1 là lựa chọn nền tảng 15–20 năm — không thể giải bằng điểm Comply đơn thuần. ${c.rankingNote || ''}</p>
      </div>

      <div class="conclusion-block">
        <h3>Vị thế thị trường</h3>
        <p>${c.marketSynthesis || ''}</p>
      </div>

      <div class="conclusion-block">
        <h3>Khuyến nghị</h3>
        <div class="conclusion-rec-primary">
          <p class="text-sm font-semibold text-brand-900 mb-1">Khuyến nghị chính — Kịch bản ${c.primary?.scenario}: ${c.primary?.vendor}</p>
          <p class="text-sm text-neutral-700 leading-relaxed">${c.primary?.rationale || ''}</p>
        </div>
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">Phương án thay thế có điều kiện</p>
        ${altHtml}
      </div>

      <div class="conclusion-block">
        <h3>Checklist trước LOA</h3>
        <ul class="conclusion-action-list">${actionsHtml}</ul>
      </div>

      <div class="conclusion-block">
        <h3>Rủi ro nếu chọn sai hướng</h3>
        <div class="conclusion-risk">${c.riskIfWrong || ''}</div>
      </div>`;
  }

  async function init() {
    ReportCharts.setupDefaults();
    const crisp = (extra) => ReportCharts.crispOptions(extra);
    const { meta, sections } = await loadReportData();
    const rows = allRows(sections);
    const n = INS.narratives || {};

    document.getElementById('narrative-hook').textContent = n.hook || '';
    document.getElementById('narrative-f1').textContent = n.finding1 || '';
    document.getElementById('narrative-f2').textContent = n.finding2 || '';
    document.getElementById('narrative-f3').textContent = n.finding3 || '';
    document.getElementById('narrative-f4').textContent = n.finding4 || '';
    document.getElementById('narrative-f5').textContent = n.finding5 || '';

    document.getElementById('source-meta').innerHTML =
      `<strong>Nguồn chính:</strong> <code>${meta.sourceFile}</code> · ${meta.date}<br/>
       <strong>Phương pháp:</strong> Comply REV01 + tham chiếu Omdia / ICAO / ONVIF · Spec hiển thị bản tiếng Anh đã chuẩn hóa ký tự.`;

    document.getElementById('footer-source').textContent = meta.sourceFile;
    document.getElementById('vendor-overview').innerHTML = buildVendorOverview(sections);
    document.getElementById('partial-summary').innerHTML = buildPartialSummary(sections);

    document.getElementById('ref-list').innerHTML = (INS.references || []).map(r =>
      `<div class="mb-2"><span class="ref-tag">${r.type}</span><strong>${r.source}</strong> — ${r.note}</div>`
    ).join('');

    const marketNarrEl = document.getElementById('market-narrative');
    if (marketNarrEl) marketNarrEl.textContent = INS.marketNarrative || '';

    const sH = scoreRows(rows, 'honeywell'), sW = scoreRows(rows, 'hanwha'), sA = scoreRows(rows, 'axis');
    const wH = weightedTotal(sections, 'honeywell'), wW = weightedTotal(sections, 'hanwha'), wA = weightedTotal(sections, 'axis');
    const scores = [wH, wW, wA];
    const names = ['Honeywell', 'Hanwha', 'AXIS'];
    const colors = [V.honeywell.color, V.hanwha.color, V.axis.color];
    const leader = names[scores.indexOf(Math.max(...scores))];
    const sectionLabels = sections.map(s => s.label || s.id);

    new Tabulator('#table-market', {
      layout: 'fitColumns', headerSort: false,
      columns: [
        { title: 'Vendor', field: 'vendor', minWidth: 110, headerSort: false, formatter: 'html', hozAlign: 'center' },
        { title: 'Execution', field: 'execution', hozAlign: 'center', headerSort: false },
        { title: 'Vision', field: 'vision', hozAlign: 'center', headerSort: false },
        { title: 'Quadrant', field: 'quadrant', minWidth: 130, headerSort: false },
        { title: 'Share', field: 'globalShare', hozAlign: 'center', minWidth: 70, headerSort: false },
        { title: 'APAC', field: 'apacRank', minWidth: 120, headerSort: false },
        { title: 'Ghi chú', field: 'note', minWidth: 200, widthGrow: 2, headerSort: false, formatter: 'textarea' }
      ],
      data: (INS.market || []).map(m => ({
        ...m,
        vendor: vendorByName[m.vendor] ? VendorUi.logo(vendorByName[m.vendor], 'sm') : m.vendor
      }))
    });

    const quadrantMid = 8.0;
    const marketChart = document.getElementById('chartMarket');
    if (marketChart) {
      new Chart(marketChart, {
        type: 'scatter',
        data: {
          datasets: (INS.market || []).map((m, i) => ({
            label: m.vendor,
            data: [{ x: m.execution, y: m.vision }],
            backgroundColor: colors[i],
            pointRadius: 12,
            pointHoverRadius: 14
          }))
        },
        options: crisp({
          scales: {
            x: { min: 7.5, max: 9.2, title: { display: true, text: 'Execution Capability' } },
            y: { min: 7.5, max: 9.2, title: { display: true, text: 'Vision / Innovation' } }
          },
          plugins: { legend: { position: 'bottom' } }
        }),
        plugins: [{
          id: 'quadrantGuides',
          afterDraw(chart) {
            const { ctx, chartArea, scales: { x, y } } = chart;
            if (!chartArea) return;
            const xMid = x.getPixelForValue(quadrantMid);
            const yMid = y.getPixelForValue(quadrantMid);
            ctx.save();
            ctx.strokeStyle = 'rgba(0,0,0,.08)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(xMid, chartArea.top);
            ctx.lineTo(xMid, chartArea.bottom);
            ctx.moveTo(chartArea.left, yMid);
            ctx.lineTo(chartArea.right, yMid);
            ctx.stroke();
            ctx.restore();
          }
        }]
      });
    }

    const dims = INS.marketDimensions || [];
    if (document.getElementById('table-market-dim')) {
      new Tabulator('#table-market-dim', {
        layout: 'fitColumns', headerSort: false,
        columns: [
          { title: 'Tiêu chí', field: 'dimension', minWidth: 160, widthGrow: 1, headerSort: false },
          vendorHeaderCol('honeywell', V.honeywell, { minWidth: 90 }),
          vendorHeaderCol('hanwha', V.hanwha, { minWidth: 90 }),
          vendorHeaderCol('axis', V.axis, { minWidth: 90 }),
          { title: 'Luận điểm', field: 'note', minWidth: 200, widthGrow: 2, headerSort: false, formatter: 'textarea' }
        ],
        data: dims
      });
    }

    const dimChart = document.getElementById('chartMarketDim');
    if (dimChart && dims.length) {
      new Chart(dimChart, {
        type: 'bar',
        data: {
          labels: dims.map(d => d.dimension.length > 28 ? d.dimension.slice(0, 26) + '…' : d.dimension),
          datasets: [
            { label: 'Honeywell', data: dims.map(d => d.honeywell), backgroundColor: V.honeywell.color },
            { label: 'Hanwha', data: dims.map(d => d.hanwha), backgroundColor: V.hanwha.color },
            { label: 'AXIS', data: dims.map(d => d.axis), backgroundColor: V.axis.color }
          ]
        },
        options: crisp({
          indexAxis: 'y',
          scales: {
            x: { min: 0, max: 10, title: { display: true, text: 'Điểm tương đối (1–10)' } }
          },
          plugins: { legend: { position: 'bottom' } }
        })
      });
    }

    if (document.getElementById('table-vertical')) {
      new Tabulator('#table-vertical', {
        layout: 'fitColumns', headerSort: false,
        columns: [
          { title: 'Use case sân bay', field: 'criterion', minWidth: 180, widthGrow: 1, headerSort: false },
          vendorHeaderCol('honeywell', V.honeywell, { minWidth: 140, widthGrow: 1, formatter: 'textarea' }),
          vendorHeaderCol('hanwha', V.hanwha, { minWidth: 140, widthGrow: 1, formatter: 'textarea' }),
          vendorHeaderCol('axis', V.axis, { minWidth: 140, widthGrow: 1, formatter: 'textarea' })
        ],
        data: INS.verticalAirport || []
      });
    }

    if (document.getElementById('table-trends')) {
      new Tabulator('#table-trends', {
        layout: 'fitColumns', headerSort: false,
        columns: [
          { title: 'Xu hướng', field: 'trend', minWidth: 180, widthGrow: 1, headerSort: false },
          { title: 'Tác động', field: 'impact', hozAlign: 'center', minWidth: 90, headerSort: false },
          { title: 'Horizon', field: 'horizon', hozAlign: 'center', minWidth: 90, headerSort: false },
          { title: 'Luận điểm', field: 'note', minWidth: 200, widthGrow: 2, headerSort: false, formatter: 'textarea' }
        ],
        data: INS.marketTrends || []
      });
    }

    const insightsEl = document.getElementById('market-insights');
    if (insightsEl) {
      insightsEl.innerHTML = (INS.marketInsights || []).map(block => `
        <div class="insight-card">
          <p class="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">${block.title}</p>
          <p class="text-sm text-neutral-600 leading-relaxed mb-3">${block.summary}</p>
          <ul class="tech-arg-list text-sm text-neutral-600">${(block.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
        </div>`).join('');
    }

    const container = document.getElementById('section-tables');
    sections.forEach((sec, i) => {
      container.innerHTML += `
        <details class="comply-block"${i === 0 ? ' open' : ''}>
          <summary>${sec.id}. ${sec.title} · ${sec.rows.length} tiêu chí</summary>
          <div class="table-wrap"><div id="table-sec-${i}" class="report-tabulator"></div></div>
        </details>`;
    });
    sections.forEach((sec, i) => {
      new Tabulator(`#table-sec-${i}`, {
        layout: TABLE_LAYOUT,
        headerSort: false,
        columns: vendorCols(),
        data: sec.rows.map(r => ({
          criteria: r.criteria, spec: r.spec,
          honeywell: vendorCell(r.honeywell), hanwha: vendorCell(r.hanwha), axis: vendorCell(r.axis)
        }))
      });
    });

    const scoringData = sections.map(sec => ({
      criteria: `${sec.id}. ${sec.label}`,
      weight: Math.round((SECTION_WEIGHTS[sec.id] || 0.25) * 100) + '%',
      honeywell: scoreRows(sec.rows, 'honeywell').score10.toFixed(2),
      hanwha: scoreRows(sec.rows, 'hanwha').score10.toFixed(2),
      axis: scoreRows(sec.rows, 'axis').score10.toFixed(2)
    }));
    scoringData.push({ criteria: 'TOTAL /10', weight: '—', honeywell: `<strong>${wH}</strong>`, hanwha: `<strong>${wW}</strong>`, axis: `<strong>${wA}</strong>`, _footer: true });

    new Tabulator('#table-scoring', {
      layout: 'fitColumns', headerSort: false,
      rowFormatter(row) { if (row.getData()._footer) row.getElement().classList.add('row-footer'); },
      columns: [
        { title: 'Nhóm', field: 'criteria', minWidth: 160, widthGrow: 2, headerSort: false },
        { title: 'W', field: 'weight', minWidth: 50, hozAlign: 'center', headerSort: false },
        vendorHeaderCol('honeywell', V.honeywell),
        vendorHeaderCol('hanwha', V.hanwha),
        vendorHeaderCol('axis', V.axis)
      ],
      data: scoringData
    });

    new Chart(document.getElementById('chartScore'), {
      type: 'bar',
      data: { labels: names, datasets: [{ label: 'Điểm /10', data: scores, backgroundColor: colors, borderRadius: 8 }] },
      options: crisp({ scales: { y: { min: 0, max: 10, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } } })
    });

    const sectionScores = (key) => sections.map(s => scoreRows(s.rows, key).pct);
    new Chart(document.getElementById('chartRadar'), {
      type: 'radar',
      data: {
        labels: sectionLabels,
        datasets: [
          { label: 'Honeywell', data: sectionScores('honeywell'), borderColor: colors[0], backgroundColor: V.honeywell.colorLight, borderWidth: 2, pointRadius: 4 },
          { label: 'Hanwha', data: sectionScores('hanwha'), borderColor: colors[1], backgroundColor: V.hanwha.colorLight, borderWidth: 2, pointRadius: 4 },
          { label: 'AXIS', data: sectionScores('axis'), borderColor: colors[2], backgroundColor: V.axis.colorLight, borderWidth: 2, pointRadius: 4 }
        ]
      },
      options: crisp({ scales: { r: { min: 85, max: 100, ticks: { stepSize: 5 } } }, plugins: { legend: { position: 'bottom' } } })
    });

    const radarNotes = {
      honeywell: {
        strong: 'HN35640800NR (64CH, 8×10TB, 400Mbps) + HC35W45R dome / HC60WB5R bullet — đồng brand, 47/48 full',
        weak: 'I-11 Partial: HN35640800NR chỉ 2×1GbE RJ-45 — thiếu 10GbE SFP+ so BOQ connection ports',
        pick: 'Spec-match BOQ an toàn nhất — 1 partial duy nhất, không lẫn model cross-brand'
      },
      hanwha: {
        strong: 'XRN-6420RB (80TB, 520Mbps, ONVIF-S + SUNAPI) + XND-8080RV dome / XNO-A8084R bullet AI',
        weak: '4 partial: I-9 phân quyền tài khoản, I-11 cổng kết nối, I-12 alarm, IV-5 WiseIR 50m bullet',
        pick: 'Wisenet AI + TCO camera — điều kiện đóng 4 partial NVR trước LOA (nhóm I = 35% trọng số)'
      },
      axis: {
        strong: 'S1264 Rack 64TB (850Mbps tier, 64 ACS licenses, ONVIF S/G/T/M) + P1487-LE 5MP Zipstream',
        weak: 'Section III elevator: toàn bộ HC35W45R* (Honeywell) — 10/10 Comply nhưng submittal lẫn brand',
        pick: 'ACS + Object Analytics dài hạn — bắt buộc thay elevator submittal và forecast license Phase 2'
      }
    };
    document.getElementById('radar-cards').innerHTML = ['honeywell', 'hanwha', 'axis'].map(k => {
      const v = V[k], rn = radarNotes[k];
      return `<div class="rounded-xl border p-5 vendor-card ${v.cls}">
        ${VendorUi.logo(v, 'sm')}
        <p class="text-sm text-neutral-600 mt-3"><strong>Mạnh:</strong> ${rn.strong}<br/><strong>Yếu:</strong> ${rn.weak}<br/><strong>Luận điểm:</strong> ${rn.pick}</p>
      </div>`;
    }).join('');

    document.getElementById('scenarios').innerHTML = (INS.scenarios || []).map(s =>
      `<div class="option-card ${s.border} ${s.bg} border-l-4">
        <p class="font-bold text-brand-900 mb-1">${s.title}</p>
        <p class="text-xs text-neutral-500 mb-2">${s.vendor}</p>
        <p class="text-sm text-neutral-600 leading-relaxed">${s.text}</p>
      </div>`
    ).join('');

    const args = [
      {
        v: V.honeywell,
        pros: [
          '47/48 full REV01 — HN35640800NR NVR + HC35W45R dome + HC60WB5R bullet cùng Honeywell stack',
          'NVR HN35640800NR: 64CH IP, RAID, 8×10TB (80TB raw), ONVIF, 16 user accounts — vượt spec 10 user',
          'Dome HC35W45R: 5MP, -40~60°C, IR 50m, SMD/face/line-cross/intrusion — đạt II-10 analytics BOQ',
          'Bullet HC60WB5R-C: IP66/IK10/NEMA 4X, IR 60m, -40~60°C — vượt spec perimeter/apron IV-5–6'
        ],
        cons: [
          'I-11 Partial: HN35640800NR chỉ liệt kê 2×1GbE RJ-45 — không có 10GbE SFP+ theo BOQ connection ports',
          'I-7 Video output: field submittal ghi nhầm "Up to 400 Mbps" thay HDMI 1 + VGA — cần làm rõ datasheet',
          'Ecosystem đóng — đổi VMS sau này phụ thuộc Milestone/Honeywell Pro-Watch stack'
        ]
      },
      {
        v: V.hanwha,
        pros: [
          'XRN-6420RB: 80TB storage, 520Mbps throughput, 64CH, ONVIF Profile-S + SUNAPI — vượt 400Mbps BOQ',
          'XND-8080RV dome: 5MP WDR 120dB, 0.007 lux, virtual line + auto-tracking — Wisenet AI đa kịch bản',
          'XNO-A8084R bullet: -40~60°C, IP67/NEMA 4X, shock/tamper detection — phù hợp apron ngoài trời',
          '44/48 full — mạnh TCO camera APAC, linh hoạt VMS third-party qua ONVIF + SUNAPI'
        ],
        cons: [
          'I-9 Partial: phân quyền XRN-6420RB10 thiếu Copy/Network MIC/Camera Setup so BOQ account authorization',
          'I-11 Partial: cổng WAN 1Gbps — không khớp spec 10GbE + dual 1GbE connection ports',
          'I-12 Partial: alarm chỉ ghi Off/Recording error/Account locked — thiếu DDNS error theo BOQ',
          'IV-5 Partial: XNO-A8084R WiseIR 50m (164ft) — spec BOQ yêu cầu IR ≥50m với tiêu cự 3–4mm'
        ]
      },
      {
        v: V.axis,
        pros: [
          'S1264 Rack 64TB: 850Mbps enterprise tier, 64 ACS core licenses (scale 96CH), ONVIF S/G/T/M',
          'P1487-LE dome: 5MP AI, Zipstream/AV1, Object Analytics, ONVIF Alarm — tiết kiệm storage retention 90d+',
          '48/48 full Comply REV01 — dual hot-plug PSU, smart search, signed firmware posture cao nhất',
          'Bullet P1487-LE: IP67/IK10/NEMA 4X, IR reach 50m+, 0.004 lux — đạt IV-5–10 outdoor spec'
        ],
        cons: [
          'Section III elevator: toàn bộ 10 tiêu chí liệt kê HC35W45R2–R11 (Honeywell) — không có dome cabin AXIS',
          'I-7 NVR: S1264 chỉ 1× VGA, không built-in HDMI — cần KVM/IPMI cho phòng giám sát',
          'ACS license theo channel/analytics — forecast OPEX Phase 2 (+15–25% so Hanwha nếu không bundle sớm'
        ]
      }
    ];
    document.getElementById('vendor-args').innerHTML = args.map(a => `
      <div class="insight-card">
        ${VendorUi.logo(a.v, 'sm')}
        <p class="text-xs uppercase tracking-wide text-neutral-400 mt-3 mb-2">Luận điểm ủng hộ</p>
        <ul class="tech-arg-list mb-4">${a.pros.map(p => `<li>${p}</li>`).join('')}</ul>
        <p class="text-xs uppercase tracking-wide text-neutral-400 mb-2">Rủi ro</p>
        <ul class="tech-arg-list">${a.cons.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>`).join('');

    document.getElementById('conclusion-kpi').innerHTML = buildConclusionKpi([
      { n: 'Honeywell', s: wH, v: V.honeywell, partials: sH.warn, flag: null },
      { n: 'Hanwha', s: wW, v: V.hanwha, partials: sW.warn, flag: '4 partial REV01' },
      { n: 'AXIS', s: wA, v: V.axis, partials: sA.warn, flag: 'Elevator submittal' }
    ]);

    document.getElementById('conclusion-text').innerHTML = buildConclusionHtml({
      wH, wW, wA, sH, sW, sA, leader, conclusion: INS.conclusion || {}
    });

    document.getElementById('conclusion-source').textContent =
      'Nguồn: REV01 CSV · Omdia Video Surveillance 2024 · Frost & Sullivan APAC · ICAO Annex 17 · ACI Airport Security · ONVIF Profiles S/G/T/M.';

    ReportTooltips.init();
  }

  document.addEventListener('DOMContentLoaded', () => {
    ReportPdf.init({
      filename: 'Bao-Cao-CCTV-Honeywell-Hanwha-AXIS.pdf',
      rootId: 'report-export-root',
      buttonIds: ['btn-export-pdf-nav', 'btn-export-pdf-fab'],
      contentMaxWidth: 1100,
      getBlocks(root) {
        if (!root) return [];
        const blocks = [root.querySelector('header')];
        root.querySelectorAll('main .report-section').forEach((sec) => {
          if (sec.id === 's3') {
            const intro = document.createElement('div');
            intro.className = 'report-section';
            const head = sec.querySelector('.flex.items-start');
            if (head) intro.appendChild(head.cloneNode(true));
            blocks.push(intro);
            sec.querySelectorAll('details.comply-block').forEach((d) => blocks.push(d));
          } else {
            blocks.push(sec);
          }
        });
        blocks.push(root.querySelector('footer'));
        return blocks.filter(Boolean);
      }
    });
    init().catch(err => {
      console.error(err);
      const msg = document.createElement('div');
      msg.className = 'max-w-6xl mx-auto m-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800';
      msg.textContent = 'Không tải dữ liệu. Chạy: node scripts/parse-cctv-csv.mjs';
      document.getElementById('report-export-root').prepend(msg);
    });
  });
})();
