// Explanation
// MetaKey + `/` = toggles line comments for the selected text
// TabKey = inserts 4 spaces (because tabbing in a textarea doesn't do this natively!)
// MetaKey + [ = indent the selected lines to the left
// MetaKey + ] = indent the selected lines to the right
// MetaKey + Enter = dispatches the `universe:submit` event with a copy of the text; this is useful for, say, running a query

import { customElement } from 'lit/decorators.js'
import UniversePlugin from './base'

@customElement('universe-keyboard-shortcuts-plugin')
export class KeyboardShortcutsPlugin extends UniversePlugin {
  constructor() {
    super()
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.editor.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.editor.removeEventListener('keydown', this.onKeyDown)
  }

  private onKeyDown(event: KeyboardEvent) {
    const hasMetaKey = event.metaKey

    // commenting
    const isSlashKey = event.code === 'Slash'
    if (hasMetaKey && isSlashKey) {
      event.preventDefault()
      this.toggleLineComments()
      this.dispatchInputEvent()
    }

    // indent (Cmd+[ or Ctrl+[)
    else if (event.key === '[' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      this.indentLine('left')
      this.dispatchInputEvent()
    }

    // outdent (Cmd+] or Ctrl+])
    else if (event.key === ']' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      this.indentLine('right')
      this.dispatchInputEvent()
    }

    // outdent (Shift+Tab)
    else if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      this.indentLine('left')
      this.dispatchInputEvent()
    }

    // insert tab
    else if (event.code === 'Tab') {
      event.preventDefault()
      this.insertTabAtSelection()
      this.dispatchInputEvent()
    }

    // submit (Cmd+Enter or Ctrl+Enter)
    else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      this.dispatchEvent(new CustomEvent('universe:submit', { detail: { text: this.editor.text }, bubbles: true, composed: true }))
    }

    // Cut line (Cmd+X or Ctrl+X)
    if (event.key === 'x' && (event.metaKey || event.ctrlKey) && !this.editor.hasSelectedText) {
      event.preventDefault()
      this.cutLine()
      this.dispatchInputEvent()
    }
  }

  private indentLine(indent: 'left' | 'right') {
    const textarea = this.editor.textareaRef.value!
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = this.editor.text

    // Determine the start and end of the line(s) that the selection spans
    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    const lineEnd = text.indexOf('\n', end) === -1 ? text.length : text.indexOf('\n', end)

    // Extract the line(s) to be indented
    const lines = text.slice(lineStart, lineEnd).split('\n')

    // Check if there's white space at the beginning of the first line
    if (!lines[0].startsWith(' ') && indent === 'left') {
      return // Abort if no white space at the beginning of the line and indenting left
    }

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
    this.editor.text = modifiedText
    this.editor.updateLineCache()

    setTimeout(() => {
      const newStart = start + (indent === 'right' ? 2 : -2)
      const newEnd = end + (indent === 'right' ? 2 * lines.length : -2 * lines.length)
      textarea.selectionStart = Math.max(0, newStart)
      textarea.selectionEnd = Math.max(0, newEnd)
    }, 0)
  }

  private dispatchInputEvent() {
    this.editor.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        data: this.editor.text,
        inputType: 'insertText',
      })
    )
  }

  private toggleLineComments() {
    const textarea = this.editor.textareaRef.value
    const start = textarea!.selectionStart
    const end = textarea!.selectionEnd

    const commentCharacters = '-- '
    const uncommentCharacters = '--'
    const commentLength = commentCharacters.length
    const uncommentLength = uncommentCharacters.length

    // Find the start of the first line and the end of the last line in the selection
    const firstLineStart = this.editor.text.lastIndexOf('\n', start - 1) + 1
    let lastLineEnd = this.editor.text.indexOf('\n', end)
    lastLineEnd = lastLineEnd === -1 ? this.editor.text.length : lastLineEnd

    const beforeSelection = this.editor.text.substring(0, firstLineStart)
    const selectionText = this.editor.text.substring(firstLineStart, lastLineEnd)
    const afterSelection = this.editor.text.substring(lastLineEnd)
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

    this.editor.text = beforeSelection + updatedLines.join('\n') + afterSelection

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
      newSelectionStart = Math.min(newSelectionStart, this.editor.text.length)
      newSelectionEnd = Math.min(newSelectionEnd, this.editor.text.length)

      textarea!.selectionStart = newSelectionStart
      textarea!.selectionEnd = newSelectionEnd

      if (start === end) {
        // If there was no selection, just move the cursor to the adjusted position
        textarea!.selectionEnd = textarea!.selectionStart
      }
    })

    this.editor.updateLineCache()
  }

  private insertTabAtSelection() {
    const textarea = this.editor.textareaRef.value
    const start = textarea!.selectionStart
    const end = textarea!.selectionEnd

    // Set textarea value to: text before caret + tab + text after caret
    this.editor.text = this.editor.text.substring(0, start) + '    ' + this.editor.text.substring(end)

    setTimeout(() => {
      textarea!.selectionStart = textarea!.selectionEnd = start + 4 // Move the caret after the tab
      this.editor.updateLineCache()
    })
  }

  private cutLine() {
    const textarea = this.editor.textareaRef.value!
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = this.editor.text

    // Determine the start and end of the line that the selection spans
    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    const lineEnd = text.indexOf('\n', end) + 1 || text.length

    // Extract the line to be cut
    const lineToCut = text.slice(lineStart, lineEnd)

    // Update the editor text by removing the line
    this.editor.text = text.slice(0, lineStart) + text.slice(lineEnd)
    this.editor.updateLineCache()

    // Copy the line to the clipboard
    navigator.clipboard.writeText(lineToCut).then(() => {
      // Adjust cursor position after cutting the line
      textarea.selectionStart = textarea.selectionEnd = lineStart
    })
  }
}
