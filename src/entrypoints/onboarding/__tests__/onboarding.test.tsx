import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Onboarding } from '../main'

describe('Onboarding entrypoint', () => {
  it('renders branding and feature list cleanly', () => {
    render(<Onboarding />)

    expect(screen.getByText('WYNTab')).toBeInTheDocument()
    expect(screen.getByText('Write Your NewTab')).toBeInTheDocument()
    expect(screen.getByText('Built-in Gallery')).toBeInTheDocument()
    expect(screen.getByText('Custom HTML & CSS')).toBeInTheDocument()
    expect(screen.getByText('Instant Live Sync')).toBeInTheDocument()
    expect(screen.getByTestId('get-started-btn')).toBeInTheDocument()
  })

  it('triggers dashboard open and window close on Get Started click', () => {
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})
    render(<Onboarding />)

    const btn = screen.getByTestId('get-started-btn')
    fireEvent.click(btn)

    expect(browser.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('/dashboard.html'),
      })
    )
    expect(closeSpy).toHaveBeenCalledTimes(1)
    closeSpy.mockRestore()
  })
})
