import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import {
  ArrowLeft, Save, RotateCcw,
  RotateCw, Maximize2, Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Template } from '@/lib/templates'

const Editor = lazy(() => import('@/components/Editor'))

interface TemplateEditorProps {
  template: Template
  onBack: () => void
  onSave: (name: string, html: string) => Promise<void>
  darkMode: boolean
  onRequestDiscard: () => void
}

export function TemplateEditor({
  template,
  onBack,
  onSave,
  darkMode,
  onRequestDiscard,
}: TemplateEditorProps) {
  const [title, setTitle] = useState(template.name)
  const [code, setCode] = useState(template.html)
  const [initialTitle, setInitialTitle] = useState(template.name)
  const [initialCode, setInitialCode] = useState(template.html)
  const [showJsInfo, setShowJsInfo] = useState(false)
  const jsInfoRef = useRef<HTMLDivElement>(null)

  // Splitter ratio (percentage for left pane)
  const [splitRatio, setSplitRatio] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('wyntab-editor-split')
      return saved ? Math.min(80, Math.max(20, parseFloat(saved))) : 50
    } catch {
      return 50
    }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isMaximizedPreview, setIsMaximizedPreview] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  // Debounced live preview HTML
  const [debouncedHtml, setDebouncedHtml] = useState(template.html)

  // Unsaved dirty check
  const isDirty = title !== initialTitle || code !== initialCode

  // Debounce live preview render
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHtml(code)
    }, 150)
    return () => clearTimeout(timer)
  }, [code])

  const previewIframeRef = useRef<HTMLIFrameElement>(null)

  // Reload sandbox runner when code debounces or restarts
  useEffect(() => {
    const iframe = previewIframeRef.current
    if (!iframe) return
    const handleLoad = () => {
      iframe.contentWindow?.postMessage({ type: 'RUN', html: debouncedHtml }, '*')
    }
    iframe.addEventListener('load', handleLoad, { once: true })
    const sandboxUrl = typeof browser !== 'undefined' && browser.runtime?.getURL
      ? browser.runtime.getURL('/sandbox.html')
      : '/sandbox.html'
    iframe.src = sandboxUrl
  }, [debouncedHtml, previewKey])

  // wyn storage bridge in editor preview
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      const iframe = previewIframeRef.current
      if (!iframe || e.source !== iframe.contentWindow || !e.data?.wyn) return
      const { id, op, key, value } = e.data
      const k = `tpl:preview:${template.id}:${key}`
      let result: any
      try {
        if (typeof browser !== 'undefined' && browser.storage?.local) {
          if (op === 'set') {
            await browser.storage.local.set({ [k]: value })
          } else if (op === 'remove') {
            await browser.storage.local.remove(k)
          } else {
            const stored = await browser.storage.local.get(k)
            result = stored[k]
          }
        }
      } catch (err: any) {
        result = { error: err?.message || String(err) }
      }
      iframe.contentWindow?.postMessage({ id, result }, '*')
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [template.id])

  // Attach window beforeunload guard when dirty
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Dismiss JS info popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (jsInfoRef.current && !jsInfoRef.current.contains(e.target as Node)) {
        setShowJsInfo(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Splitter dragging logic
  useEffect(() => {
    if (!isDragging) return

    function handleMouseMove(e: MouseEvent) {
      const containerWidth = window.innerWidth
      const newRatio = (e.clientX / containerWidth) * 100
      // Clamp ratio so min width 320px is respected
      const minRatio = (320 / containerWidth) * 100
      const maxRatio = ((containerWidth - 320) / containerWidth) * 100
      const clamped = Math.min(Math.max(newRatio, minRatio), maxRatio)
      setSplitRatio(clamped)
      try {
        localStorage.setItem('wyntab-editor-split', clamped.toFixed(1))
      } catch {
        // storage disabled fallback
      }
    }

    function handleMouseUp() {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Keyboard shortcut Ctrl/Cmd + S
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [title, code])

  async function handleSave() {
    await onSave(title, code)
    setInitialTitle(title)
    setInitialCode(code)
  }

  function handleDiscard() {
    if (confirm('Discard all unsaved changes in this template?')) {
      setTitle(initialTitle)
      setCode(initialCode)
      onRequestDiscard()
    }
  }

  // Calculate cursor/line counts
  const linesCount = code.split('\n').length
  const charsCount = code.length

  return (
    <div className="h-screen w-screen bg-bg-b1 text-text-primary flex flex-col font-sans overflow-hidden select-none">
      {/* Unified 56px Top Header Bar */}
      <header className="h-14 px-4 border-b border-divider-dim bg-bg-b1 flex items-center justify-between shrink-0 z-20">
        {/* Left Zone: Breadcrumb (Library / Custom / Title) + Unsaved */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={onBack}
            className="h-8 px-2.5 rounded-md bg-bg-a2 hover:bg-bg-a4 border border-divider-dim hover:border-divider-bright text-text-primary text-[12px] font-medium flex items-center gap-1.5 transition-colors shrink-0"
            title="Return to Library"
          >
            <ArrowLeft size={14} />
            <span>Library</span>
          </button>

          <span className="text-divider-bright select-none shrink-0 text-[12px]">/</span>

          <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg-accent-dark text-accent-bright border border-accent-dim/40 shrink-0 select-none">
            Custom
          </span>

          <span className="text-divider-bright select-none shrink-0 text-[12px]">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent hover:bg-bg-a2 focus:bg-bg-a2 border border-transparent hover:border-divider-dim focus:border-accent-main rounded-md px-2 py-1 text-[13px] font-semibold text-text-primary outline-none transition-all text-left truncate w-56 focus:w-72"
              placeholder="Template Name"
              title="Click to rename template"
            />
            {isDirty && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-accent-bright shrink-0 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-pulse" />
                <span>Unsaved</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Zone: Actions (Discard, Save) */}
        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="h-8 px-2.5 rounded-md text-[12px] font-medium text-text-muted hover:text-danger-main hover:bg-danger-bg transition-colors flex items-center gap-1"
              title="Discard all unsaved edits"
            >
              <RotateCcw size={13} />
              <span>Discard</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="h-8 px-3 rounded-md bg-accent-main hover:bg-accent-bright text-text-on-accent text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Save changes (Cmd/Ctrl + S)"
          >
            <Save size={13} />
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* Split Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pane: Code Editor */}
        <div
          style={{ width: isMaximizedPreview ? '0%' : `${splitRatio}%`, display: isMaximizedPreview ? 'none' : 'flex' }}
          className="flex-col h-full bg-bg-b2 border-r border-divider-dim overflow-hidden select-text"
        >
          {/* Editor Header Strip (32px) */}
          <div className="h-8 px-3 bg-bg-a3 border-b border-divider-dim flex items-center justify-between shrink-0 select-none">
            <span className="text-[12px] font-mono text-text-secondary">index.html</span>
            <div ref={jsInfoRef} className="flex items-center gap-1.5 group relative">
              <span className="text-[12px] text-accent-bright font-mono">JS Sandbox</span>
              <button
                type="button"
                onClick={() => setShowJsInfo((prev) => !prev)}
                className="flex items-center text-text-muted hover:text-text-primary transition-colors cursor-pointer select-none focus:outline-none"
                aria-label="About JavaScript Sandbox"
              >
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg>
              </button>

              {/* Tooltip / Popover explaining why JS is disabled */}
              <div
                className={cn(
                  "absolute right-0 top-full mt-2 w-80 p-3.5 rounded-lg bg-bg-a1 border border-divider-bright shadow-2xl z-50 text-left transition-all duration-150 pointer-events-auto",
                  showJsInfo
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
                )}
              >
                <div className="flex items-center gap-1.5 text-accent-bright font-semibold text-[12px] mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-bright" />
                  <span>JavaScript & ESM Enabled</span>
                </div>
                <p className="text-[12px] leading-relaxed text-text-secondary mb-2.5">
                  Code executes inside Chrome's isolated sandbox. React, Vue, Preact, Tailwind, and ESM packages from esm.sh are loaded dynamically with zero boilerplate.
                </p>
                <div className="pt-2 border-t border-divider-dim flex items-center justify-between text-[12px] text-text-muted">
                  <span>Supported</span>
                  <span className="font-mono text-text-primary font-medium">React, Vue, ESM, Tailwind</span>
                </div>
              </div>
            </div>
          </div>

          {/* CodeMirror 6 Editor Container */}
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<div className="p-4 text-xs text-text-muted font-mono">Loading code editor...</div>}>
              <Editor
                value={code}
                onChange={setCode}
                darkMode={darkMode}
              />
            </Suspense>
          </div>

          {/* Editor Status Bar (28px) */}
          <div className="h-7 px-3 bg-bg-a2 border-t border-divider-dim flex items-center justify-between text-[11px] font-mono text-text-subtle shrink-0 select-none">
            <div className="flex items-center gap-3">
              <span>Lines: {linesCount}</span>
              <span>Chars: {charsCount}</span>
            </div>
            <span>UTF-8</span>
          </div>
        </div>

        {/* Draggable Divider (4px) */}
        {!isMaximizedPreview && (
          <div
            onMouseDown={() => setIsDragging(true)}
            onDoubleClick={() => setSplitRatio(50)}
            className="w-1 bg-divider-dim hover:bg-accent-main cursor-col-resize shrink-0 transition-colors z-10"
            title="Drag to resize pane width (Double click to reset to 50%)"
          />
        )}

        {/* Right Pane: Live Sandboxed Preview */}
        <div
          style={{ width: isMaximizedPreview ? '100%' : `${100 - splitRatio}%` }}
          className="flex-1 flex flex-col h-full bg-bg-b1 overflow-hidden"
        >
          {/* Preview Header Strip (32px) */}
          <div className="h-8 px-3 bg-bg-a3 border-b border-divider-dim flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-main" />
              <span className="text-[12px] font-medium text-text-secondary">Live Render</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPreviewKey((k) => k + 1)}
                className="h-6 px-2 rounded hover:bg-bg-a4 text-text-muted hover:text-text-primary text-[11px] flex items-center gap-1 transition-colors"
                title="Restart preview context & animations"
              >
                <RotateCw size={12} />
                <span>Restart</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMaximizedPreview(!isMaximizedPreview)}
                className="h-6 w-6 rounded hover:bg-bg-a4 text-text-muted hover:text-text-primary flex items-center justify-center transition-colors"
                title={isMaximizedPreview ? "Restore Split View" : "Maximize Preview (100% canvas)"}
              >
                {isMaximizedPreview ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
            </div>
          </div>

          {/* Sandboxed Iframe (pointer-events disabled during resize drag) */}
          <div className="flex-1 w-full h-full bg-bg-b2 overflow-hidden relative">
            <iframe
              ref={previewIframeRef}
              className={cn(
                "w-full h-full border-none bg-black",
                isDragging && "pointer-events-none"
              )}
              title="Live Template Preview"
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

