import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TemplateCard } from '../TemplateCard'
import { type Template } from '@/lib/templates'

const mockBuiltinTemplate: Template = {
  id: 'minimal-clock',
  name: 'Minimal Clock',
  html: '<h1>Clock</h1>',
  isBuiltin: true,
}

const mockCustomTemplate: Template = {
  id: 'user-123',
  name: 'My Dashboard',
  html: '<div>Custom</div>',
  isBuiltin: false,
  uploadedAt: new Date().toISOString(),
}

describe('TemplateCard component', () => {
  it('renders template information and badges correctly', () => {
    render(
      <TemplateCard
        template={mockBuiltinTemplate}
        isActive={false}
        onActivate={vi.fn()}
        onDeactivate={vi.fn()}
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
      />
    )

    expect(screen.getByText('Minimal Clock')).toBeInTheDocument()
    expect(screen.getByText('Built-in')).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fork to edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /duplicate template/i })).toBeInTheDocument()
  })

  it('displays active state badge when template is active', () => {
    render(
      <TemplateCard
        template={mockBuiltinTemplate}
        isActive={true}
        onActivate={vi.fn()}
        onDeactivate={vi.fn()}
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
      />
    )

    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('calls onActivate when inactive switch toggle is clicked', () => {
    const handleActivate = vi.fn()
    const handleDeactivate = vi.fn()

    render(
      <TemplateCard
        template={mockBuiltinTemplate}
        isActive={false}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
      />
    )

    const switchEl = screen.getByRole('switch')
    fireEvent.click(switchEl)
    expect(handleActivate).toHaveBeenCalledTimes(1)
    expect(handleDeactivate).not.toHaveBeenCalled()
  })

  it('calls onDeactivate when active switch toggle is clicked', () => {
    const handleActivate = vi.fn()
    const handleDeactivate = vi.fn()

    render(
      <TemplateCard
        template={mockBuiltinTemplate}
        isActive={true}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
      />
    )

    const switchEl = screen.getByRole('switch')
    fireEvent.click(switchEl)
    expect(handleDeactivate).toHaveBeenCalledTimes(1)
    expect(handleActivate).not.toHaveBeenCalled()
  })

  it('provides edit code, duplicate, and delete actions for custom templates', () => {
    const handleEdit = vi.fn()
    const handleDuplicate = vi.fn()
    const handleDelete = vi.fn()

    render(
      <TemplateCard
        template={mockCustomTemplate}
        isActive={false}
        onActivate={vi.fn()}
        onDeactivate={vi.fn()}
        onDuplicate={handleDuplicate}
        onEditCode={handleEdit}
        onDelete={handleDelete}
      />
    )

    expect(screen.getByText('Custom')).toBeInTheDocument()

    const editBtn = screen.getByRole('button', { name: /edit code/i })
    const duplicateBtn = screen.getByRole('button', { name: /duplicate template/i })
    const deleteBtn = screen.getByRole('button', { name: /delete template/i })

    fireEvent.click(editBtn)
    expect(handleEdit).toHaveBeenCalledTimes(1)

    fireEvent.click(duplicateBtn)
    expect(handleDuplicate).toHaveBeenCalledTimes(1)

    fireEvent.click(deleteBtn)
    expect(handleDelete).toHaveBeenCalledTimes(1)
  })
})
