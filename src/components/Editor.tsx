import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState, Compartment } from '@codemirror/state'

export interface EditorProps {
  value: string
  onChange: (value: string) => void
  darkMode?: boolean
}

const lightTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px', backgroundColor: 'var(--bg-b2)', color: 'var(--text-primary)' },
  '.cm-scroller': { overflow: 'auto', fontFamily: 'monospace' },
  '.cm-content': { caretColor: 'var(--accent-main)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--accent-main)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: 'rgba(211, 121, 24, 0.25)' },
  '.cm-gutters': { backgroundColor: 'var(--bg-a2)', color: 'var(--text-muted)', borderRight: '1px solid var(--divider-dim)' },
})

const darkTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px', backgroundColor: 'var(--bg-b2)', color: 'var(--text-primary)' },
  '.cm-scroller': { overflow: 'auto', fontFamily: 'monospace' },
  '.cm-gutters': { backgroundColor: 'var(--bg-a2)', color: 'var(--text-muted)', borderRight: '1px solid var(--divider-dim)' },
})

export function Editor({ value, onChange, darkMode }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const themeCompartment = useRef(new Compartment())

  useEffect(() => {
    if (!containerRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        html(),
        themeCompartment.current.of(darkMode ? [oneDark, darkTheme] : [lightTheme]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])

  // Reactively reconfigure theme when darkMode toggles
  useEffect(() => {
    if (!viewRef.current) return
    viewRef.current.dispatch({
      effects: themeCompartment.current.reconfigure(darkMode ? [oneDark, darkTheme] : [lightTheme]),
    })
  }, [darkMode])

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full overflow-hidden bg-bg-b2"
    />
  )
}

export default Editor
