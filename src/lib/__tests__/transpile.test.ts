import { describe, it, expect } from 'vitest'
import { transpileTemplateHtml } from '../transpile'

describe('transpileTemplateHtml', () => {
  it('returns untouched html when no text/babel script exists', () => {
    const raw = '<html><body><h1>Hello</h1></body></html>'
    expect(transpileTemplateHtml(raw)).toBe(raw)
  })

  it('transpiles JSX in text/babel into module script with React.createElement', () => {
    const input = `
      <!DOCTYPE html>
      <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script type="text/babel" data-type="module">
          const App = () => <div className="box"><span>Hello World</span></div>
          createRoot(document.getElementById('root')).render(<App />)
        </script>
      </body>
      </html>
    `
    const output = transpileTemplateHtml(input)
    expect(output).not.toContain('text/babel')
    expect(output).toContain('<script type="module">')
    expect(output).toContain('React.createElement')
    expect(output).toContain('className: "box"')
  })

  it('handles invalid JSX gracefully without crashing', () => {
    const invalid = '<script type="text/babel">const x = <div unclosed</script>'
    const output = transpileTemplateHtml(invalid)
    expect(output).toBe(invalid)
  })
})

