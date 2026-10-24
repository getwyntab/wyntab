import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Dashboard } from '../main'
import { userTemplates } from '@/lib/storage'

describe('Dashboard entrypoint', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('renders persistent left sidebar navigation and template gallery', async () => {
    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('nav-templates')).toBeInTheDocument()
    })
    expect(screen.getByText('WYNTab')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-about')).toBeInTheDocument()
    expect(screen.getByTitle(/filter and sort templates/i)).toBeInTheDocument()
    expect(screen.getByTitle(/create blank template/i)).toBeInTheDocument()
  })

  it('filters to Custom and displays instructional empty state when no custom templates exist', async () => {
    render(<Dashboard />)

    // Open filter dropdown and select Custom Templates
    const filterBtn = screen.getByTitle(/filter and sort templates/i)
    fireEvent.click(filterBtn)

    const customOption = screen.getByRole('button', { name: /custom templates/i })
    fireEvent.click(customOption)

    await waitFor(() => {
      expect(screen.getByText(/no custom templates yet/i)).toBeInTheDocument()
    })
  })

  it('navigates to Settings and displays data backup and storage diagnostics', async () => {
    render(<Dashboard />)

    const settingsNavBtn = screen.getByTestId('nav-settings')
    fireEvent.click(settingsNavBtn)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /settings/i })).toBeInTheDocument()
    })

    expect(screen.getByText(/data backup & restore/i)).toBeInTheDocument()
    expect(screen.getByText(/storage diagnostics/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download backup/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /restore from \.json/i })).toBeInTheDocument()
  })

  it('navigates to About and displays extension specifications', async () => {
    render(<Dashboard />)

    const aboutNavBtn = screen.getByTestId('nav-about')
    fireEvent.click(aboutNavBtn)

    await waitFor(() => {
      expect(screen.getByText(/extension specifications/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/sandboxed execution model/i)).toBeInTheDocument()
  })

  it('sanitizes malicious script and iframe tags when importing backup JSON in Settings', async () => {
    render(<Dashboard />)

    // Go to settings
    fireEvent.click(screen.getByTestId('nav-settings'))

    await waitFor(() => {
      expect(screen.getByTestId('input-backup')).toBeInTheDocument()
    })

    const input = screen.getByTestId('input-backup') as HTMLInputElement
    const maliciousBackup = JSON.stringify({
      version: 1,
      userTemplates: [
        {
          id: 'imported-xss',
          name: 'XSS Template',
          html: '<h1>Title</h1><script>alert("xss")</script><iframe src="evil.com"></iframe>',
          isBuiltin: false,
          uploadedAt: new Date().toISOString(),
        },
      ],
      activeTemplateId: 'imported-xss',
    })

    const file = new File([maliciousBackup], 'backup.json', { type: 'application/json' })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(async () => {
      const saved = await userTemplates.getValue()
      const imported = saved?.find((t) => t.id === 'imported-xss')
      expect(imported).toBeDefined()
      expect(imported?.html).not.toContain('<script>')
      expect(imported?.html).not.toContain('<iframe>')
      expect(imported?.html).toContain('<h1>Title</h1>')
    })
  })
})
