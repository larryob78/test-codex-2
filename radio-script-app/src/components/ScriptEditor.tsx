import { clsx } from 'clsx'
import { type ClipboardEventHandler, useEffect, useRef } from 'react'

interface ScriptEditorProps {
  value: string
  onChange: (value: string) => void
  onCopy: () => void
  wordCount: number
  estimatedSeconds: number
  lastGeneratedAt?: Date | null
}

const toolbarButtons = [
  { command: 'bold', label: 'Bold', icon: 'B' },
  { command: 'italic', label: 'Italic', icon: 'I' },
  { command: 'insertunorderedlist', label: 'Bullets', icon: '•' },
  { command: 'insertorderedlist', label: 'Numbered', icon: '1' },
]

export function ScriptEditor({ value, onChange, onCopy, wordCount, estimatedSeconds, lastGeneratedAt }: ScriptEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const exec = (command: string, arg?: string) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(command, false, arg)
    handleInput()
  }

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML ?? '')
  }

  const handlePaste: ClipboardEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    handleInput()
  }

  const insertCue = (label: string) => {
    exec('insertHTML', `<span class="direction">${label}</span>&nbsp;`)
  }

  const insertLead = () => {
    exec('insertHTML', `<span class="lead">Voice:</span> `)
  }

  return (
    <div className="editor-card">
      <header className="editor-header">
        <div>
          <h2>Script workspace</h2>
          <p className="editor-meta">
            Word count: <strong>{wordCount}</strong> • Estimated runtime: <strong>{estimatedSeconds}s</strong>
            {lastGeneratedAt ? (
              <span className="timestamp">Last generated {lastGeneratedAt.toLocaleTimeString()}</span>
            ) : null}
          </p>
        </div>
        <button type="button" className="ghost-button" onClick={onCopy}>
          Copy script
        </button>
      </header>
      <div className="toolbar" role="toolbar" aria-label="Formatting options">
        {toolbarButtons.map((button) => (
          <button
            key={button.command}
            type="button"
            className="toolbar-button"
            onClick={() => exec(button.command)}
            aria-label={button.label}
          >
            {button.icon}
          </button>
        ))}
        <div className="toolbar-divider" aria-hidden="true" />
        <button type="button" className="toolbar-button" onClick={() => insertCue('[SFX: ]')}>
          SFX
        </button>
        <button type="button" className="toolbar-button" onClick={() => insertCue('[MUSIC: ]')}>
          Music
        </button>
        <button type="button" className="toolbar-button" onClick={insertLead}>
          Voice cue
        </button>
        <button type="button" className="toolbar-button" onClick={() => exec('removeFormat')}>
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        className={clsx('script-editor', { 'script-editor--empty': !value })}
        contentEditable
        role="textbox"
        aria-multiline="true"
        spellCheck
        onInput={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
        data-placeholder="Write, refine, and direct your radio script here..."
      />
    </div>
  )
}

export default ScriptEditor
