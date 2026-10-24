import { AlertCircle, Save, RotateCcw, X } from 'lucide-react'

interface UnsavedModalProps {
  onSaveAndLeave: () => void
  onDiscardAndLeave: () => void
  onCancel: () => void
}

export function UnsavedModal({
  onSaveAndLeave,
  onDiscardAndLeave,
  onCancel,
}: UnsavedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-bg-a1 border border-divider-bright rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="h-12 px-4 border-b border-divider-dim flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent-bright">
            <AlertCircle size={16} />
            <h3 className="text-[13px] font-semibold text-text-primary">Unsaved Edits</h3>
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
        <div className="p-5">
          <p className="text-[13px] text-text-secondary leading-relaxed">
            You have unsaved changes in this template. If you leave without saving, all draft changes will be lost.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="h-14 px-4 bg-bg-a2/40 border-t border-divider-dim flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 px-3 rounded-md text-[12px] font-medium text-text-muted hover:text-text-primary hover:bg-bg-a4 transition-colors"
          >
            Stay Here
          </button>
          <button
            type="button"
            onClick={onDiscardAndLeave}
            className="h-8 px-3 rounded-md text-[12px] font-medium text-danger-main hover:bg-danger-bg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Discard & Leave</span>
          </button>
          <button
            type="button"
            onClick={onSaveAndLeave}
            className="h-8 px-3.5 rounded-md bg-accent-main hover:bg-accent-bright text-text-on-accent text-[12px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Save size={13} />
            <span>Save & Leave</span>
          </button>
        </div>
      </div>
    </div>
  )
}

