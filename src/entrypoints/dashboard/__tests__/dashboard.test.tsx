import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Dashboard } from '../main'
import { userTemplates } from '@/lib/storage'

describe('Dashboard entrypoint', () => {
  it('renders dashboard navigation and default Built-in gallery', async () => {
    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('tab-built-in')).toBeInTheDocument()
    })
    expect(screen.getByText('WYNTab')).toBeInTheDocument()
    expect(screen.getByTestId('tab-custom')).toBeInTheDocument()
    expect(screen.getByTestId('tab-settings')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /built-in gallery/i })).toBeInTheDocument()
  })

  it('navigates to Custom Library and displays empty state when no custom templates exist', async () => {
    render(<Dashboard />)

    const customTabBtn = screen.getByTestId('tab-custom')
    fireEvent.click(customTabBtn)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /custom library/i })).toBeInTheDocument()
    })

    expect(screen.getByText(/no custom templates yet/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create live/i })).toBeInTheDocument()
  })

  it('navigates to Settings and displays system information and data management', async () => {
    render(<Dashboard />)

    const settingsTabBtn = screen.getByTestId('tab-settings')
    fireEvent.click(settingsTabBtn)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /settings/i })).toBeInTheDocument()
    })

    expect(screen.getByText(/system information/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /security/i })).toBeInTheDocument()
    expect(screen.getByText(/data management/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export backup/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import json/i })).toBeInTheDocument()
  })

  it('sanitizes malicious script and iframe tags when importing backup JSON', async () => {
    render(<Dashboard />)

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
