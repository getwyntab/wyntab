import { LayoutGrid, Sliders, Info, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DashboardNav = 'templates' | 'settings' | 'about'

interface SidebarProps {
  activeNav: DashboardNav
  onSelectNav: (nav: DashboardNav) => void
  darkMode: boolean
  onToggleTheme: () => void
  version?: string
}

export function Sidebar({
  activeNav,
  onSelectNav,
  darkMode,
  onToggleTheme,
  version = '0.5.0',
}: SidebarProps) {
  return (
    <aside className="w-60 h-screen shrink-0 bg-bg-b1 border-r border-divider-dim flex flex-col justify-between select-none">
      {/* Top Brand Header (Centered Violentmonkey style) */}
      <div className="pt-7 pb-6 px-4 flex flex-col items-center border-b border-divider-dim">
        <div className="w-10 h-10 rounded-md bg-accent-main/15 border border-accent-main/30 flex items-center justify-center p-2 mb-2.5">
          <img
            src="/icon/128.png"
            alt="WYNTab logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-[15px] font-bold text-text-primary tracking-tight leading-none mb-1">
          WYNTab
        </h1>
        <span className="text-[11px] font-mono text-text-subtle">
          v{version}
        </span>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main Navigation">
        <button
          type="button"
          data-testid="nav-templates"
          onClick={() => onSelectNav('templates')}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors text-left",
            activeNav === 'templates'
              ? "bg-bg-a2 text-text-primary border border-divider-bright"
              : "text-text-muted hover:text-text-primary hover:bg-bg-a4 border border-transparent"
          )}
        >
          <LayoutGrid size={16} className={activeNav === 'templates' ? "text-accent-main" : "text-text-muted"} />
          <span>Templates</span>
        </button>

        <button
          type="button"
          data-testid="nav-settings"
          onClick={() => onSelectNav('settings')}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors text-left",
            activeNav === 'settings'
              ? "bg-bg-a2 text-text-primary border border-divider-bright"
              : "text-text-muted hover:text-text-primary hover:bg-bg-a4 border border-transparent"
          )}
        >
          <Sliders size={16} className={activeNav === 'settings' ? "text-accent-main" : "text-text-muted"} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          data-testid="nav-about"
          onClick={() => onSelectNav('about')}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors text-left",
            activeNav === 'about'
              ? "bg-bg-a2 text-text-primary border border-divider-bright"
              : "text-text-muted hover:text-text-primary hover:bg-bg-a4 border border-transparent"
          )}
        >
          <Info size={16} className={activeNav === 'about' ? "text-accent-main" : "text-text-muted"} />
          <span>About</span>
        </button>
      </nav>

      {/* Bottom Theme Switcher */}
      <div className="p-3 border-t border-divider-dim">
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-medium text-text-muted hover:text-text-primary hover:bg-bg-a4 border border-transparent hover:border-divider-dim transition-colors"
          title="Toggle Dark / Light Theme"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Moon size={15} className="text-accent-bright" /> : <Sun size={15} className="text-accent-main" />}
          <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
        </button>
      </div>
    </aside>
  )
}

