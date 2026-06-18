import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, '../data/cctv-comparison.csv');
const outPath = path.join(__dirname, '../data/cctv-data.json');

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

/** Chuẩn hóa ký tự lỗi từ CSV Windows-1252 / mojibake */
function sanitizeText(text) {
  if (!text) return '';
  let s = String(text)
    .replace(/\uFFFD/g, '')
    .replace(/�/g, '');

  s = s
    .replace(/:\s*\?400/g, ': ≥400')
    .replace(/\?\s*400\s*Mbps/gi, '≥400 Mbps')
    .replace(/\?\s*5MP/gi, '≥5MP')
    .replace(/\?\s*0\.(\d)/g, '≥0.$1')
    .replace(/\?\s*30m/gi, '≥30m')
    .replace(/\?\s*50m/gi, '≥50m')
    .replace(/\?\s*06/g, '≥06')
    .replace(/\?\s*1\/2\.8/g, '≥1/2.8')
    .replace(/(\d)\s*C(?=\s*\(|\s*to|\s*~|\)|,|\/|$|\s)/g, '$1°C')
    .replace(/(\d)\s*F(?=\s*\(|\s*to|\s*~|\)|,|\/|$|\s)/g, '$1°F')
    .replace(/(\d)\s+(\d)\s+C/g, '$1°–$2°C')
    .replace(/2592\s*[^\d]\s*1944/g, '2592×1944')
    .replace(/2592�1944/g, '2592×1944')
    .replace(/(\d)\s*[^\d\w]\s*(\d)\s*mm/g, '$1–$2 mm')
    .replace(/(\d)\.(\d)\s*[^\d]\s*(\d)\.(\d)\s*mm/g, '$1.$2–$3.$4 mm')
    .replace(/(\d)\?\s*-\s*(\d)\?/g, '$1°–$2°')
    .replace(/(\d)\s*-\s*(\d)\?/g, '$1°–$2°')
    .replace(/104\s*[^\d\w]+\s*34\s*[^\d\w]*/g, '104°–34°')
    .replace(/106\s*[^\d\w-]+\s*35\s*[^\d\w]*/g, '106°–35°')
    .replace(/77\s*[^\d\w-]+\s*26\s*[^\d\w]*/g, '77°–26°')
    .replace(/P1487[^\w-]*LE/gi, 'P1487-LE')
    .replace(/2\.8\s*[^\w"]+/g, '2.8"')
    .replace(/1\/2\.8\s*[^\w"]+/g, '1/2.8"')
    .replace(/32\?\s*to\s*104\?/gi, '32°F to 104°F')
    .replace(/50\s*F\s*to\s*95\s*F/gi, '50°F to 95°F')
    .replace(/AC\s*100\s*240V/gi, 'AC 100–240V')
    .replace(/\s+/g, ' ')
    .trim();

  return s;
}

/** Lấy phần tiếng Anh sau dấu / */
function enPart(text) {
  if (!text) return '';
  const parts = text.split('/').map(s => s.trim()).filter(Boolean);
  const raw = parts.length >= 2 ? parts[parts.length - 1] : text;
  return sanitizeText(raw);
}

const SECTION_LABELS = {
  I: { short: 'NVR Server', full: 'IP Camera Storage Server' },
  II: { short: 'Dome IP PoE', full: 'Fixed Day/Night IP Dome Camera' },
  III: { short: 'Dome thang máy', full: 'Elevator Dome IP Camera' },
  IV: { short: 'Bullet IP', full: 'Indoor/Outdoor Bullet Camera' }
};

const raw = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
const lines = raw.split(/\r?\n/);

const meta = {
  project: 'Dự án đầu tư xây dựng cảng hàng không quốc tế Gia Bình — giai đoạn 1.1',
  package: 'Gói thầu Cơ điện / MEPF',
  items: 'Hệ thống CCTV — Honeywell · Hanwha · AXIS',
  date: '11/06/2026',
  revision: 'REV01',
  sourceFile: 'Technical comparison.CCTV.REV01.csv',
  sourcePath: 'data/cctv-comparison.csv',
  vendors: ['Honeywell', 'Hanwha', 'AXIS']
};

function normComply(v) {
  const s = (v || '').toLowerCase();
  if (!s.trim()) return { level: 'na', label: '—' };
  if (s.includes('full') || s.includes('toàn b') || s.includes('full comply')) return { level: 'pass', label: '✅ Full comply' };
  if (s.includes('partial') || s.includes('một ph') || s.includes('1 ph')) return { level: 'warn', label: '⚠️ Partial' };
  if (s.includes('fail') || s.includes('không')) return { level: 'fail', label: '❌ Fail' };
  return { level: 'warn', label: '⚠️ Partial' };
}

function cleanVendor(v) {
  return {
    brand: sanitizeText(enPart(v.brand) || v.brand),
    model: sanitizeText((v.model || '').trim()),
    data: sanitizeText(enPart(v.data) || (v.data || '').trim()),
    comply: v.comply
  };
}

const sections = [];
let current = null;

for (let i = 11; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim() || line.startsWith('"ĐƠN VỊ') || line.startsWith('"??N V?')) break;
  const cols = parseCsvLine(line);
  const stt = (cols[0] || '').trim();
  const desc = (cols[1] || '').trim();
  if (!desc && !stt) continue;

  if (/^(I|II|III|IV|V|VI)$/i.test(stt) && desc.length > 10) {
    const lbl = SECTION_LABELS[stt] || { short: enPart(desc), full: enPart(desc) };
    current = {
      id: stt,
      title: `${lbl.short} · ${lbl.full}`,
      label: lbl.short,
      rows: []
    };
    sections.push(current);
    continue;
  }
  if (!current || !/^\d+$/.test(stt)) continue;

  const specRaw = (cols[4] || cols[3] || '').trim();
  const v1 = cleanVendor({
    brand: (cols[6] || '').trim(),
    model: (cols[7] || '').trim(),
    data: (cols[8] || '').trim(),
    comply: normComply(cols[9])
  });
  const v2 = cleanVendor({
    brand: (cols[10] || '').trim(),
    model: (cols[11] || '').trim(),
    data: (cols[12] || '').trim(),
    comply: normComply(cols[13])
  });
  const v3 = cleanVendor({
    brand: (cols[14] || '').trim(),
    model: (cols[15] || '').trim(),
    data: (cols[16] || '').trim(),
    comply: normComply(cols[17])
  });

  current.rows.push({
    stt,
    criteria: enPart(desc) || desc,
    spec: enPart(specRaw).slice(0, 220),
    honeywell: v1,
    hanwha: v2,
    axis: v3
  });
}

const payload = { meta, sections };
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
const jsPath = path.join(__dirname, '../data/cctv-data.js');
fs.writeFileSync(jsPath, 'window.CCTV_DATA = ' + JSON.stringify(payload) + ';\n', 'utf8');
console.log('Wrote', outPath, 'and', jsPath, '- sections:', sections.length, 'rows:', sections.reduce((a, s) => a + s.rows.length, 0));
