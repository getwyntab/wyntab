import { useRef } from 'react'
import { Download, FileUp, Database, HardDrive } from 'lucide-react'

interface SettingsPageProps {
  customCount: number
  onExportBackup: () => void
  onImportBackup: (file: File) => void
}

export function SettingsPage({
  customCount,
  onExportBackup,
  onImportBackup,
}: SettingsPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (confirm('Replace all current custom templates? This cannot be undone.')) {
      onImportBackup(file)
    }
    e.target.value = ''
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 select-none">
      <div>
        <h2 className="text-xl font-bold text-text-primary tracking-tight">Settings</h2>
        <p className="text-[13px] text-text-muted mt-1">
          Manage template backups, data portability, and local extension storage.
        </p>
      </div>

      {/* Section 1: Data Portability & Backup */}
      <section className="bg-bg-a2/40 border border-divider-dim rounded-md p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <Database size={16} className="text-accent-main" />
          <h3 className="text-[14px] font-semibold text-text-primary">Data Backup & Restore</h3>
        </div>
        <p className="text-[12px] text-text-muted leading-relaxed">
          Your custom templates are stored locally in your browser. Export a portable JSON backup file to sync between devices or keep your templates safe.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onExportBackup}
            className="h-8 px-3.5 rounded-md bg-bg-a2 hover:bg-bg-a4 border border-divider-dim hover:border-divider-bright text-text-primary text-[12px] font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={14} className="text-accent-main" />
            <span>Download Backup (.json)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
            data-testid="input-backup"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-3.5 rounded-md bg-bg-a2 hover:bg-bg-a4 border border-divider-dim hover:border-divider-bright text-text-primary text-[12px] font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileUp size={14} className="text-accent-main" />
            <span>Restore from .json</span>
          </button>
        </div>
      </section>

      {/* Section 2: Storage Diagnostics */}
      <section className="bg-bg-a2/40 border border-divider-dim rounded-md p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <HardDrive size={16} className="text-accent-main" />
          <h3 className="text-[14px] font-semibold text-text-primary">Storage Diagnostics</h3>
        </div>
        <div className="divide-y divide-divider-dim text-[12px]">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Custom Templates Installed</span>
            <span className="font-mono text-accent-bright/75">{customCount}</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Storage Driver</span>
            <span className="font-mono text-accent-bright/75">browser.storage.local</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-text-muted">Storage Capacity</span>
            <span className="font-mono text-accent-bright/75">Unlimited (unlimitedStorage permission)</span>
          </div>
        </div>
      </section>
    </div>
  )
}
