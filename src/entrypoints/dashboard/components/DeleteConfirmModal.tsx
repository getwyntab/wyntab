import { AlertTriangle, Trash2, X } from 'lucide-react'
import { type Template } from '@/lib/templates'

interface DeleteConfirmModalProps {
  template: Template
  isActive: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  template,
  isActive,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-bg-a1 border border-divider-bright rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="h-12 px-4 border-b border-divider-dim flex items-center justify-between">
          <div className="flex items-center gap-2 text-danger-main">
            <Trash2 size={16} />
            <h3 className="text-[13px] font-semibold text-text-primary">Delete Custom Template</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="h-7 w-7 rounded flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-a4 transition-colors"
            title="Cancel"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-text-primary font-semibold">"{template.name}"</strong>? This action cannot be undone.
          </p>

          {/* Active Fallback Safeguard Warning */}
          {isActive && (
            <div className="p-3.5 rounded-md bg-bg-accent-bright border border-accent-main/50 flex items-start gap-3">
              <AlertTriangle size={18} className="text-accent-bright shrink-0 mt-0.5" />
              <div className="text-[12px] space-y-0.5">
                <span className="font-semibold text-accent-bright block">Active Template Notice</span>
                <p className="text-text-primary leading-normal">
                  This template is currently active. Deleting it will automatically revert your New Tab to the default built-in template (Minimal Clock).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="h-14 px-4 bg-bg-a2/40 border-t border-divider-dim flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 px-3.5 rounded-md text-[12px] font-medium text-text-muted hover:text-text-primary hover:bg-bg-a4 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-8 px-4 rounded-md bg-danger-main hover:bg-danger-main/90 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Trash2 size={13} />
            <span>Delete Template</span>
          </button>
        </div>
      </div>
    </div>
  )
}

