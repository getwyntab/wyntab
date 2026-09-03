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
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
        onPreview={vi.fn()}
      />
    )

    expect(screen.getByText('Minimal Clock')).toBeInTheDocument()
    expect(screen.getByText('Built-in template')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /activate/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /duplicate to customize/i })).toBeInTheDocument()
  })

  it('displays active state badge when template is active', () => {
    render(
      <TemplateCard
        template={mockBuiltinTemplate}
        isActive={true}
        onActivate={vi.fn()}
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
        onPreview={vi.fn()}
      />
    )

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^activate$/i })).not.toBeInTheDocument()
  })

  it('calls onActivate when Activate button is clicked', () => {
    const handleActivate = vi.fn()
    render(
      <TemplateCard
        template={mockBuiltinTemplate}
        isActive={false}
        onActivate={handleActivate}
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
        onPreview={vi.fn()}
      />
    )

    const activateBtn = screen.getByRole('button', { name: /activate/i })
    fireEvent.click(activateBtn)
    expect(handleActivate).toHaveBeenCalledTimes(1)
  })

  it('calls onPreview when clicking thumbnail frame', () => {
    const handlePreview = vi.fn()
    render(
      <TemplateCard
        template={mockBuiltinTemplate}
        isActive={false}
        onActivate={vi.fn()}
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
        onPreview={handlePreview}
      />
    )

    const previewArea = screen.getByLabelText(/preview minimal clock full screen/i)
    fireEvent.click(previewArea)
    expect(handlePreview).toHaveBeenCalledTimes(1)
  })

  it('calls onPreview with Enter key on thumbnail frame for keyboard accessibility', () => {
    const handlePreview = vi.fn()
    render(
      <TemplateCard
        template={mockBuiltinTemplate}
        isActive={false}
        onActivate={vi.fn()}
        onDuplicate={vi.fn()}
        onEditCode={vi.fn()}
        onPreview={handlePreview}
      />
    )

    const previewArea = screen.getByLabelText(/preview minimal clock full screen/i)
    fireEvent.keyDown(previewArea, { key: 'Enter' })
    expect(handlePreview).toHaveBeenCalledTimes(1)
  })

  it('provides edit, duplicate, and delete text actions for custom templates', () => {
    const handleEdit = vi.fn()
    const handleDuplicate = vi.fn()
    const handleDelete = vi.fn()

    render(
      <TemplateCard
        template={mockCustomTemplate}
        isActive={false}
        onActivate={vi.fn()}
        onDuplicate={handleDuplicate}
        onEditCode={handleEdit}
        onDelete={handleDelete}
        onPreview={vi.fn()}
      />
    )

    expect(screen.getByText('Custom template')).toBeInTheDocument()

    const editBtn = screen.getByRole('button', { name: /edit html/i })
    const duplicateBtn = screen.getByRole('button', { name: /duplicate/i })
    const deleteBtn = screen.getByRole('button', { name: /delete/i })

    fireEvent.click(editBtn)
    expect(handleEdit).toHaveBeenCalledTimes(1)

    fireEvent.click(duplicateBtn)
    expect(handleDuplicate).toHaveBeenCalledTimes(1)

    fireEvent.click(deleteBtn)
    expect(handleDelete).toHaveBeenCalledTimes(1)
  })
})
