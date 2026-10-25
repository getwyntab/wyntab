import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const staticDir = path.resolve(rootDir, '.output/chrome-mv3');
const outDir = path.resolve(rootDir, '.output/cws-assets');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/dashboard.html';
  const filePath = path.join(staticDir, reqPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const builtinsDir = path.resolve(rootDir, 'src/builtins');
const atmosphereHtml = fs.readFileSync(path.join(builtinsDir, 'atmosphere.html'), 'utf8');
const terminalHtml = fs.readFileSync(path.join(builtinsDir, 'terminal.html'), 'utf8');
const linksHtml = fs.readFileSync(path.join(builtinsDir, 'links.html'), 'utf8');

// Brand logo
const logoBase64 = fs.readFileSync(path.resolve(rootDir, 'public/icon/128.png')).toString('base64');

async function setupPage(browser, width, height, initialStore = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  
  await page.evaluateOnNewDocument((initial) => {
    const store = Object.assign({
      'activeTemplateId': 'builtin-atmosphere',
      'activeTemplateHtml': '',
      'userTemplates': []
    }, initial);

    window.chrome = {
      runtime: {
        id: 'mock-wyntab',
        getURL: (p) => p
      },
      storage: {
        local: {
          get: (keys, cb) => {
            const res = {};
            const arr = Array.isArray(keys) ? keys : (typeof keys === 'string' ? [keys] : Object.keys(keys || {}));
            for (const k of arr) {
              if (store[k] !== undefined) res[k] = store[k];
            }
            if (cb) cb(res);
            return Promise.resolve(res);
          },
          set: (items, cb) => {
            Object.assign(store, items);
            if (cb) cb();
            return Promise.resolve();
          },
          remove: (keys, cb) => {
            const arr = Array.isArray(keys) ? keys : [keys];
            for (const k of arr) delete store[k];
            if (cb) cb();
            return Promise.resolve();
          }
        }
      }
    };
  }, initialStore);

  return page;
}

server.listen(4894, async () => {
  console.log('Capture server running on http://localhost:4894');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    // -------------------------------------------------------------
    // 1. Screenshot 1: Dashboard Overview (1280x800)
    // -------------------------------------------------------------
    console.log('[1/7] Capturing Screenshot 1: Dashboard Overview (1280x800)...');
    const p1 = await setupPage(browser, 1280, 800, {
      'activeTemplateId': 'builtin-atmosphere',
      'activeTemplateHtml': atmosphereHtml
    });
    await p1.goto('http://localhost:4894/dashboard.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await p1.screenshot({ path: path.join(outDir, 'screenshot-1-dashboard.png'), type: 'png' });
    await p1.close();

    // -------------------------------------------------------------
    // 2. Screenshot 2: In-Dashboard Code Editor (1280x800)
    // -------------------------------------------------------------
    console.log('[2/7] Capturing Screenshot 2: In-Dashboard Code Editor (1280x800)...');
    const p2 = await setupPage(browser, 1280, 800, {
      'activeTemplateId': 'builtin-atmosphere',
      'activeTemplateHtml': atmosphereHtml
    });
    await p2.goto('http://localhost:4894/dashboard.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    
    const editBtn = await p2.$('button[aria-label="Fork to edit"], button[title="Fork to Edit Code"], button[aria-label="Create blank template"]');
    if (editBtn) {
      await editBtn.click();
      await new Promise(r => setTimeout(r, 2000));
    }
    await p2.screenshot({ path: path.join(outDir, 'screenshot-2-editor.png'), type: 'png' });
    await p2.close();

    // -------------------------------------------------------------
    // 3. Screenshot 3: New Tab Atmosphere (1280x800)
    // -------------------------------------------------------------
    console.log('[3/7] Capturing Screenshot 3: New Tab Atmosphere (1280x800)...');
    const p3 = await setupPage(browser, 1280, 800, {
      'activeTemplateId': 'builtin-atmosphere',
      'activeTemplateHtml': atmosphereHtml
    });
    await p3.goto('http://localhost:4894/newtab.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await p3.screenshot({ path: path.join(outDir, 'screenshot-3-newtab-atmosphere.png'), type: 'png' });
    await p3.close();

    // -------------------------------------------------------------
    // 4. Screenshot 4: New Tab Terminal (1280x800)
    // -------------------------------------------------------------
    console.log('[4/7] Capturing Screenshot 4: New Tab Terminal (1280x800)...');
    const p4 = await setupPage(browser, 1280, 800, {
      'activeTemplateId': 'builtin-terminal',
      'activeTemplateHtml': terminalHtml
    });
    await p4.goto('http://localhost:4894/newtab.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await p4.screenshot({ path: path.join(outDir, 'screenshot-4-newtab-terminal.png'), type: 'png' });
    await p4.close();

    // -------------------------------------------------------------
    // 5. Screenshot 5: New Tab Links (1280x800)
    // -------------------------------------------------------------
    console.log('[5/7] Capturing Screenshot 5: New Tab Links (1280x800)...');
    const p5 = await setupPage(browser, 1280, 800, {
      'activeTemplateId': 'builtin-links',
      'activeTemplateHtml': linksHtml
    });
    await p5.goto('http://localhost:4894/newtab.html', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await p5.screenshot({ path: path.join(outDir, 'screenshot-5-newtab-links.png'), type: 'png' });
    await p5.close();

    // -------------------------------------------------------------
    // 6. Small Promo Tile (440x280) - Clean, utilitarian, NO artificial border lines
    // -------------------------------------------------------------
    console.log('[6/7] Generating Small Promo Tile (440x280)...');
    const pSmall = await browser.newPage();
    await pSmall.setViewport({ width: 440, height: 280, deviceScaleFactor: 1 });
    const smallTileHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 440px;
            height: 280px;
            background: #161616;
            color: #EAEAEA;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            user-select: none;
            border: 1px solid #2B2B2B;
          }
          .logo-box {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            background: #222222;
            border: 1px solid #373737;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .logo-img {
            width: 44px;
            height: 44px;
            object-fit: contain;
          }
          .title {
            font-size: 26px;
            font-weight: 700;
            color: #FFFFFF;
            line-height: 1.1;
            margin-bottom: 6px;
          }
          .subtitle {
            font-size: 13px;
            font-weight: 600;
            color: #10B981;
            margin-bottom: 16px;
          }
          .tag-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            border-radius: 6px;
            background: #1F1F1F;
            border: 1px solid #373737;
            font-size: 12px;
            font-weight: 400;
            color: #969696;
          }
          .tag-pill span.dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10B981;
          }
        </style>
      </head>
      <body>
        <div class="logo-box">
          <img class="logo-img" src="data:image/png;base64,${logoBase64}" alt="WYNTab" />
        </div>
        <div class="title">WYNTab</div>
        <div class="subtitle">Write Your NewTab</div>
        <div class="tag-pill">
          <span class="dot"></span>
          Custom HTML • Instant • 100% Offline
        </div>
      </body>
      </html>
    `;
    await pSmall.setContent(smallTileHtml);
    await new Promise(r => setTimeout(r, 400));
    await pSmall.screenshot({ path: path.join(outDir, 'small-promo-tile-440x280.png'), type: 'png' });
    await pSmall.close();

    // -------------------------------------------------------------
    // 7. Marquee Promo Tile (1400x560) - Clean layout, NO top beam line
    // -------------------------------------------------------------
    console.log('[7/7] Generating Marquee Promo Tile (1400x560)...');
    const pMarquee = await browser.newPage();
    await pMarquee.setViewport({ width: 1400, height: 560, deviceScaleFactor: 1 });
    
    const dashSsBase64 = fs.readFileSync(path.join(outDir, 'screenshot-1-dashboard.png')).toString('base64');

    const marqueeTileHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1400px;
            height: 560px;
            background: #161616;
            color: #EAEAEA;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            user-select: none;
            overflow: hidden;
            border: 1px solid #2B2B2B;
          }
          /* Left content column */
          .left-col {
            flex: 0 0 580px;
            padding: 64px 0 64px 64px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            z-index: 10;
          }
          .brand-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
          }
          .logo-badge {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            background: #222222;
            border: 1px solid #373737;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo-badge img {
            width: 30px;
            height: 30px;
            object-fit: contain;
          }
          .brand-name {
            font-size: 22px;
            font-weight: 700;
            color: #FFFFFF;
          }
          .brand-badge {
            font-size: 11px;
            font-weight: 600;
            color: #022C22;
            background: #10B981;
            padding: 3px 8px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .hero-headline {
            font-size: 38px;
            font-weight: 700;
            line-height: 1.2;
            color: #FFFFFF;
            margin-bottom: 16px;
          }
          .hero-headline span.accent {
            color: #10B981;
          }
          .hero-desc {
            font-size: 15px;
            line-height: 1.5;
            color: #969696;
            margin-bottom: 30px;
            max-width: 490px;
          }
          .pills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 12px;
            border-radius: 6px;
            background: #1F1F1F;
            border: 1px solid #373737;
            font-size: 12px;
            font-weight: 600;
            color: #EAEAEA;
          }
          .pill .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10B981;
          }

          /* Right preview mockup column */
          .right-col {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 30px;
          }
          .mockup-window {
            width: 820px;
            height: 500px;
            background: #222222;
            border-radius: 8px;
            border: 1px solid #373737;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .mockup-header {
            height: 36px;
            background: #1F1F1F;
            border-bottom: 1px solid #373737;
            display: flex;
            align-items: center;
            padding: 0 14px;
            gap: 8px;
          }
          .traffic-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }
          .dot-red { background: #DC2626; }
          .dot-yellow { background: #969696; }
          .dot-green { background: #10B981; }
          .mockup-tab {
            margin-left: 10px;
            background: #222222;
            border-radius: 4px 4px 0 0;
            padding: 4px 14px;
            font-size: 12px;
            font-weight: 500;
            color: #969696;
            border-top: 1px solid #373737;
            border-left: 1px solid #373737;
            border-right: 1px solid #373737;
          }
          .mockup-body {
            flex: 1;
            background: #161616;
            overflow: hidden;
          }
          .mockup-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top left;
          }
        </style>
      </head>
      <body>
        <div class="left-col">
          <div class="brand-row">
            <div class="logo-badge">
              <img src="data:image/png;base64,${logoBase64}" alt="WYNTab" />
            </div>
            <div class="brand-name">WYNTab</div>
            <div class="brand-badge">Manifest V3</div>
          </div>

          <h1 class="hero-headline">Your New Tab,<br>Exactly <span class="accent">How You Want It.</span></h1>
          
          <p class="hero-desc">
            Replace the default new tab with custom HTML, CSS & JavaScript. Built-in live code editor, 5 modern presets, instant rendering, 100% offline.
          </p>

          <div class="pills-grid">
            <div class="pill"><span class="dot"></span>Built-in Code Editor</div>
            <div class="pill"><span class="dot"></span>5 Modern Presets</div>
            <div class="pill"><span class="dot"></span>Zero External Bloat</div>
            <div class="pill"><span class="dot"></span>Instant Tab Load</div>
          </div>
        </div>

        <div class="right-col">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="traffic-dot dot-red"></div>
              <div class="traffic-dot dot-yellow"></div>
              <div class="traffic-dot dot-green"></div>
              <div class="mockup-tab">WYNTab — Dashboard</div>
            </div>
            <div class="mockup-body">
              <img class="mockup-img" src="data:image/png;base64,${dashSsBase64}" alt="Dashboard Mockup" />
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    await pMarquee.setContent(marqueeTileHtml);
    await new Promise(r => setTimeout(r, 400));
    await pMarquee.screenshot({ path: path.join(outDir, 'marquee-promo-tile-1400x560.png'), type: 'png' });
    await pMarquee.close();

    console.log('Finished capturing clean 24-bit PNG assets!');
  } finally {
    await browser.close();
    server.close();
  }
});
