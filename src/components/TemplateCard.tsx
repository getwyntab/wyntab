import { useState, useEffect, useRef } from 'react'
import { Code2, Copy, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Template } from '@/lib/templates'

// ─── Thumbnail Skeleton ────────────────────────────────────────────────────────
export function ThumbnailSkeleton() {
  return (
    <div
      data-testid="thumbnail-skeleton"
      className="absolute inset-0 w-full h-full bg-bg-b1 flex flex-col items-center justify-center p-4 overflow-hidden select-none"
    >
      {/* Wireframe Placeholders for clean NewTab page */}
      <div className="w-16 h-3.5 rounded bg-bg-a3 mb-1.5" />
      <div className="w-10 h-1.5 rounded-full bg-bg-a2 mb-3.5" />
      <div className="w-32 h-4 rounded-full bg-bg-a2 border border-divider-dim/60 mb-2.5" />
      <div className="flex gap-1.5">
        <div className="w-3.5 h-3.5 rounded bg-bg-a3/80" />
        <div className="w-3.5 h-3.5 rounded bg-bg-a3/80" />
        <div className="w-3.5 h-3.5 rounded bg-bg-a3/80" />
      </div>

      {/* Smooth YouTube-like Shimmer Sweep */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />
    </div>
  )
}

// ─── Template Card Skeleton ───────────────────────────────────────────────────
export function TemplateCardSkeleton() {
  return (
    <div
      data-testid="template-card-skeleton"
      className="bg-bg-a2/40 border border-divider-dim rounded-md flex flex-col justify-between overflow-hidden w-full shadow-xs select-none"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-bg-b1 border-b border-divider-dim">
        <ThumbnailSkeleton />
      </div>
      <div className="p-3 pb-2 flex items-center justify-between gap-2">
        <div className="w-28 h-4 rounded bg-bg-a3" />
        <div className="w-12 h-3.5 rounded bg-bg-a3" />
      </div>
      <div className="px-3 py-2 border-t border-divider-dim flex items-center justify-between bg-bg-a2/40">
        <div className="w-14 h-4 rounded bg-bg-a3" />
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded bg-bg-a3" />
          <div className="w-5 h-5 rounded bg-bg-a3" />
        </div>
      </div>
    </div>
  )
}

// ─── Thumbnail Preview ─────────────────────────────────────────────────────────
function Thumbnail({ html }: { html?: string }) {
  const [loaded, setLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setLoaded(false)
    const handleMessage = (e: MessageEvent) => {
      if (e.source === iframeRef.current?.contentWindow && e.data?.type === 'PREVIEW_LOADED') {
        setLoaded(true)
      }
    }
    window.addEventListener('message', handleMessage)

    // Safety fallback: reveal after 1.8s even if network/offline
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 1800)

    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(timer)
    }
  }, [html])

  if (!html) {
    return (
      <div className="flex h-full w-full items-center justify-center text-text-muted text-[12px]">
        No Preview
      </div>
    )
  }

  const sandboxUrl = typeof browser !== 'undefined' && browser.runtime?.getURL
    ? browser.runtime.getURL('/sandbox.html')
    : '/sandbox.html'

  const styledHtml = `<style>html, body { overflow: hidden !important; scrollbar-width: none !important; -ms-overflow-style: none !important; pointer-events: none !important; cursor: default !important; user-select: none !important; } html::-webkit-scrollbar, body::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }</style>${html}`

  return (
    <div className="relative aspect-16/10 w-full overflow-hidden bg-bg-b1 border-b border-divider-dim">
      {/* Skeleton screen cross-fades out when ready */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300 pointer-events-none",
          loaded ? "opacity-0" : "opacity-100"
        )}
      >
        <ThumbnailSkeleton />
      </div>

      {/* Sandboxed iframe cross-fades in once loaded */}
      <iframe
        ref={iframeRef}
        key={html}
        src={sandboxUrl}
        onLoad={(e) => {
          e.currentTarget.contentWindow?.postMessage({ type: 'RUN', html: styledHtml }, '*')
        }}
        scrolling="no"
        loading="lazy"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          width: '400%',
          height: '400%',
          transform: 'scale(0.25)',
          transformOrigin: '0 0',
          backgroundColor: 'transparent',
        }}
        className={cn(
          "absolute inset-0 pointer-events-none border-none select-none transition-opacity duration-300 ease-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
        title="Template preview thumbnail"
        sandbox="allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  )
}

// ─── Template Card ────────────────────────────────────────────────────────────
interface TemplateCardProps {
  template: Template
  isActive: boolean
  onActivate: () => void
  onDeactivate: () => void
  onDuplicate: () => void
  onEditCode: () => void
  onDelete?: () => void
}

export function TemplateCard({
  template,
  isActive,
  onActivate,
  onDeactivate,
  onDuplicate,
  onEditCode,
  onDelete,
}: TemplateCardProps) {
  const handleToggle = () => {
    if (isActive) {
      onDeactivate()
    } else {
      onActivate()
    }
  }

  return (
    <div
      data-testid={`template-card-${template.id}`}
      className={cn(
        "bg-bg-a2/40 border rounded-md flex flex-col justify-between overflow-hidden transition-all duration-150 w-full shadow-xs",
        isActive
          ? "border-accent-main ring-1 ring-accent-main/30"
          : "border-divider-dim hover:border-divider-bright"
      )}
    >
      {/* 16:10 Visual Display Thumbnail (Non-interactive display only) */}
      <div className="select-none pointer-events-none">
        <Thumbnail html={template.html} />
      </div>

      {/* Title & Metadata Row */}
      <div className="p-3 pb-2 flex items-center justify-between gap-2">
        <h3
          className="text-[13px] font-semibold text-text-primary truncate"
          title={template.name}
        >
          {template.name}
        </h3>
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shrink-0",
            template.isBuiltin
              ? "bg-bg-a3 text-text-muted border border-divider-dim"
              : "bg-bg-accent-dark text-accent-bright border border-accent-dim/40"
          )}
        >
          {template.isBuiltin ? 'Built-in' : 'Custom'}
        </span>
      </div>

      {/* Violentmonkey Action Bar */}
      <div className="px-3 py-2 border-t border-divider-dim flex items-center justify-between bg-bg-a2/40">
        {/* Left: Activation Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={handleToggle}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          title={isActive ? "Active Tab (Click to untoggle and revert to default)" : "Click to activate"}
        >
          <div
            className={cn(
              "w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5",
              isActive ? "bg-accent-main" : "bg-bg-a4 border border-divider-bright"
            )}
          >
            <div
              className={cn(
                "w-3.5 h-3.5 rounded-full transition-transform duration-150",
                isActive
                  ? "translate-x-3.5 bg-text-on-accent"
                  : "translate-x-0 bg-text-muted"
              )}
            />
          </div>
          <span className={cn(
            "text-[11px] font-medium leading-none",
            isActive ? "text-accent-bright font-semibold" : "text-text-muted"
          )}>
            {isActive ? 'Active' : 'Activate'}
          </span>
        </button>

        {/* Right: Operational Icon Actions (Edit, Duplicate, Delete) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEditCode}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-a4 transition-colors"
            title={template.isBuiltin ? "Fork to Edit Code" : "Edit Code"}
            aria-label={template.isBuiltin ? "Fork to edit" : "Edit code"}
          >
            <Code2 size={14} />
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-a4 transition-colors"
            title="Duplicate Template"
            aria-label="Duplicate template"
          >
            <Copy size={14} />
          </button>

          {!template.isBuiltin && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1 rounded text-text-muted hover:text-danger-main hover:bg-danger-bg transition-colors"
              title="Delete Template"
              aria-label="Delete template"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
