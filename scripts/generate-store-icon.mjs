import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.resolve(rootDir, '.output/cws-assets');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const logoBase64 = fs.readFileSync(path.resolve(rootDir, 'public/icon/128.png')).toString('base64');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    defaultViewport: { width: 128, height: 128 }
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 128, height: 128, deviceScaleFactor: 1 });

  // 100% Google CWS Compliant:
  // - 128x128 Total Canvas (PNG with transparency)
  // - 96x96 Artwork Size in center
  // - Exactly 16px transparent padding on all 4 sides (16 + 96 + 16 = 128)
  // - ZERO drop shadow (prevents dirty alpha halo and conflicts with CWS automatic shadow)
  // - Crisp 1px #373737 structural border and #161616 dark surface
  const storeIconHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 128px;
          height: 128px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .icon-tile {
          width: 96px;
          height: 96px;
          border-radius: 18px;
          background: #161616;
          border: 1px solid #373737;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-tile img {
          width: 64px;
          height: 64px;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <div class="icon-tile">
        <img src="data:image/png;base64,${logoBase64}" alt="WYNTab" />
      </div>
    </body>
    </html>
  `;

  await page.setContent(storeIconHtml);
  await new Promise(r => setTimeout(r, 200));
  
  const destPath = path.join(outDir, 'store-icon-128x128.png');
  await page.screenshot({
    path: destPath,
    type: 'png',
    omitBackground: true
  });

  console.log('Generated strictly compliant store-icon-128x128.png');
  await browser.close();
}

main().catch(console.error);
