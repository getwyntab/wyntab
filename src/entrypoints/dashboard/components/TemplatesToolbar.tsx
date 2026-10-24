import { useState, useRef, useEffect } from 'react'
import { ArrowDownWideNarrow, ChevronDown, Plus, Upload, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TemplateFilter = 'all' | 'custom' | 'builtin'
export type TemplateSort = 'name-asc' | 'name-desc' | 'newest'

interface TemplatesToolbarProps {
  filter: TemplateFilter
  onFilterChange: (f: TemplateFilter) => void
  sort: TemplateSort
  onSortChange: (s: TemplateSort) => void
  onNewTemplate: () => void
  onUploadHtml: () => void
}

export function TemplatesToolbar({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onNewTemplate,
  onUploadHtml,
}: TemplatesToolbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dropdownOpen])

  const filterLabels: Record<TemplateFilter, string> = {
    all: 'All',
    custom: 'Custom',
    builtin: 'Built-in',
  }

  return (
    <div className="h-14 px-6 border-b border-divider-dim flex items-center justify-between bg-bg-b1 shrink-0 select-none">
      {/* Left Zone: Combined Filter & Sort Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          className="h-8 px-2.5 rounded-md bg-bg-a2 border border-divider-dim hover:border-divider-bright text-text-primary text-[12px] font-medium flex items-center gap-1.5 transition-colors"
          title="Filter and Sort templates"
        >
          <ArrowDownWideNarrow size={14} className="text-accent-main" />
          <span className="font-semibold">{filterLabels[filter]}</span>
          <ChevronDown size={12} className={cn("text-text-muted transition-transform", dropdownOpen && "rotate-180")} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-48 rounded-md bg-bg-a1 border border-divider-bright shadow-2xl py-1.5 z-30 text-[12px]">
            {/* Filter Section */}
            <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
              Filter by Origin
            </div>
            <button
              type="button"
              onClick={() => { onFilterChange('all'); setDropdownOpen(false); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-bg-a4 text-text-primary text-left"
            >
              <span>All Templates</span>
              {filter === 'all' && <Check size={13} className="text-accent-main" />}
            </button>
            <button
              type="button"
              onClick={() => { onFilterChange('custom'); setDropdownOpen(false); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-bg-a4 text-text-primary text-left"
            >
              <span>Custom Templates</span>
              {filter === 'custom' && <Check size={13} className="text-accent-main" />}
            </button>
            <button
              type="button"
              onClick={() => { onFilterChange('builtin'); setDropdownOpen(false); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-bg-a4 text-text-primary text-left"
            >
              <span>Built-in Presets</span>
              {filter === 'builtin' && <Check size={13} className="text-accent-main" />}
            </button>

            {/* Divider */}
            <div className="my-1.5 border-t border-divider-dim" />

            {/* Sort Section */}
            <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
              Sort by
            </div>
            <button
              type="button"
              onClick={() => { onSortChange('name-asc'); setDropdownOpen(false); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-bg-a4 text-text-primary text-left"
            >
              <span>Name (A → Z)</span>
              {sort === 'name-asc' && <Check size={13} className="text-accent-main" />}
            </button>
            <button
              type="button"
              onClick={() => { onSortChange('name-desc'); setDropdownOpen(false); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-bg-a4 text-text-primary text-left"
            >
              <span>Name (Z → A)</span>
              {sort === 'name-desc' && <Check size={13} className="text-accent-main" />}
            </button>
            <button
              type="button"
              onClick={() => { onSortChange('newest'); setDropdownOpen(false); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-bg-a4 text-text-primary text-left"
            >
              <span>Newest First</span>
              {sort === 'newest' && <Check size={13} className="text-accent-main" />}
            </button>
          </div>
        )}
      </div>

      {/* Right Zone: Secondary Upload Button followed by Primary + Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUploadHtml}
          className="h-8 w-8 rounded-md bg-bg-a2 hover:bg-bg-a4 border border-divider-dim hover:border-divider-bright text-text-primary flex items-center justify-center transition-colors shadow-xs"
          title="Upload .html template"
          aria-label="Upload .html template"
        >
          <Upload size={14} />
        </button>

        <button
          type="button"
          onClick={onNewTemplate}
          className="h-8 w-8 rounded-md bg-accent-main hover:bg-accent-bright text-text-on-accent flex items-center justify-center transition-colors shadow-xs font-bold"
          title="Create blank template"
          aria-label="Create blank template"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

