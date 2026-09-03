export const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Template</title>
  <style>
    :root {
      --bg: #0a0a0a;
      --fg: #ffffff;
      --accent: #3b82f6;
    }
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      color: var(--fg);
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center;
    }
    .container {
      padding: 2rem;
      border-radius: 2rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    h1 {
      font-size: 4rem;
      font-weight: 900;
      letter-spacing: -0.05em;
      margin: 0;
      background: linear-gradient(to bottom right, #fff, #666);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }
    .accent { color: var(--accent); }
  </style>
</head>
<body>
  <div class="container">
    <h1>WYN<span class="accent">Tab</span></h1>
    <p>Your journey begins here</p>
  </div>
</body>
</html>`
