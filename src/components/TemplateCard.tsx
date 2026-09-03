import { useState, useEffect } from 'react'
import { Check, X, Pencil, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Template } from '@/lib/templates'

// ─── Thumbnail Preview ─────────────────────────────────────────────────────────
function Preview({ html }: { html?: string }) {
  if (!html) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs font-medium">
        No Preview
      </div>
    )
  }

  const styledHtml = `<style>html, body { overflow: hidden !important; pointer-events: none !important; cursor: default !important; user-select: none !important; }</style>${html}`

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted/40 border-b border-border">
      <iframe
        srcDoc={styledHtml}
        scrolling="no"
        className="absolute inset-0 h-[400%] w-[400%] origin-top-left scale-25 pointer-events-none border-none select-none"
        title="Preview"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  )
}

// ─── Template Card ────────────────────────────────────────────────────────────
interface TemplateCardProps {
  template: Template
  isActive: boolean
  onActivate: () => void
  onDelete?: () => void
  onRename?: (newName: string) => void
  onDuplicate: () => void
  onEditCode: () => void
  onPreview: () => void
}

export function TemplateCard({
  template,
  isActive,
  onActivate,
  onDelete,
  onRename,
  onDuplicate,
  onEditCode,
  onPreview,
}: TemplateCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(template.name)

  const handleRename = () => {
    if (editName.trim() && editName !== template.name && onRename) {
      onRename(editName.trim())
    }
    setIsEditing(false)
  }

  return (
    <div
      data-testid={`template-card-${template.id}`}
      className={cn(
        "bg-card border rounded-xl flex flex-col justify-between overflow-hidden transition-colors duration-150 shadow-xs",
        isActive
          ? "border-primary ring-1 ring-primary/40"
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      {/* Clickable Preview Area (Click to preview full screen) */}
      <div
        role="button"
        tabIndex={0}
        onClick={onPreview}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onPreview()
          }
        }}
        className="relative cursor-pointer group select-none"
        title={`Preview ${template.name} full screen`}
        aria-label={`Preview ${template.name} full screen`}
      >
        <Preview html={template.html} />
        {/* Subtle hover badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity bg-background/90 backdrop-blur-xs text-foreground text-[11px] font-medium px-2 py-0.5 rounded-md border border-border shadow-xs pointer-events-none">
          Click to Preview
        </div>
      </div>

      {/* Card Info & Primary Trigger */}
      <div className="p-3.5 flex flex-col gap-3 flex-1 justify-between">
        <div className="flex items-start justify-between gap-3">
          {/* Title and Badge */}
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename()
                    if (e.key === 'Escape') {
                      setIsEditing(false)
                      setEditName(template.name)
                    }
                  }}
                  className="w-full bg-muted border border-primary rounded-md px-2 py-1 text-xs font-medium outline-none"
                  aria-label="Rename template"
                />
                <button
                  type="button"
                  onClick={handleRename}
                  className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                  title="Save name"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-foreground truncate" title={template.name}>
                  {template.name}
                </h3>
                {!template.isBuiltin && onRename && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors shrink-0"
                    title="Rename template"
                    aria-label="Rename"
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            )}
            <span className="text-xs text-muted-foreground block mt-0.5">
              {template.isBuiltin ? 'Built-in template' : 'Custom template'}
            </span>
          </div>

          {/* Primary Action */}
          <div className="shrink-0">
            {isActive ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                <CheckCircle2 size={12} /> Active
              </span>
            ) : (
              <button
                type="button"
                onClick={onActivate}
                className="h-7 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Activate
              </button>
            )}
          </div>
        </div>

        {/* Minimal Plain Text Actions */}
        <div className="pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground mt-auto">
          {template.isBuiltin ? (
            <button
              type="button"
              onClick={onDuplicate}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Duplicate to customize
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onEditCode}
                className="hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                Edit HTML
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onDuplicate}
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                Duplicate
              </button>
              {onDelete && (
                <>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="text-destructive/80 hover:text-destructive transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
