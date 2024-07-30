import { customElement, state } from 'lit/decorators.js'
import UniversePlugin from './base'

@customElement('universe-undo-plugin')
export class UniverseUndoPlugin extends UniversePlugin {
  @state() textBeforeEdit = ''
  @state() positionStartBeforeEdit = 0
  @state() positionEndBeforeEdit = 0

  @state() private undoStack: Array<{ text: string; selectionStart: number; selectionEnd: number; timestamp: number }> = []
  @state() private redoStack: Array<{ text: string; selectionStart: number; selectionEnd: number; timestamp: number }> = []

  connectedCallback(): void {
    super.connectedCallback()

    const editor = this.editor
    if (!editor) {
      throw new Error('Failed to find parent <text-editor />')
    }

    editor.addEventListener('keydown', (event) => {
      // snag values before `input` mutates them
      this.textBeforeEdit = editor.text
      this.positionEndBeforeEdit = editor.textareaRef.value!.selectionEnd
      this.positionStartBeforeEdit = editor.textareaRef.value!.selectionStart

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

    editor.addEventListener('input', (_event) => {
      this.saveStateToUndoStack()
    })
  }

  private handleUndo() {
    if (this.undoStack.length > 0) {
      let currentState = this.undoStack.pop()
      let oldestState = currentState

      while (
        this.undoStack.length > 0 &&
        oldestState &&
        oldestState.timestamp - (this.undoStack[this.undoStack.length - 1].timestamp as number) <= 500
      ) {
        oldestState = this.undoStack.pop()
      }

      if (oldestState) {
        this.redoStack.push({
          text: this.editor!.text,
          selectionStart: this.editor!.textareaRef.value?.selectionStart || 0,
          selectionEnd: this.editor!.textareaRef.value?.selectionEnd || 0,
          timestamp: oldestState.timestamp,
        })

        this.editor!.text = oldestState.text
        this.editor!.updateLineCache()

        const textarea = this.editor!.textareaRef.value
        if (textarea) {
          setTimeout(() => {
            textarea.selectionStart = oldestState.selectionStart
            textarea.selectionEnd = oldestState.selectionEnd
          }, 0)
        }
      }
    }
  }

  private handleRedo() {
    if (this.redoStack.length > 0) {
      const newestState = this.redoStack.pop()

      if (newestState) {
        this.undoStack.push({
          text: this.editor!.text,
          selectionStart: this.editor!.textareaRef.value?.selectionStart || 0,
          selectionEnd: this.editor!.textareaRef.value?.selectionEnd || 0,
          timestamp: newestState.timestamp,
        })

        this.editor!.text = newestState.text
        this.editor!.updateLineCache()

        const textarea = this.editor!.textareaRef.value
        if (textarea) {
          setTimeout(() => {
            textarea.selectionStart = newestState.selectionStart
            textarea.selectionEnd = newestState.selectionEnd
          }, 0)
        }
      }
    }
  }

  private saveStateToUndoStack() {
    this.undoStack.push({
      selectionEnd: this.positionEndBeforeEdit,
      selectionStart: this.positionStartBeforeEdit,
      text: this.textBeforeEdit,
      timestamp: Date.now(),
    })
  }
}
