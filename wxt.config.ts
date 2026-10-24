import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  vite: () => ({
    build: {
      chunkSizeWarningLimit: 700,
    },
  }),
  manifest: {
    name: 'WYNTab',
    description: 'Write Your NewTab, lets you replace the default new tab page with your own custom HTML',
    action: {
      default_title: 'Open WYNTab Dashboard',
    },
    permissions: ['tabs', 'storage', 'unlimitedStorage'],
    icons: {
      '16': 'icon/16.png',
      '32': 'icon/32.png',
      '48': 'icon/48.png',
      '96': 'icon/96.png',
      '128': 'icon/128.png',
    },
    sandbox: {
      pages: ['sandbox.html'],
    },
    content_security_policy: {
      sandbox:
        "sandbox allow-scripts allow-forms allow-popups allow-modals; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://cdn.tailwindcss.com;",
    },
  },
});
