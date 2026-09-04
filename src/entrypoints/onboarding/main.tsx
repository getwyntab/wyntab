import { createRoot } from 'react-dom/client'
import { ArrowRight, Library, Code2, RefreshCw } from 'lucide-react'
import '@/assets/tailwind.css'

export function Onboarding() {
  const openDashboard = () => {
    if (typeof browser !== 'undefined' && browser.tabs?.create) {
      browser.tabs.create({ url: browser.runtime.getURL('/dashboard.html') })
    }
    if (typeof window !== 'undefined' && window.close) {
      window.close()
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-xs">
            <img src="/icon/128.png" className="w-8 h-8 brightness-0 invert dark:invert-0" alt="WYNTab" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">WYNTab</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Write Your NewTab</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3 text-left">
          <div className="p-3.5 rounded-lg border border-border bg-card flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0 mt-0.5">
              <Library size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Built-in Gallery</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Choose from clean, distraction-free minimalist starter templates.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-card flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0 mt-0.5">
              <Code2 size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Custom HTML & CSS</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Upload your own HTML file or write code live with the built-in editor.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-card flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0 mt-0.5">
              <RefreshCw size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Instant Live Sync</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Your active template updates across every new tab in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
            data-testid="get-started-btn"
            onClick={openDashboard}
            className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            Get Started
            <ArrowRight size={16} />
          </button>
          <p className="text-xs text-muted-foreground">
            Click the extension icon anytime to manage templates
          </p>
        </div>
      </div>
    </div>
  )
}

const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(<Onboarding />)
}
