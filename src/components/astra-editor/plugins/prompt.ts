import { unifiedMergeView } from '@codemirror/merge'
import { EditorState, Prec, StateEffect, StateField } from '@codemirror/state'
import { Decoration, keymap, WidgetType } from '@codemirror/view'
import { EditorView } from 'codemirror'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base.js'
import AstraEditorPromptDialog from './prompt-dialog.js'

const effectHidePrompt = StateEffect.define()
const effectShowPrompt = StateEffect.define<number>()

// This effect is used to add selected code
// that will be for prompt suggestion
const effectSelectedPromptLine = StateEffect.define<number[]>()

type PromptCallback = (promptQuery: string, selectedText?: string) => Promise<string>

const decorationSelectedLine = Decoration.line({
  class: 'prompt-line-selected',
})

class PlaceholderWidget extends WidgetType {
  toDOM(): HTMLElement {
    const wrap = document.createElement('span')
    wrap.className = 'cm-placeholder'
    wrap.style.padding = ''
    wrap.append(document.createTextNode('⌘ + B to get AI assistant'))
    return wrap
  }

  ignoreEvent(): boolean {
    return false
  }
}

class PromptWidget extends WidgetType {
  plugin: AstraEditorPromptPlugin
  themeHandler?: () => void
  dialog: AstraEditorPromptDialog

  getWidgetCursor(state: EditorState) {
    return state.field(this.plugin.promptStatePlugin).iter().from
  }

  constructor(plugin: AstraEditorPromptPlugin) {
    super()
    plugin.isActive = true
    this.plugin = plugin
    const view = this.plugin.editor.getEditorView()!

    // First we need to lock the editor to read-only.
    // This will simplify the logic of the plugin of not having to
    // worry about keeping up with the editor state while the prompt
    plugin.editor.readonly = true

    // Get the selected lines and highlight it
    const getSelectionLines = () => {
      console.log(view.state.selection.main)
      const startLineNumber = view.state.doc.lineAt(view.state.selection.main.from).number
      const endLineNumber = view.state.doc.lineAt(view.state.selection.main.to).number
      return Array.from({ length: endLineNumber - startLineNumber + 1 }, (_, i) => startLineNumber + i)
    }

    const selectedLines = getSelectionLines()
    view.dispatch({ effects: [effectSelectedPromptLine.of(selectedLines)] })

    // Calculate cursor and selection positions
    const startPosition = view.state.selection.main.head
    const startLineNumber = view.state.doc.lineAt(startPosition).number
    const endPosition = selectedLines
      ? view.state.doc.line(selectedLines[selectedLines.length - 1]).to
      : view.state.doc.lineAt(startPosition).to

    // Create the prompt components and handle the theme change event
    const dialog = document.createElement('astra-editor-prompt-dialog') as AstraEditorPromptDialog
    dialog.theme = this.plugin.editor.color ?? 'light'
    this.dialog = dialog

    this.themeHandler = () => {
      dialog.theme = this.plugin.editor.color ?? 'light'
    }

    this.plugin.editor.addEventListener('color-changed', this.themeHandler)

    // Reverse the suggestion that we have made
    const selectedOriginalText = view.state.sliceDoc(startPosition, endPosition)
    let originalText = view.state.doc.toString()
    let suggestedText = selectedOriginalText

    const reverseSuggestion = () => {
      if (suggestedText !== selectedOriginalText) {
        this.plugin.hideSuggestionDiff()

        view.dispatch({
          changes: {
            from: startPosition,
            to: startPosition + suggestedText.length,
            insert: selectedOriginalText,
          },
        })
      }
    }

    dialog.addEventListener('close', () => {
      view.dispatch({
        effects: [
          effectHidePrompt.of(null), // Hide the prompt widget
          effectSelectedPromptLine.of([]), // Remove the selected line highlight
        ],
      })

      reverseSuggestion()
      this.plugin.editor.readonly = false
      setTimeout(() => view.focus(), 50)
    })

    dialog.addEventListener('reject', () => {
      reverseSuggestion() // Restore the original text

      view.dispatch({
        effects: [
          effectSelectedPromptLine.of(selectedLines), // Reverse the selected line highlight
        ],
      })

      dialog.previousPrompt = ''
      dialog.showReject = false
    })

    dialog.addEventListener('cancel', () => {
      dialog.loading = false
      queryCounter++
    })

    // Query counter is used for implementing canceling query
    // When we cancel, we just increment the counter and
    // result of the query arrived, we will ignore if the counter is not matched
    let queryCounter = 1

    dialog.addEventListener('generate', ((e: CustomEvent<string>) => {
      dialog.loading = true
      const expectedQueryCounter = queryCounter

      this.plugin
        .getSuggestion(e.detail, selectedOriginalText)
        .then((queryText) => {
          // This prevent when we close the widget before
          // the suggestion return result which cause
          // us to suggestion code to the editor
          if (!this.plugin.isActive) return

          // If the query counter is not matched, it must be canceled
          if (expectedQueryCounter !== queryCounter) return

          // We need to reverse the change before apply new suggestion
          reverseSuggestion()

          suggestedText = queryText
          this.plugin.showDiff(originalText)
          dialog.previousPrompt = e.detail

          // Replace selection with suggested result from prompt
          view.dispatch({
            changes: {
              from: startPosition,
              to: endPosition,
              insert: suggestedText,
            },
          })

          // Highlight the suggested code along with the previous selected code
          view.dispatch({
            effects: [
              effectSelectedPromptLine.of(
                Array.from(
                  {
                    length: view.state.doc.lineAt(startPosition + suggestedText.length).number - startLineNumber,
                  },
                  (_, i) => startLineNumber + i
                )
              ),
            ],
          })

          dialog.previousPrompt = e.detail
          dialog.showReject = true
        })
        .catch((e) => {
          dialog.error = e.toString()
        })
        .finally(() => {
          dialog.loading = false
          dialog.focus()
          queryCounter++
        })
    }) as EventListener)

    dialog.addEventListener('accept', () => {
      view.dispatch({ effects: [effectHidePrompt.of(null), effectSelectedPromptLine.of([])] })

      this.plugin.editor.readonly = false
      this.plugin.hideSuggestionDiff()

      setTimeout(() => {
        view.focus()
      }, 50)
    })

    setTimeout(() => {
      dialog.focus()
    }, 50)
  }

  toDOM(): HTMLElement {
    return this.dialog
  }

  destroy(): void {
    if (this.themeHandler) {
      this.plugin.editor.removeEventListener('color-changed', this.themeHandler)
    }

    this.plugin.isActive = false
  }

  ignoreEvent(): boolean {
    return false
  }
}

function createPromptStatePlugin(plugin: AstraEditorPromptPlugin) {
  return StateField.define({
    create() {
      return Decoration.none
    },

    update(v, tr) {
      for (const e of tr.effects) {
        if (e.is(effectShowPrompt)) {
          const from = tr.state.doc.line(e.value).from

          // Add prompt widget
          return Decoration.set([
            Decoration.widget({
              widget: new PromptWidget(plugin),
              side: -10,
              block: true,
            }).range(from),
          ])
        } else if (e.is(effectHidePrompt)) {
          return Decoration.none
        }
      }

      if (tr.docChanged) {
        return v.map(tr.changes)
      }

      return v
    },

    provide: (f) => EditorView.decorations.from(f),
  })
}

const promptKeyBinding = Prec.highest(
  keymap.of([
    {
      key: 'Ctrl-b',
      mac: 'Cmd-b',
      preventDefault: true,
      run: (v) => {
        const startLineNumber = v.state.doc.lineAt(v.state.selection.main.from).number
        const endLineNumber = v.state.doc.lineAt(v.state.selection.main.to).number
        const selectedLine = Array.from({ length: endLineNumber - startLineNumber + 1 }, (_, i) => startLineNumber + i)

        v.dispatch({
          effects: [effectShowPrompt.of(startLineNumber), effectSelectedPromptLine.of(selectedLine)],
        })

        return true
      },
    },
  ])
)

const promptSelectedLines = StateField.define({
  create() {
    return Decoration.none
  },

  update(v, tr) {
    for (const e of tr.effects) {
      if (e.is(effectSelectedPromptLine)) {
        console.log('I am here', e.value)
        return Decoration.set(e.value.map((line) => decorationSelectedLine.range(tr.state.doc.line(line).from)))
      } else if (e.is(effectHidePrompt)) {
        console.log('I am also here')
        return Decoration.none
      }
    }

    return v
  },
  provide: (f) => EditorView.decorations.from(f),
})

@customElement('astra-editor-prompt')
export class AstraEditorPromptPlugin extends AstraEditorPlugin {
  // Tracking if there is any active prompt widget
  isActive: boolean = false
  originalText: string = ''

  @property() token: string = ''

  promptStatePlugin = createPromptStatePlugin(this)
  promptCallback?: PromptCallback

  showDiff(originalText: string) {
    this.editor.updateExtension('prompt-diff', [
      unifiedMergeView({
        original: originalText,
        mergeControls: false,
        syntaxHighlightDeletions: false,
      }),
    ])
  }

  hideSuggestionDiff() {
    this.editor.removeExtension('prompt-diff')
  }

  connectedCallback() {
    super.connectedCallback()

    this.editor.addStyle(
      'prompt',
      `
      .prompt-line-preview {
        background: #abf7b1;
      }

      .prompt-line-selected {
        background: #f5f5f5;
      }

      .dark .prompt-line-selected {
        background: #222;
      }

      .cm-deletedChunk {
        background-color: #fab1a0 !important;
      }

      .dark .cm-deletedChunk {
        background-color: #B54B4B !important;
      }

      .cm-changedLine {
        background-color: #55efc4 !important;
      }

      .cm-changedLine {
        background-color: #55efc4 !important;
      }

      .dark .cm-changedLine {
        background-color: #2F6542 !important;
      }

      .cm-insertedLine .cm-changedText {
        background: none !important;
      }

      .cm-deletedChunk .cm-deletedText {
        background: none !important;
      }

      .cm-deletedChunk del {
        text-decoration: none !important;
      }
    `
    )

    this.editor.updateExtension('prompt', [promptKeyBinding, promptSelectedLines, this.promptStatePlugin])
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.editor.removeStyle('prompt')
    this.editor.removeExtension('prompt')
  }

  async getSuggestion(promptQuery: string, selectedText?: string) {
    // If token is supplied, we will fallback to ezql public API
    if (this.token) {
      const ezqlRawResponse = await fetch('https://app.outerbase.com/api/v1/ezql', {
        headers: {
          'x-source-token': this.token,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ query: promptQuery, run: false }),
        method: 'POST',
      })

      const ezqlResponse = await ezqlRawResponse.json()
      if (ezqlResponse.error) throw ezqlResponse.error.description
      return ezqlResponse?.response?.query
    } else if (this.promptCallback) {
      return this.promptCallback(promptQuery, selectedText)
    }

    throw new Error('No token provided')
  }

  handleSuggestion(callback: PromptCallback) {
    this.promptCallback = callback
  }
}
