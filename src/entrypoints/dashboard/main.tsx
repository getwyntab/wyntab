import { createRoot } from 'react-dom/client'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import {
  Moon, Sun,
  CheckCircle2, Download, FileUp, X,
  Code2, Save, ArrowLeft, Plus,
  ShieldCheck, Info, Monitor, Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBuiltinTemplates, type Template } from '@/lib/templates'
import { activeTemplateHtml, activeTemplateId, userTemplates } from '@/lib/storage'
import { sanitizeHtml } from '@/lib/sanitize'
import { TemplateCard } from '@/components/TemplateCard'
import { STARTER_HTML } from '@/lib/constants'

const Editor = lazy(() => import('@/components/Editor'))

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'built-in' | 'custom' | 'settings'

interface BackupData {
  version: number
  userTemplates: Template[]
  activeTemplateId: string
}

// ─── Dark mode hook ───────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('wyn-theme', dark ? 'dark' : 'light')
  }, [dark])

  return [dark, setDark] as const
}

// ─── Dashboard Component ──────────────────────────────────────────────────────
export function Dashboard() {
  const [dark, setDark] = useDarkMode()
  const [activeId, setActiveId] = useState('')
  const [userList, setUserList] = useState<Template[]>([])
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [editorValue, setEditorValue] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('built-in')
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  
  const fileRef = useRef<HTMLInputElement>(null)
  const backupRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const builtins = getBuiltinTemplates()

  useEffect(() => {
    refreshData()
  }, [])

  async function refreshData() {
    try {
      const [id, saved] = await Promise.all([
        activeTemplateId.getValue(),
        userTemplates.getValue(),
      ])
      setUserList(saved || [])
      if (!id && builtins.length > 0) {
        doActivate(builtins[0])
      } else {
        setActiveId(id || '')
      }
    } catch {
      // Fallback for non-extension environments
    }
  }

  function showStatus(msg: string, ok: boolean) {
    setStatus({ msg, ok })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus(null), 3000)
  }

  async function doActivate(template: Template) {
    await Promise.all([
      activeTemplateId.setValue(template.id),
      activeTemplateHtml.setValue(template.html),
    ])
    setActiveId(template.id)
    showStatus(`"${template.name}" activated.`, true)
  }

  async function doDelete(id: string) {
    if (!confirm('Are you sure you want to delete this template?')) return
    const updated = userList.filter((t) => t.id !== id)
    await userTemplates.setValue(updated)
    setUserList(updated)
    if (activeId === id) {
      const defaultT = builtins[0]
      if (defaultT) doActivate(defaultT)
      else {
        await Promise.all([
          activeTemplateId.setValue(''),
          activeTemplateHtml.setValue(''),
        ])
        setActiveId('')
      }
    }
    showStatus('Template deleted.', true)
  }

  async function doRename(id: string, newName: string) {
    const updated = userList.map(t => t.id === id ? { ...t, name: newName } : t)
    await userTemplates.setValue(updated)
    setUserList(updated)
    showStatus('Template renamed.', true)
  }

  async function doDuplicate(template: Template) {
    const newTemplate: Template = {
      ...template,
      id: `user-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isBuiltin: false,
      uploadedAt: new Date().toISOString(),
    }
    const updated = [...userList, newTemplate]
    await userTemplates.setValue(updated)
    setUserList(updated)
    showStatus(`Duplicated "${template.name}".`, true)
  }

  async function doSaveCode() {
    if (!editingTemplate) return
    
    const sanitized = sanitizeHtml(editorValue)
    const exists = userList.some(t => t.id === editingTemplate.id)
    
    let updated: Template[]
    if (exists) {
      updated = userList.map(t => 
        t.id === editingTemplate.id ? { ...t, html: sanitized } : t
      )
    } else {
      updated = [...userList, { ...editingTemplate, html: sanitized }]
    }
    
    await userTemplates.setValue(updated)
    setUserList(updated)
    
    if (activeId === editingTemplate.id) {
      await activeTemplateHtml.setValue(sanitized)
    }
    
    setEditingTemplate(null)
    showStatus('Changes saved.', true)
  }

  async function handleCreateBlank() {
    const newTemplate: Template = {
      id: `user-${Date.now()}`,
      name: 'Untitled Template',
      html: STARTER_HTML,
      isBuiltin: false,
      uploadedAt: new Date().toISOString(),
    }

    setEditingTemplate(newTemplate)
    setEditorValue(STARTER_HTML)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.html')) {
      showStatus('Please upload a .html file.', false)
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const raw = ev.target?.result as string
        if (!raw) {
          showStatus('File is empty.', false)
          return
        }

        const sanitized = sanitizeHtml(raw)

        const newTemplate: Template = {
          id: `user-${Date.now()}`,
          name: file.name.replace(/\.html$/i, ''),
          html: sanitized,
          isBuiltin: false,
          uploadedAt: new Date().toISOString(),
        }

        const updated = [...userList, newTemplate]
        await userTemplates.setValue(updated)
        setUserList(updated)
        await doActivate(newTemplate)
        setActiveTab('custom')
        showStatus(`"${newTemplate.name}" uploaded and activated.`, true)
      } catch (err) {
        console.error('Upload failed:', err)
        showStatus('Failed to process or save file.', false)
      }
    }

    reader.onerror = () => {
      showStatus('Failed to read file.', false)
    }

    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleExport() {
    try {
      const data: BackupData = {
        version: 1,
        userTemplates: userList,
        activeTemplateId: activeId,
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `wyntab-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showStatus('Backup exported successfully.', true)
    } catch {
      showStatus('Failed to export backup.', false)
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const raw = ev.target?.result as string
        const data = JSON.parse(raw) as BackupData

        if (!data.userTemplates || !Array.isArray(data.userTemplates)) {
          throw new Error('Invalid backup format')
        }

        await userTemplates.setValue(data.userTemplates)
        if (data.activeTemplateId) {
          const allTemplates = [...builtins, ...data.userTemplates]
          const active = allTemplates.find(t => t.id === data.activeTemplateId)
          if (active) {
            await doActivate(active)
          }
        }

        await refreshData()
        setActiveTab('custom')
        showStatus('Backup imported successfully.', true)
      } catch {
        showStatus('Failed to import backup. Invalid file.', false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const manifestVersion = typeof browser !== 'undefined' && browser.runtime?.getManifest
    ? browser.runtime.getManifest().version
    : '0.4.2'

  // ─── Editor View ────────────────────────────────────────────────────────────
  if (editingTemplate) {
    return (
      <div className={cn("h-screen bg-background text-foreground flex flex-col font-sans", dark && "dark")}>
        <header className="border-b border-border h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              type="button"
              onClick={() => setEditingTemplate(null)}
              className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-lg border border-border"
              title="Go back"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="truncate">
              <span className="text-xs text-muted-foreground block leading-none mb-0.5">Editing Template</span>
              <span className="text-sm font-semibold truncate block">{editingTemplate.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              type="button"
              onClick={() => setEditingTemplate(null)}
              className="h-8 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted"
            >
              Discard
            </button>
            <button 
              type="button"
              onClick={doSaveCode}
              className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </header>
        <main className="grow flex overflow-hidden bg-muted/20">
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="grow overflow-hidden rounded-lg border border-border bg-card">
              <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading editor...</div>}>
                <Editor value={editorValue} onChange={setEditorValue} />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ─── Main Dynamic Layout (Blog-Style) ─────────────────────────────────────────
  return (
    <div className={cn("min-h-screen bg-background text-foreground font-sans flex flex-col", dark && "dark")}>
      <input type="file" ref={fileRef} className="hidden" accept=".html" onChange={handleFile} />
      <input type="file" ref={backupRef} className="hidden" accept=".json" onChange={handleImport} />

      {/* Top Masthead */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xs">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-xs">
              <img src="/icon/128.png" className="w-4 h-4 brightness-0 invert dark:invert-0" alt="WYNTab" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold tracking-tight">WYNTab</span>
              <span className="text-[11px] text-muted-foreground font-mono">v{manifestVersion}</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Views">
            <button 
              type="button"
              data-testid="tab-built-in"
              onClick={() => setActiveTab('built-in')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                activeTab === 'built-in' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Built-in Gallery
            </button>
            <button 
              type="button"
              data-testid="tab-custom"
              onClick={() => setActiveTab('custom')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                activeTab === 'custom' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Custom Library
            </button>
            <button 
              type="button"
              data-testid="tab-settings"
              onClick={() => setActiveTab('settings')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                activeTab === 'settings' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Settings
            </button>
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center shrink-0">
            <button 
              type="button"
              onClick={() => setDark(!dark)} 
              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Centered Content Stream */}
      <main className="max-w-4xl mx-auto w-full px-4 py-6 flex-1 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {activeTab === 'built-in' && 'Built-in Gallery'}
              {activeTab === 'custom' && 'Custom Library'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeTab === 'built-in' && 'Minimalist, distraction-free templates for your new tab.'}
              {activeTab === 'custom' && 'Upload HTML files or write custom styles for full control.'}
              {activeTab === 'settings' && 'Manage extension storage, security notices, and preferences.'}
            </p>
          </div>

          {activeTab === 'custom' && (
            <div className="flex items-center gap-2 shrink-0">
              <button 
                type="button"
                onClick={() => fileRef.current?.click()}
                className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5"
              >
                <Plus size={14} />
                Upload HTML
              </button>
              {userList.length > 0 && (
                <button 
                  type="button"
                  onClick={handleExport}
                  className="h-8 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Export
                </button>
              )}
            </div>
          )}
        </div>

        {/* Built-in Gallery Stream */}
        {activeTab === 'built-in' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {builtins.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                isActive={t.id === activeId}
                onActivate={() => doActivate(t)}
                onDuplicate={() => doDuplicate(t)}
                onPreview={() => setPreviewTemplate(t)}
                onEditCode={() => {
                  doDuplicate(t).then(() => showStatus('Duplicated for editing.', true))
                }}
              />
            ))}
          </div>
        )}

        {/* Custom Library Stream */}
        {activeTab === 'custom' && (
          userList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {userList.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  isActive={t.id === activeId}
                  onActivate={() => doActivate(t)}
                  onDelete={() => doDelete(t.id)}
                  onRename={(name) => doRename(t.id, name)}
                  onDuplicate={() => doDuplicate(t)}
                  onPreview={() => setPreviewTemplate(t)}
                  onEditCode={() => {
                    setEditingTemplate(t)
                    setEditorValue(t.html)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground">
                <Code2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">No Custom Templates Yet</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload an HTML file or start with a blank live editor template.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  Upload HTML
                </button>
                <button 
                  type="button"
                  onClick={handleCreateBlank}
                  className="h-8 px-3.5 rounded-lg border border-border text-xs font-medium hover:bg-muted flex items-center gap-1.5"
                >
                  <Code2 size={14} />
                  Create Live
                </button>
              </div>
            </div>
          )
        )}

        {/* Settings Stream */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* System Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">System Information</h3>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Info size={14} /> Version
                  </span>
                  <span className="font-mono font-medium">{manifestVersion}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Monitor size={14} /> Platform
                  </span>
                  <span className="font-mono font-medium">Web Extension</span>
                </div>
              </div>
            </div>

            {/* Security & CSP */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Security</h3>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-muted-foreground mt-0.5" />
                  <div className="text-xs space-y-1">
                    <h4 className="font-semibold text-foreground">Scripts Disabled (CSP)</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      To protect your browser from security exploits, custom HTML templates execute in a sandboxed frame without external scripts. Rely on HTML and CSS.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data Management</h3>
              <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your custom templates are stored in local browser storage. Export a backup JSON file to keep your work safe.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={handleExport}
                    className="h-8 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    Export Backup
                  </button>
                  <button 
                    type="button"
                    onClick={() => backupRef.current?.click()}
                    className="h-8 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted flex items-center gap-1.5"
                  >
                    <FileUp size={14} />
                    Import JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="max-w-4xl mx-auto w-full px-4 py-8 text-center text-xs text-muted-foreground border-t border-border mt-auto">
        WYNTab • Write Your NewTab • Local Storage
      </footer>

      {/* Large Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-4xl h-[80vh] bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-2xl">
            <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-card shrink-0">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold">{previewTemplate.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => { doActivate(previewTemplate); setPreviewTemplate(null); }}
                  className="h-7 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
                >
                  Activate
                </button>
                <button 
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Close preview"
                >
                  <X size={16} />
                </button>
              </div>
            </header>
            <div className="flex-1 bg-white overflow-hidden">
              <iframe 
                srcDoc={`<style>html, body { overflow: hidden !important; pointer-events: none !important; cursor: default !important; user-select: none !important; }</style>${previewTemplate.html}`}
                scrolling="no"
                className="w-full h-full border-none pointer-events-none"
                title="Large Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Toast Notification */}
      {status && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className={cn(
            'rounded-lg border px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-sm whitespace-nowrap flex items-center gap-2', 
            status.ok ? 'border-border bg-card text-foreground' : 'border-destructive/40 bg-destructive/10 text-destructive'
          )}>
            {status.ok ? <CheckCircle2 size={14} className="text-green-600" /> : <X size={14} />}
            {status.msg}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── App Root ──────────────────────────────────────────────────────────────
const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(<Dashboard />)
}