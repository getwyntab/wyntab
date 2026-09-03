import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'

export interface EditorProps {
  value: string
  onChange: (value: string) => void
  darkMode?: boolean
}

export function Editor({ value, onChange, darkMode }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        html(),
        ...(darkMode ? [oneDark] : []),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': { height: '100%', fontSize: '13px' },
          '.cm-scroller': { overflow: 'auto' },
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


  return (
    <div 
      ref={containerRef} 
      className="h-full w-full border border-border rounded-sm overflow-hidden shadow-inner bg-card"
    />
  )
}

export default Editor

