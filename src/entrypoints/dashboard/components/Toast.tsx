import { CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastMessage {
  id: string
  msg: string
  ok: boolean
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none select-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-md bg-bg-a1 border border-divider-bright shadow-2xl text-[12px] font-medium text-text-primary transition-all animate-in fade-in slide-in-from-bottom-2 duration-150",
            t.ok ? "border-l-3 border-l-accent-main" : "border-l-3 border-l-danger-main"
          )}
          role="status"
        >
          {t.ok ? (
            <CheckCircle2 size={15} className="text-accent-main shrink-0" />
          ) : (
            <AlertCircle size={15} className="text-danger-main shrink-0" />
          )}
          <span className="truncate flex-1">{t.msg}</span>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="text-text-subtle hover:text-text-primary ml-1 text-[11px]"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

