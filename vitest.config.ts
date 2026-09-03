import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          disableIframePageLoading: true,
          handleDisabledFileLoadingAsSuccess: true,
          navigation: {
            disableChildFrameNavigation: true,
            disableChildPageNavigation: true,
          },
        },
      },
    },
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
