import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../.output/cws-assets');

function parsePngHeader(buf) {
  if (buf.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error('Invalid PNG signature');
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  // 0: Grayscale, 2: RGB (24-bit, no alpha), 3: Indexed, 4: Grayscale+Alpha, 6: RGBA (32-bit with alpha)
  const hasAlpha = colorType === 4 || colorType === 6;
  return { width, height, bitDepth, colorType, hasAlpha };
}

const specs = [
  { file: 'screenshot-1-dashboard.png', expectedW: 1280, expectedH: 800 },
  { file: 'screenshot-2-editor.png', expectedW: 1280, expectedH: 800 },
  { file: 'screenshot-3-newtab-atmosphere.png', expectedW: 1280, expectedH: 800 },
  { file: 'screenshot-4-newtab-terminal.png', expectedW: 1280, expectedH: 800 },
  { file: 'screenshot-5-newtab-links.png', expectedW: 1280, expectedH: 800 },
  { file: 'small-promo-tile-440x280.png', expectedW: 440, expectedH: 280 },
  { file: 'marquee-promo-tile-1400x560.png', expectedW: 1400, expectedH: 560 },
];

let allPass = true;
console.log('--- Verifying Chrome Web Store 24-bit PNG Assets ---');
for (const s of specs) {
  const p = path.join(outDir, s.file);
  if (!fs.existsSync(p)) {
    console.error(`FAIL: Missing ${s.file}`);
    allPass = false;
    continue;
  }
  const buf = fs.readFileSync(p);
  const stat = fs.statSync(p);
  const info = parsePngHeader(buf);

  const dimMatch = info.width === s.expectedW && info.height === s.expectedH;
  const alphaOk = !info.hasAlpha && info.colorType === 2;

  if (dimMatch && alphaOk) {
    console.log(`PASS: ${s.file.padEnd(36)} -> ${info.width}x${info.height} | ColorType: 2 (24-bit RGB, No Alpha) | Size: ${(stat.size / 1024).toFixed(1)} KB`);
  } else {
    console.error(`FAIL: ${s.file} -> Expected ${s.expectedW}x${s.expectedH}, got ${info.width}x${info.height}, ColorType: ${info.colorType}`);
    allPass = false;
  }
}

if (allPass) {
  console.log('\nALL STORE ASSETS STRICTLY VERIFIED (24-bit PNG, zero alpha).');
} else {
  process.exit(1);
}
