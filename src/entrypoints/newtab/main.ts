import { activeTemplateHtml } from '@/lib/storage'

function render(html: string | null) {
  const root = document.getElementById('root') ?? document.body

  if (!html) {
    root.innerHTML = `
      <div style="min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #111; color: #555; font-family: system-ui, sans-serif; text-align: center; gap: 0.75rem;">
        <span style="font-size: 1.2rem; color: #777;">WYNTab</span>
        <span style="font-size: 0.85rem;">Click the extension icon to pick a builtin.</span>
      </div>
    `
    return
  }

  const iframe = document.createElement('iframe')
  iframe.srcdoc = html
  iframe.style.width = '100vw'
  iframe.style.height = '100vh'
  iframe.style.border = 'none'
  iframe.style.display = 'block'
  iframe.title = 'New tab'
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms')

  root.replaceChildren(iframe)
}

// Initial paint
activeTemplateHtml.getValue().then((stored) => {
  render(stored || null)
})

// React dynamically if active template changes in dashboard
activeTemplateHtml.watch((newHtml) => {
  render(newHtml || null)
})
