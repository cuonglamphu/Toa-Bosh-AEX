/**
 * Chuyển nền đen logo PNG → alpha transparent (threshold).
 * Cần: npm install sharp (hoặc chạy một lần trong project)
 * Usage: node scripts/make-logos-transparent.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '../assets');

const files = ['Heneywell_logo.png', 'Hanwa_logo.png', 'Axis_logo.png'];

async function run() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.log('Chưa cài sharp. Chạy: npm install sharp --save-dev');
    console.log('Hoặc dùng CSS mix-blend-mode: screen (đã bật trong report-base.css).');
    process.exit(0);
  }

  for (const file of files) {
    const input = path.join(assetsDir, file);
    if (!fs.existsSync(input)) {
      console.warn('Skip (missing):', file);
      continue;
    }
    const tmp = input + '.tmp.png';
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < 28 && g < 28 && b < 28) data[i + 3] = 0;
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(tmp);
    fs.renameSync(tmp, input);
    console.log('OK transparent:', file);
  }
}

run().catch(err => { console.error(err); process.exit(1); });
