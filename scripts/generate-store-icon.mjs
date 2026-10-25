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

  // Chrome Web Store Store Icon: 128x128 Canvas, 96x96 artwork, 16px transparent padding
  const iconHtml = `
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
          border-radius: 22px;
          background: #1C1D21;
          border: 1px solid #383B44;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
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

  await page.setContent(iconHtml);
  await new Promise(r => setTimeout(r, 300));
  
  const destPath = path.join(outDir, 'store-icon-128x128.png');
  await page.screenshot({
    path: destPath,
    type: 'png',
    omitBackground: true // ensures 16px padding remains transparent per CWS guidelines
  });

  console.log('Generated store icon:', destPath);
  await browser.close();
}

main().catch(console.error);
