import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.resolve(rootDir, '.output/yt-assets');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const logoBase64 = fs.readFileSync(path.resolve(rootDir, 'public/icon/128.png')).toString('base64');
const dashSsPath = path.resolve(rootDir, '.output/cws-assets/screenshot-1-dashboard.png');
const dashSsBase64 = fs.existsSync(dashSsPath) ? fs.readFileSync(dashSsPath).toString('base64') : '';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false
  });

  try {
    // -------------------------------------------------------------
    // 1. YouTube Avatar (800x800) - Designed specifically for circle crop
    // -------------------------------------------------------------
    console.log('[1/2] Generating YouTube Avatar (800x800)...');
    const pAvatar = await browser.newPage();
    await pAvatar.setViewport({ width: 800, height: 800, deviceScaleFactor: 1 });

    const avatarHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 800px;
            height: 800px;
            background: #161616;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          /* Circular container safe zone */
          .circle-bg {
            width: 760px;
            height: 760px;
            border-radius: 50%;
            background: #1C1D21;
            border: 4px solid #32353E;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .circle-bg img {
            width: 480px;
            height: 480px;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <div class="circle-bg">
          <img src="data:image/png;base64,${logoBase64}" alt="WYNTab" />
        </div>
      </body>
      </html>
    `;
    await pAvatar.setContent(avatarHtml);
    await new Promise(r => setTimeout(r, 300));
    const avatarDest = path.join(outDir, 'yt-avatar-800x800.png');
    await pAvatar.screenshot({ path: avatarDest, type: 'png' });
    await pAvatar.close();
    console.log('Saved avatar to:', avatarDest);

    // -------------------------------------------------------------
    // 2. YouTube Banner (2560x1440) - Safe Area: 1546x423 centered
    // -------------------------------------------------------------
    console.log('[2/2] Generating YouTube Banner (2560x1440)...');
    const pBanner = await browser.newPage();
    await pBanner.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });

    // YouTube Banner layout:
    // Full Canvas: 2560 x 1440
    // Center Safe Zone: X = (2560 - 1546)/2 = 507, Y = (1440 - 423)/2 = 508.
    const bannerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 2560px;
            height: 1440px;
            background: #121316;
            color: #EAEAEA;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Full horizontal strip visible on Desktop (2560 x 423) */
          .desktop-strip {
            position: absolute;
            top: 508px;
            left: 0;
            width: 2560px;
            height: 423px;
            background: #18191E;
            border-top: 1px solid #2B2E37;
            border-bottom: 1px solid #2B2E37;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* All-device Safe Zone: exactly 1546 x 423 centered */
          .safe-zone {
            width: 1546px;
            height: 423px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            position: relative;
          }
          .left-block {
            flex: 0 0 780px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .brand-row {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
          }
          .logo-badge {
            width: 52px;
            height: 52px;
            border-radius: 12px;
            background: #222329;
            border: 1px solid #373A44;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo-badge img {
            width: 36px;
            height: 36px;
            object-fit: contain;
          }
          .brand-title {
            font-size: 32px;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: -0.02em;
          }
          .tagline-badge {
            font-size: 13px;
            font-weight: 700;
            color: #022C22;
            background: #10B981;
            padding: 4px 10px;
            border-radius: 9999px;
            letter-spacing: 0.03em;
            text-transform: uppercase;
          }
          .headline {
            font-size: 40px;
            font-weight: 800;
            line-height: 1.15;
            color: #FFFFFF;
            letter-spacing: -0.03em;
            margin-bottom: 14px;
          }
          .headline span.accent {
            color: #10B981;
          }
          .subtext {
            font-size: 16px;
            color: #9CA3AF;
            line-height: 1.5;
            margin-bottom: 22px;
            max-width: 720px;
          }
          .pills-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 14px;
            border-radius: 6px;
            background: #20222A;
            border: 1px solid #323642;
            font-size: 13px;
            font-weight: 600;
            color: #EAEAEA;
          }
          .pill .dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #10B981;
          }

          /* Right preview window in safe zone */
          .right-block {
            flex: 0 0 620px;
            height: 350px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .mock-window {
            width: 600px;
            height: 330px;
            background: #16181F;
            border-radius: 10px;
            border: 1px solid #323644;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .mock-titlebar {
            height: 30px;
            background: #1C1E26;
            border-bottom: 1px solid #2B2E3B;
            display: flex;
            align-items: center;
            padding: 0 12px;
            gap: 6px;
          }
          .dot-red { width: 8px; height: 8px; border-radius: 50%; background: #EF4444; }
          .dot-yellow { width: 8px; height: 8px; border-radius: 50%; background: #F59E0B; }
          .dot-green { width: 8px; height: 8px; border-radius: 50%; background: #10B981; }
          .mock-tab {
            margin-left: 8px;
            background: #16181F;
            border-radius: 4px 4px 0 0;
            padding: 3px 12px;
            font-size: 11px;
            font-weight: 600;
            color: #9CA3AF;
            border-top: 1px solid #2B2E3B;
            border-left: 1px solid #2B2E3B;
            border-right: 1px solid #2B2E3B;
          }
          .mock-body {
            flex: 1;
            background: #090909;
            overflow: hidden;
          }
          .mock-body img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top left;
          }
        </style>
      </head>
      <body>
        <div class="desktop-strip">
          <div class="safe-zone">
            <div class="left-block">
              <div class="brand-row">
                <div class="logo-badge">
                  <img src="data:image/png;base64,${logoBase64}" alt="WYNTab" />
                </div>
                <div class="brand-title">WYNTab</div>
                <div class="tagline-badge">Write Your NewTab</div>
              </div>

              <h1 class="headline">Your New Tab,<br>Exactly <span class="accent">How You Want It.</span></h1>
              
              <p class="subtext">
                Replace default browser clutter with custom HTML, CSS & React templates. In-browser editor, instant rendering, 100% offline.
              </p>

              <div class="pills-row">
                <div class="pill"><span class="dot"></span>CodeMirror 6 Editor</div>
                <div class="pill"><span class="dot"></span>5 Built-in Presets</div>
                <div class="pill"><span class="dot"></span>Zero External Bloat</div>
              </div>
            </div>

            <div class="right-block">
              <div class="mock-window">
                <div class="mock-titlebar">
                  <div class="dot-red"></div>
                  <div class="dot-yellow"></div>
                  <div class="dot-green"></div>
                  <div class="mock-tab">WYNTab — Dashboard</div>
                </div>
                <div class="mock-body">
                  <img src="data:image/png;base64,${dashSsBase64}" alt="Dashboard Mockup" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    await pBanner.setContent(bannerHtml);
    await new Promise(r => setTimeout(r, 400));
    const bannerDest = path.join(outDir, 'yt-banner-2560x1440.png');
    await pBanner.screenshot({ path: bannerDest, type: 'png' });
    await pBanner.close();
    console.log('Saved banner to:', bannerDest);

  } finally {
    await browser.close();
  }
}

main().catch(console.error);
