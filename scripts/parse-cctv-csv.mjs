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

const raw = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
const lines = raw.split(/\r?\n/);

const meta = {
  project: (lines[2] || '').split(',')[0].replace(/^Project \/ D.*? án:\s*/i, '').trim(),
  package: (lines[3] || '').split(',')[0].replace(/^Package \/ G.*?i th.*?u:\s*/i, '').trim(),
  items: (lines[4] || '').split(',')[0].replace(/^H.*?ng m.*?c \/ Items:\s*/i, '').trim(),
  date: '11/06/2026',
  revision: '1',
  vendors: ['Honeywell', 'Hanwha', 'AXIS']
};

function normComply(v) {
  const s = (v || '').toLowerCase();
  if (!s.trim()) return { level: 'na', label: '—' };
  if (s.includes('full') || s.includes('toàn b') || s.includes('full comply')) return { level: 'pass', label: '✅ Full comply' };
  if (s.includes('partial') || s.includes('một ph') || s.includes('1 ph')) return { level: 'warn', label: '⚠️ Partial' };
  if (s.includes('fail') || s.includes('không')) return { level: 'fail', label: '❌ Fail' };
  return { level: 'warn', label: '⚠️ ' + v.slice(0, 40) };
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
    current = { id: stt, title: desc, rows: [] };
    sections.push(current);
    continue;
  }
  if (!current || !/^\d+$/.test(stt)) continue;

  const spec = (cols[4] || cols[3] || '').trim();
  const v1 = {
    brand: (cols[6] || '').trim(),
    model: (cols[7] || '').trim(),
    data: (cols[8] || '').trim(),
    comply: normComply(cols[9])
  };
  const v2 = {
    brand: (cols[10] || '').trim(),
    model: (cols[11] || '').trim(),
    data: (cols[12] || '').trim(),
    comply: normComply(cols[13])
  };
  const v3 = {
    brand: (cols[14] || '').trim(),
    model: (cols[15] || '').trim(),
    data: (cols[16] || '').trim(),
    comply: normComply(cols[17])
  };

  current.rows.push({
    stt,
    criteria: desc.split('/').map(s => s.trim()).filter(Boolean).pop() || desc,
    spec: spec.slice(0, 200),
    honeywell: v1,
    hanwha: v2,
    axis: v3
  });
}

fs.writeFileSync(outPath, JSON.stringify({ meta, sections }, null, 2), 'utf8');
console.log('Wrote', outPath, '- sections:', sections.length, 'rows:', sections.reduce((a,s)=>a+s.rows.length,0));
