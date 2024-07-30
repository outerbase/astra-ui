import { customElement } from 'lit/decorators.js'
import UniversePlugin from './base'

@customElement('universe-keyboard-shortcuts-plugin')
export class KeyboardShortcutsPlugin extends UniversePlugin {
  connectedCallback(): void {
    super.connectedCallback()

    const editor = this.editor
    if (!editor) {
      throw new Error('Failed to find parent <text-editor />')
    }

    editor.addEventListener('keydown', (event) => {
      const hasMetaKey = event.metaKey

      // commenting
      const isSlashKey = event.code === 'Slash'
      if (hasMetaKey && isSlashKey) {
        event.preventDefault()
        this.toggleLineComments()
        this.dispatchInputEvent()
      }

      // inserting tabs
      if (event.code === 'Tab') {
        event.preventDefault()
        this.insertTabAtSelection()
        this.dispatchInputEvent()
      }

      // INDENT (Cmd+[ or Ctrl+[)
      if (event.key === '[' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        this.indentLine('left')
        this.dispatchInputEvent()
      }

      // OUTDENT (Cmd+] or Ctrl+])
      if (event.key === ']' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        this.indentLine('right')
        this.dispatchInputEvent()
      }
    })
  }

  private indentLine(indent: 'left' | 'right') {
    const textarea = this.editor!.textareaRef.value
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = this.editor!.text

      // Determine the start and end of the line(s) that the selection spans
      const lineStart = text.lastIndexOf('\n', start - 1) + 1
      const lineEnd = text.indexOf('\n', end) === -1 ? text.length : text.indexOf('\n', end)

      // Extract the line(s) to be indented
      const lines = text.slice(lineStart, lineEnd).split('\n')

      // Indent or outdent each line
      const modifiedLines = lines.map((line) => {
        if (indent === 'right') {
          return '  ' + line
        } else {
          return line.startsWith('  ') ? line.slice(2) : line
        }
      })

      // Join the modified lines and replace the original text
      const modifiedText = text.slice(0, lineStart) + modifiedLines.join('\n') + text.slice(lineEnd)

      // Update the editor text and selection
      this.editor!.text = modifiedText
      this.editor!.updateLineCache()

      setTimeout(() => {
        const newStart = start + (indent === 'right' ? 2 : -2)
        const newEnd = end + (indent === 'right' ? 2 * lines.length : -2 * lines.length)
        textarea.selectionStart = Math.max(0, newStart)
        textarea.selectionEnd = Math.max(0, newEnd)
      }, 0)
    }
  }

  private dispatchInputEvent() {
    const editor = this.editor
    editor?.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        data: editor.text,
        inputType: 'insertText',
      })
    )
  }

  public toggleLineComments() {
    const textarea = this.editor?.textareaRef.value
    const start = textarea!.selectionStart
    const end = textarea!.selectionEnd

    const commentCharacters = '-- '
    const uncommentCharacters = '--'
    const commentLength = commentCharacters.length
    const uncommentLength = uncommentCharacters.length

    // Find the start of the first line and the end of the last line in the selection
    const firstLineStart = this.editor!.text.lastIndexOf('\n', start - 1) + 1
    let lastLineEnd = this.editor!.text.indexOf('\n', end)
    lastLineEnd = lastLineEnd === -1 ? this.editor!.text.length : lastLineEnd

    const beforeSelection = this.editor!.text.substring(0, firstLineStart)
    const selectionText = this.editor!.text.substring(firstLineStart, lastLineEnd)
    const afterSelection = this.editor!.text.substring(lastLineEnd)
    const lines = selectionText.split('\n')

    // Check if all lines are commented out (ignoring leading whitespace)
    const allLinesCommented = lines.every((line) => {
      const trimmedLine = line.trimStart()
      return trimmedLine.startsWith(commentCharacters) || trimmedLine.startsWith(uncommentCharacters)
    })

    const updatedLines = lines.map((line) => {
      const trimmedLine = line.trimStart()
      const leadingWhitespace = line.slice(0, line.length - trimmedLine.length)

      if (allLinesCommented) {
        if (trimmedLine.startsWith(commentCharacters)) {
          return leadingWhitespace + trimmedLine.substring(commentLength)
        } else if (trimmedLine.startsWith(uncommentCharacters)) {
          return leadingWhitespace + trimmedLine.substring(uncommentLength)
        } else {
          return line
        }
      } else {
        return leadingWhitespace + commentCharacters + trimmedLine
      }
    })

    this.editor!.text = beforeSelection + updatedLines.join('\n') + afterSelection

    setTimeout(() => {
      const linesCount = lines.length

      // Adjust the cursor position after adding/removing comments
      let newSelectionStart = start
      let newSelectionEnd = end
      if (allLinesCommented) {
        newSelectionStart = start - (start > firstLineStart ? commentLength : 0)
        newSelectionEnd = end - (end > firstLineStart ? commentLength * linesCount : 0)
      } else {
        newSelectionStart = start + (start > firstLineStart ? commentLength : 0)
        newSelectionEnd = end + (end > firstLineStart ? commentLength * linesCount : 0)
      }

      // Prevent selection from bleeding into the next line
      newSelectionStart = Math.min(newSelectionStart, this.editor!.text.length)
      newSelectionEnd = Math.min(newSelectionEnd, this.editor!.text.length)

      textarea!.selectionStart = newSelectionStart
      textarea!.selectionEnd = newSelectionEnd

      if (start === end) {
        // If there was no selection, just move the cursor to the adjusted position
        textarea!.selectionEnd = textarea!.selectionStart
      }
    })

    this.editor!.updateLineCache()
  }

  public insertTabAtSelection() {
    const textarea = this.editor!.textareaRef.value
    const start = textarea!.selectionStart
    const end = textarea!.selectionEnd

    // Set textarea value to: text before caret + tab + text after caret
    this.editor!.text = this.editor!.text.substring(0, start) + '    ' + this.editor!.text.substring(end)

    setTimeout(() => {
      textarea!.selectionStart = textarea!.selectionEnd = start + 4 // Move the caret after the tab
      this.editor!.updateLineCache()
    })
  }
}
