// Explanation
// On every `input` event, we push another snapshot of the textfield to the undo stack
// On `undo`, we skip to the oldest snapshot before there is more than `THRESHOLD` time between them
// As a result, if you make a series of edits without pausing, they'all all be undone at once
// However, if you pause for > THRESHOLD (e.g. 500ms), the changes before that pause won't be undone -- unless you trigger this plugin again with Command + Z

import { customElement } from 'lit/decorators.js'
import UniversePlugin from './base'

type UndoEvent = {
  text: string
  selectionStart: number
  selectionEnd: number
  timestamp: number
}

const THRESHOLD = 500
@customElement('universe-undo-plugin')
export class UndoPlugin extends UniversePlugin {
  private textBeforeEdit = ''
  private positionStartBeforeEdit = 0
  private positionEndBeforeEdit = 0
  private undoStack: Array<UndoEvent> = []
  private redoStack: Array<UndoEvent> = []

  constructor() {
    super()
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onInput = this.onInput.bind(this)
  }

  connectedCallback(): void {
    super.connectedCallback()

    const editor = this.editor
    if (!editor) {
      throw new Error('Failed to find parent <text-editor />')
    }

    editor.addEventListener('keydown', this.onKeyDown)
    editor.addEventListener('input', this.onInput)
  }

  disconnectedCallback(): void {
    this.editor?.removeEventListener('keydown', this.onKeyDown)
    this.editor?.removeEventListener('input', this.onInput)
  }

  private onKeyDown(event: KeyboardEvent) {
    // snag values before `input` mutates them
    this.textBeforeEdit = this.editor.text
    this.positionEndBeforeEdit = this.editor.textareaRef.value!.selectionEnd
    this.positionStartBeforeEdit = this.editor.textareaRef.value!.selectionStart

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
  }

  private onInput(_event: Event) {
    this.saveStateToUndoStack()
  }

  private handleUndo() {
    if (this.undoStack.length > 0) {
      let currentState = this.undoStack.pop()
      let oldestState = currentState

      while (
        this.undoStack.length > 0 &&
        oldestState &&
        oldestState.timestamp - (this.undoStack[this.undoStack.length - 1].timestamp as number) <= THRESHOLD
      ) {
        oldestState = this.undoStack.pop()
      }

      if (oldestState) {
        this.redoStack.push({
          text: this.editor.text,
          selectionStart: this.editor.textareaRef.value?.selectionStart || 0,
          selectionEnd: this.editor.textareaRef.value?.selectionEnd || 0,
          timestamp: oldestState.timestamp,
        })

        this.editor.text = oldestState.text
        this.editor.updateLineCache()

        const textarea = this.editor.textareaRef.value
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
          text: this.editor.text,
          selectionStart: this.editor.textareaRef.value?.selectionStart || 0,
          selectionEnd: this.editor.textareaRef.value?.selectionEnd || 0,
          timestamp: newestState.timestamp,
        })

        this.editor.text = newestState.text
        this.editor.updateLineCache()

        const textarea = this.editor.textareaRef.value
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
