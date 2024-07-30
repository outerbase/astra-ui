import { customElement, state } from 'lit/decorators.js'
import UniversePlugin from './base'

@customElement('universe-keyboard-shortcuts-plugin')
export class KeyboardShortcutsPlugin extends UniversePlugin {
  @state() private undoStack: Array<{ text: string; selectionStart: number; selectionEnd: number }> = []
  @state() private redoStack: Array<{ text: string; selectionStart: number; selectionEnd: number }> = []

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
        this.saveStateToUndoStack()
        editor.toggleLineComments()
      }

      // inserting tabs
      if (event.code === 'Tab') {
        event.preventDefault()
        this.saveStateToUndoStack()
        editor.insertTabAtSelection()
      }

      // REDO (Cmd+Shift+Z or Ctrl+Shift+Z)
      if (event.key === 'z' && (event.metaKey || event.ctrlKey) && event.shiftKey) {
        event.preventDefault()
        this.handleRedo()
      }
      // UNDO (Cmd+Z or Ctrl+Z)
      else if (event.key === 'z' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        this.handleUndo()
      }
      // REDO (Cmd+Y or Ctrl+Y)
      else if (event.key === 'y' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        this.handleRedo()
      }
    })
  }

  private handleUndo() {
    if (this.undoStack.length > 0) {
      const previousState = this.undoStack.pop()
      if (previousState) {
        this.redoStack.push({
          text: this.editor!.text,
          selectionStart: this.editor!.textareaRef.value?.selectionStart || 0,
          selectionEnd: this.editor!.textareaRef.value?.selectionEnd || 0,
        })
        this.editor!.text = previousState.text
        const textarea = this.editor!.textareaRef.value
        if (textarea) {
          textarea.value = this.editor!.text
          textarea.selectionStart = previousState.selectionStart
          textarea.selectionEnd = previousState.selectionEnd
        }
        this.editor!.updateLineCache()
      }
    } else {
      document.execCommand('undo')
    }
  }

  private handleRedo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()
      if (nextState) {
        this.undoStack.push({
          text: this.editor!.text,
          selectionStart: this.editor!.textareaRef.value!.selectionStart || 0,
          selectionEnd: this.editor!.textareaRef.value!.selectionEnd || 0,
        })
        this.editor!.text = nextState.text
        const textarea = this.editor!.textareaRef.value
        if (textarea) {
          textarea.value = this.editor!.text
          textarea.selectionStart = nextState.selectionStart
          textarea.selectionEnd = nextState.selectionEnd
        }
        this.editor!.updateLineCache()
      }
    } else {
      document.execCommand('redo')
    }
  }

  private saveStateToUndoStack() {
    const textarea = this.editor!.textareaRef.value
    if (textarea) {
      this.undoStack.push({
        text: this.editor!.text,
        selectionStart: textarea.selectionStart,
        selectionEnd: textarea.selectionEnd,
      })
      this.redoStack = [] // Clear redo stack on new action
    }
  }
}
