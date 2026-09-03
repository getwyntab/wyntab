import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '../sanitize'

describe('sanitizeHtml', () => {
  it('strips script tags and inner content', () => {
    const dirty = '<div>Hello<script>alert("xss")</script> World</div>'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('<script>')
    expect(clean).not.toContain('alert("xss")')
    expect(clean).toContain('Hello')
    expect(clean).toContain('World')
  })

  it('strips dangerous embedded elements', () => {
    const dirty = `
      <div>
        <iframe src="about:blank"></iframe>
        <object data="exploit.swf"></object>
        <embed src="exploit.mov"></embed>
        <base href="https://hijack.com/">
      </div>
    `
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('<iframe')
    expect(clean).not.toContain('<object')
    expect(clean).not.toContain('<embed')
    expect(clean).not.toContain('<base')
  })

  it('strips inline event listeners', () => {
    const dirty = '<button onclick="evil()" onmouseover="track()" ONLOAD="run()">Click</button>'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('onclick')
    expect(clean).not.toContain('onmouseover')
    expect(clean).not.toContain('ONLOAD')
    expect(clean).toContain('<button>Click</button>')
  })

  it('strips javascript: pseudo-protocol in links and attributes', () => {
    const dirty = '<a href="javascript:alert(1)">Click me</a>'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('javascript:')
  })

  it('preserves valid formatting, styles, and safe attributes', () => {
    const safe = '<div class="card" style="color: red;"><h1 id="title">Minimal</h1><p>Test</p></div>'
    const clean = sanitizeHtml(safe)
    expect(clean).toContain('class="card"')
    expect(clean).toContain('style="color: red;"')
    expect(clean).toContain('id="title"')
    expect(clean).toContain('Minimal')
  })
})
