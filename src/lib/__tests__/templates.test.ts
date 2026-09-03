import { describe, it, expect } from 'vitest'
import { filenameToName, getBuiltinTemplates } from '../templates'

describe('templates', () => {
  it('converts filenames into title-cased names', () => {
    expect(filenameToName('minimal.html')).toBe('Minimal')
    expect(filenameToName('terminal-mode.html')).toBe('Terminal Mode')
    expect(filenameToName('dark_glass_clock.html')).toBe('Dark Glass Clock')
  })

  it('loads builtin templates with correct schema', () => {
    const templates = getBuiltinTemplates()
    expect(templates.length).toBeGreaterThan(0)
    for (const t of templates) {
      expect(t.id).toMatch(/^builtin-/)
      expect(t.name).toBeTruthy()
      expect(t.html).toBeTruthy()
      expect(t.isBuiltin).toBe(true)
    }
  })
})
