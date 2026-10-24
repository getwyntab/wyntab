import { transform } from 'sucrase'

/**
 * Transpiles JSX within `<script type="text/babel">` tags into standard `<script type="module">`
 * with React.createElement calls so the browser can execute it natively without Babel standalone.
 */
export function transpileTemplateHtml(html: string): string {
  if (!html || !/<script\s+type=["']text\/babel["']/i.test(html)) {
    return html
  }

  return html.replace(
    /<script\s+type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/gi,
    (match, code) => {
      try {
        const transpiled = transform(code, {
          transforms: ['jsx'],
          jsxRuntime: 'classic',
          jsxPragma: 'React.createElement',
          production: true,
        }).code
        return `<script type="module">\n${transpiled}\n</script>`
      } catch (err) {
        console.warn('WYNTab: Failed to transpile JSX template, keeping original:', err)
        return match
      }
    }
  )
}

