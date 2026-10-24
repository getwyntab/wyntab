import { activeTemplateHtml, activeTemplateId } from '@/lib/storage'

let activeIframe: HTMLIFrameElement | null = null
let currentTemplateId = ''
let fallbackTimer: ReturnType<typeof setTimeout> | null = null

function revealIframe(target: HTMLIFrameElement) {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }

  // Fade out ambient loader elements cleanly
  const bar = document.getElementById('loader-bar')
  const ambient = document.getElementById('loader-ambient')
  if (bar) bar.style.opacity = '0'
  if (ambient) ambient.style.opacity = '0'
  setTimeout(() => {
    bar?.remove()
    ambient?.remove()
  }, 400)

  if (activeIframe === target) {
    target.style.opacity = '1'
    target.style.transform = 'scale(1)'
  }
}

function render(html: string | null, templateId: string) {
  const root = document.getElementById('root') ?? document.body
  currentTemplateId = templateId

  if (fallbackTimer) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }

  if (!html) {
    document.getElementById('loader-bar')?.remove()
    document.getElementById('loader-ambient')?.remove()
    root.innerHTML = `
      <div style="min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #111; color: #555; font-family: system-ui, sans-serif; text-align: center; gap: 0.75rem;">
        <span style="font-size: 1.2rem; color: #777;">WYNTab</span>
        <span style="font-size: 0.85rem;">Click the extension icon to pick a builtin.</span>
      </div>
    `
    activeIframe = null
    return
  }

  const iframe = document.createElement('iframe')
  iframe.src = browser.runtime.getURL('/sandbox.html')
  iframe.style.width = '100vw'
  iframe.style.height = '100vh'
  iframe.style.border = 'none'
  iframe.style.display = 'block'
  iframe.style.backgroundColor = '#090909'
  iframe.style.colorScheme = 'dark'
  iframe.style.opacity = '0'
  iframe.style.transform = 'scale(0.992)'
  iframe.style.transition = 'opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), transform 320ms cubic-bezier(0.16, 1, 0.3, 1)'
  iframe.style.willChange = 'opacity, transform'
  iframe.title = 'New tab'
  iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-modals')

  iframe.onload = () => {
    iframe.contentWindow?.postMessage({ type: 'RUN', html }, '*')
  }

  // Graceful fallback: smoothly reveal after 600ms if scriptless or slow CDN
  fallbackTimer = setTimeout(() => revealIframe(iframe), 600)

  activeIframe = iframe
  root.replaceChildren(iframe)
}

// Smooth reveal once sandboxed template finishes mounting
window.addEventListener('message', (e) => {
  if (e.source === activeIframe?.contentWindow && e.data?.type === 'PREVIEW_LOADED' && activeIframe) {
    revealIframe(activeIframe)
  }
})

// Storage bridge for wyntab.get / wyntab.set / wyntab.remove
window.addEventListener('message', async (e) => {
  if (!activeIframe || e.source !== activeIframe.contentWindow || !e.data?.wyntab) return
  const { id, op, key, value } = e.data
  const k = `tpl:${currentTemplateId}:${key}`
  let result: any
  try {
    if (op === 'set') {
      await browser.storage.local.set({ [k]: value })
    } else if (op === 'remove') {
      await browser.storage.local.remove(k)
    } else {
      const stored = await browser.storage.local.get(k)
      result = stored[k]
    }
  } catch (err: any) {
    result = { error: err?.message || String(err) }
  }
  activeIframe.contentWindow?.postMessage({ id, result }, '*')
})

// Initial paint
Promise.all([activeTemplateHtml.getValue(), activeTemplateId.getValue()]).then(
  ([storedHtml, storedId]) => {
    render(storedHtml || null, storedId || '')
  }
)

// React dynamically if active template changes in dashboard
activeTemplateHtml.watch(async (newHtml) => {
  const id = await activeTemplateId.getValue()
  render(newHtml || null, id || '')
})

activeTemplateId.watch(async (newId) => {
  const html = await activeTemplateHtml.getValue()
  render(html || null, newId || '')
})
