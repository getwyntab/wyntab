import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import {
  ArrowLeft, Save, RotateCcw,
  Sun, Moon, CheckCircle2,
  AlertCircle, RotateCw, Maximize2, Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Template } from '@/lib/templates'

const Editor = lazy(() => import('@/components/Editor'))

interface TemplateEditorProps {
  template: Template
  isActive: boolean
  onBack: () => void
  onSave: (name: string, html: string) => Promise<void>
  onSetActive: () => Promise<void>
  darkMode: boolean
  onToggleTheme: () => void
  onRequestDiscard: () => void
}

export function TemplateEditor({
  template,
  isActive,
  onBack,
  onSave,
  onSetActive,
  darkMode,
  onToggleTheme,
  onRequestDiscard,
}: TemplateEditorProps) {
  const [title, setTitle] = useState(template.name)
  const [code, setCode] = useState(template.html)
  const [initialTitle, setInitialTitle] = useState(template.name)
  const [initialCode, setInitialCode] = useState(template.html)

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
        {/* Left: Back to Library */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="h-8 px-2.5 rounded-md bg-bg-a2 hover:bg-bg-a4 border border-divider-dim hover:border-divider-bright text-text-primary text-[12px] font-medium flex items-center gap-1.5 transition-colors"
            title="Return to Library"
          >
            <ArrowLeft size={14} />
            <span>Library</span>
          </button>
        </div>

        {/* Center: Title input + Custom badge + Unsaved indicator */}
        <div className="flex items-center gap-2 max-w-md w-full justify-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-bg-a2/80 hover:bg-bg-a2 focus:bg-bg-a2 border border-divider-dim focus:border-accent-main rounded-md px-2.5 py-1 text-[13px] font-semibold text-text-primary outline-none transition-colors text-center truncate max-w-xs"
            placeholder="Template Name"
            title="Click to rename template"
          />
          <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg-accent-dark text-accent-bright border border-accent-dim/40 shrink-0">
            Custom
          </span>
          {isDirty && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-accent-bright shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-pulse" />
              <span>Unsaved</span>
            </span>
          )}
        </div>

        {/* Right: Actions (Discard, Save, Set Active, Theme) */}
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

          {isActive ? (
            <span className="h-8 px-3 rounded-md bg-bg-accent-bright text-accent-bright border border-accent-main/40 text-[12px] font-semibold flex items-center gap-1.5 select-none">
              <CheckCircle2 size={13} />
              <span>Active Tab</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={async () => {
                await handleSave()
                await onSetActive()
              }}
              className="h-8 px-3 rounded-md bg-bg-a2 hover:bg-bg-a4 border border-divider-dim hover:border-divider-bright text-text-primary text-[12px] font-semibold transition-colors"
              title="Save and set this template as globally active"
            >
              Set Active
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            className="h-8 w-8 rounded-md bg-bg-a2 hover:bg-bg-a4 border border-divider-dim text-text-muted hover:text-text-primary flex items-center justify-center transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={14} className="text-accent-bright" /> : <Moon size={14} className="text-accent-main" />}
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
            <div className="flex items-center gap-1.5 group relative">
              <span className="text-[11px] text-text-subtle font-mono">HTML & CSS</span>
              <div
                className="cursor-help flex items-center text-danger-main hover:opacity-80"
                title="HTML & CSS only. Scripts and event handlers are blocked for extension security."
              >
                <AlertCircle size={13} />
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
              <span className="w-2 h-2 rounded-full bg-success-main" />
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
              key={previewKey}
              srcDoc={debouncedHtml}
              className={cn(
                "w-full h-full border-none bg-black",
                isDragging && "pointer-events-none"
              )}
              title="Live Template Preview"
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

