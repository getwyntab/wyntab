import { createRoot } from 'react-dom/client'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { getBuiltinTemplates, type Template } from '@/lib/templates'
import { activeTemplateHtml, activeTemplateId, userTemplates } from '@/lib/storage'
import { STARTER_HTML } from '@/lib/constants'

// Modular Components
import { Sidebar, type DashboardNav } from './components/Sidebar'
import { TemplatesToolbar, type TemplateFilter, type TemplateSort } from './components/TemplatesToolbar'
import { TemplateCard } from '@/components/TemplateCard'
import { TemplateEditor } from './components/TemplateEditor'
import { SettingsPage } from './components/SettingsPage'
import { AboutPage } from './components/AboutPage'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { UnsavedModal } from './components/UnsavedModal'
import { Toast, type ToastMessage } from './components/Toast'

interface BackupData {
  version: number
  userTemplates: Template[]
  activeTemplateId: string
}

function createTemplateRecord(name: string, html: string): Template {
  return {
    id: `user-${Date.now()}`,
    name,
    html,
    isBuiltin: false,
    uploadedAt: new Date().toISOString(),
  }
}

// ─── Dark Mode Hook ───────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      localStorage.getItem('wyn-dashboard-theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('wyn-dashboard-theme', dark ? 'dark' : 'light')
  }, [dark])

  return [dark, setDark] as const
}

// ─── Dashboard Workstation Component ──────────────────────────────────────────
export function Dashboard() {
  const [dark, setDark] = useDarkMode()
  const [activeNav, setActiveNav] = useState<DashboardNav>('templates')
  const [activeId, setActiveId] = useState('')
  const [userList, setUserList] = useState<Template[]>([])

  // Filter & Sort
  const [filter, setFilter] = useState<TemplateFilter>('all')
  const [sort, setSort] = useState<TemplateSort>('name-asc')

  // Modals & Navigation Guards
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isNewDraft, setIsNewDraft] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(null)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
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
      const defaultT = builtins[0]
      if (!id && defaultT) {
        await Promise.all([
          activeTemplateId.setValue(defaultT.id),
          activeTemplateHtml.setValue(defaultT.html),
        ])
        setActiveId(defaultT.id)
      } else {
        setActiveId(id || '')
      }
    } catch {
      // Fallback for non-extension / mock environments
    }
  }

  function showToast(msg: string, ok = true) {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, msg, ok }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ─── Activation Controls ────────────────────────────────────────────────────
  async function doActivate(template: Template) {
    await Promise.all([
      activeTemplateId.setValue(template.id),
      activeTemplateHtml.setValue(template.html),
    ])
    setActiveId(template.id)
    showToast(`"${template.name}" activated.`, true)
  }

  async function doDeactivate(template: Template) {
    const defaultT = builtins[0]
    if (defaultT) {
      await doActivate(defaultT)
      showToast(`"${template.name}" untoggled. Reverted to "${defaultT.name}".`, true)
    }
  }

  // ─── Template Actions ───────────────────────────────────────────────────────
  async function doDuplicate(template: Template) {
    const copy = createTemplateRecord(`${template.name} (Copy)`, template.html)
    const updated = [...userList, copy]
    await userTemplates.setValue(updated)
    setUserList(updated)
    showToast(`Duplicated "${template.name}".`, true)
  }

  async function doConfirmDelete() {
    if (!deletingTemplate) return

    const id = deletingTemplate.id
    const updated = userList.filter((t) => t.id !== id)
    await userTemplates.setValue(updated)
    setUserList(updated)

    // Active Fallback Safeguard
    if (activeId === id) {
      const defaultT = builtins[0]
      if (defaultT) {
        await doActivate(defaultT)
      } else {
        await Promise.all([
          activeTemplateId.setValue(''),
          activeTemplateHtml.setValue(''),
        ])
        setActiveId('')
      }
    }

    setDeletingTemplate(null)
    showToast(`"${deletingTemplate.name}" deleted.`, true)
  }

  // ─── Editor Actions ─────────────────────────────────────────────────────────
  function handleNewTemplate() {
    const draft = createTemplateRecord('Untitled Template', STARTER_HTML)
    setEditingTemplate(draft)
    setIsNewDraft(true)
  }

  function handleForkBuiltin(builtin: Template) {
    const forkDraft = createTemplateRecord(`${builtin.name} (Custom)`, builtin.html)
    setEditingTemplate(forkDraft)
    setIsNewDraft(true)
  }

  async function handleSaveEditor(name: string, html: string) {
    if (!editingTemplate) return

    const exists = userList.some((t) => t.id === editingTemplate.id)

    let updated: Template[]
    if (exists) {
      updated = userList.map((t) =>
        t.id === editingTemplate.id ? { ...t, name, html } : t
      )
    } else {
      updated = [...userList, { ...editingTemplate, name, html }]
    }

    await userTemplates.setValue(updated)
    setUserList(updated)

    // Update live active newtab if editing currently active template
    if (activeId === editingTemplate.id) {
      await activeTemplateHtml.setValue(html)
    }

    setIsNewDraft(false)
    setEditingTemplate((prev) => (prev ? { ...prev, name, html } : null))
    showToast('Changes saved.', true)
  }

  function handleBackToLibrary() {
    setEditingTemplate(null)
    setIsNewDraft(false)
    setShowUnsavedModal(false)
  }

  // ─── File Upload & Import ───────────────────────────────────────────────────
  function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.html')) {
      showToast('Please upload a .html file.', false)
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const raw = ev.target?.result as string
        if (!raw) {
          showToast('File is empty.', false)
          return
        }

        const newTemplate = createTemplateRecord(file.name.replace(/\.html$/i, ''), raw)

        const updated = [...userList, newTemplate]
        await userTemplates.setValue(updated)
        setUserList(updated)
        await doActivate(newTemplate)
        showToast(`"${newTemplate.name}" uploaded and activated.`, true)
      } catch {
        showToast('Failed to process HTML file.', false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleExportBackup() {
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
      showToast('Backup exported successfully.', true)
    } catch {
      showToast('Failed to export backup.', false)
    }
  }

  function handleImportBackup(file: File) {
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const raw = ev.target?.result as string
        const data = JSON.parse(raw) as BackupData

        if (!data.userTemplates || !Array.isArray(data.userTemplates)) {
          throw new Error('Invalid backup format')
        }

        const restored = data.userTemplates.map((t) => ({
          ...t,
          html: t.html || '',
        }))

        await userTemplates.setValue(restored)
        if (data.activeTemplateId) {
          const all = [...builtins, ...restored]
          const active = all.find((t) => t.id === data.activeTemplateId)
          if (active) {
            await doActivate(active)
          }
        }

        await refreshData()
        showToast('Backup restored successfully.', true)
      } catch {
        showToast('Invalid backup JSON file.', false)
      }
    }
    reader.readAsText(file)
  }

  const manifestVersion = typeof browser !== 'undefined' && browser.runtime?.getManifest
    ? browser.runtime.getManifest().version
    : '0.5.4'

  // ─── VIEW 4: Full-Screen Template Editor ────────────────────────────────────
  if (editingTemplate) {
    return (
      <div className={cn("h-screen w-screen bg-bg-b1 text-text-primary", dark && "dark")}>
        <TemplateEditor
          template={editingTemplate}
          onBack={handleBackToLibrary}
          onSave={handleSaveEditor}
          darkMode={dark}
          onRequestDiscard={handleBackToLibrary}
        />

        {showUnsavedModal && (
          <UnsavedModal
            onSaveAndLeave={async () => {
              await handleSaveEditor(editingTemplate.name, editingTemplate.html)
              handleBackToLibrary()
            }}
            onDiscardAndLeave={handleBackToLibrary}
            onCancel={() => setShowUnsavedModal(false)}
          />
        )}

        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    )
  }

  // ─── Filter & Sort Processing ───────────────────────────────────────────────
  let visibleTemplates: Template[] = []
  if (filter === 'all') {
    visibleTemplates = [...builtins, ...userList]
  } else if (filter === 'custom') {
    visibleTemplates = [...userList]
  } else if (filter === 'builtin') {
    visibleTemplates = [...builtins]
  }

  visibleTemplates.sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name)
    if (sort === 'name-desc') return b.name.localeCompare(a.name)
    if (sort === 'newest') {
      const aTime = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0
      const bTime = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0
      return bTime - aTime
    }
    return 0
  })

  // ─── Main Desktop Workstation Layout ────────────────────────────────────────
  return (
    <div className={cn("h-screen w-screen flex bg-bg-b1 text-text-primary overflow-hidden", dark && "dark")}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".html"
        onChange={handleUploadFile}
      />

      {/* Persistent Full-Height Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        darkMode={dark}
        onToggleTheme={() => setDark(!dark)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-bg-b1">
        {activeNav === 'templates' && (
          <>
            {/* Top Toolbar */}
            <TemplatesToolbar
              filter={filter}
              onFilterChange={setFilter}
              sort={sort}
              onSortChange={setSort}
              onNewTemplate={handleNewTemplate}
              onUploadHtml={() => fileInputRef.current?.click()}
            />

            {/* Template Gallery Canvas */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                {visibleTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {visibleTemplates.map((t) => (
                      <TemplateCard
                        key={t.id}
                        template={t}
                        isActive={t.id === activeId}
                        onActivate={() => doActivate(t)}
                        onDeactivate={() => doDeactivate(t)}
                        onDuplicate={() => doDuplicate(t)}
                        onEditCode={() => {
                          if (t.isBuiltin) {
                            handleForkBuiltin(t)
                          } else {
                            setEditingTemplate(t)
                            setIsNewDraft(false)
                          }
                        }}
                        onDelete={t.isBuiltin ? undefined : () => setDeletingTemplate(t)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Clean Instructional Empty State */
                  <div className="max-w-md mx-auto my-16 p-8 rounded-md border border-dashed border-divider-bright text-center space-y-3 bg-bg-a2/40">
                    <h3 className="text-sm font-semibold text-text-primary">No Custom Templates Yet</h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Use the <strong className="text-accent-bright font-semibold">+</strong> (New Template) or <strong className="text-text-primary font-semibold">Upload</strong> icon buttons in the top right toolbar to add your first template.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeNav === 'settings' && (
          <SettingsPage
            customCount={userList.length}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}

        {activeNav === 'about' && (
          <AboutPage version={manifestVersion} />
        )}
      </main>

      {/* Delete Confirmation Modal with Active Safeguard */}
      {deletingTemplate && (
        <DeleteConfirmModal
          template={deletingTemplate}
          isActive={deletingTemplate.id === activeId}
          onConfirm={doConfirmDelete}
          onCancel={() => setDeletingTemplate(null)}
        />
      )}

      {/* Global Toast Stack */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

// ─── App Mount ────────────────────────────────────────────────────────────────
const rootEl = document.getElementById('root')
if (rootEl) {
  createRoot(rootEl).render(<Dashboard />)
}
