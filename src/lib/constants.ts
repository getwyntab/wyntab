export const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Template</title>
  <style>
    :root {
      --bg: #09090b;
      --fg: #fafafa;
      --muted: #a1a1aa;
      --border: #27272a;
      --accent: #3b82f6;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      color: var(--fg);
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center;
      padding: 1.5rem;
    }
    .container {
      max-width: 480px;
      width: 100%;
      padding: 2.5rem 2rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #111113;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.2;
    }
    p {
      font-size: 0.95rem;
      color: var(--muted);
      margin-top: 0.75rem;
      line-height: 1.5;
    }
    .accent {
      color: var(--accent);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>WYN<span class="accent">Tab</span></h1>
    <p>Your custom new tab starts here. Edit HTML and CSS directly.</p>
  </div>
</body>
</html>`
