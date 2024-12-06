import { unifiedMergeView } from '@codemirror/merge'
import { EditorState, Prec, StateEffect, StateField, Transaction } from '@codemirror/state'
import { Decoration, keymap, showTooltip, WidgetType, type Tooltip } from '@codemirror/view'
import { EditorView } from 'codemirror'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base.js'
import AstraEditorPromptDialog from './prompt-dialog.js'
import { resolveToNearestStatement } from './sql-statement-highlight.js'

const effectHidePrompt = StateEffect.define()
const effectShowPrompt = StateEffect.define<{ lineNumber: number; from: number; to: number }>()

// This effect is used to add selected code
// that will be for prompt suggestion
const effectSelectedPromptLine = StateEffect.define<number[]>()

interface PromptSelectedFragment {
  text: string
  fullText: string
  startLineNumber: number
  endLineNumber: number
}
type PromptCallback = (promptQuery: string, selected?: PromptSelectedFragment) => Promise<string>

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

  constructor(plugin: AstraEditorPromptPlugin, from: number, to: number) {
    super()
    plugin.isActive = true
    plugin.activeWidget = this
    this.plugin = plugin
    const view = this.plugin.editor.getEditorView()!

    console.log('widget created')

    // First we need to lock the editor to read-only.
    // This will simplify the logic of the plugin of not having to
    // worry about keeping up with the editor state while the prompt
    plugin.editor.readonly = true
    const getSelectionLines = () => {
      const startLineNumber = view.state.doc.lineAt(from).number
      const endLineNumber = view.state.doc.lineAt(to).number
      return Array.from({ length: endLineNumber - startLineNumber + 1 }, (_, i) => startLineNumber + i)
    }

    const selectedLines = getSelectionLines()

    // Calculate cursor and selection positions
    const startPosition = from
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
          annotations: [Transaction.addToHistory.of(false)],
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
      suggestedText = selectedOriginalText
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
        .getSuggestion(e.detail, {
          text: suggestedText ?? selectedOriginalText,
          fullText: view.state.doc.toString(),
          startLineNumber,
          endLineNumber: view.state.doc.lineAt(startPosition + suggestedText.length).number,
        })
        .then((queryText) => {
          // This prevent when we close the widget before
          // the suggestion return result which cause
          // us to suggestion code to the editor
          if (!this.plugin.isActive) return

          // If the query counter is not matched, it must be canceled
          if (expectedQueryCounter !== queryCounter) return

          // We need to reverse the change before apply new suggestion
          reverseSuggestion()

          this.plugin.showDiff(originalText)
          dialog.previousPrompt = e.detail

          // Replace selection with suggested result from prompt
          view.dispatch({
            changes: {
              from: startPosition,
              to: endPosition,
              insert: queryText,
            },
            annotations: [Transaction.addToHistory.of(false)],
          })

          suggestedText = queryText

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

    this.plugin.activeWidget = undefined
    this.plugin.isActive = false
  }

  ignoreEvent(): boolean {
    return false
  }
}

function createPromptStatePlugin(plugin: AstraEditorPromptPlugin) {
  return StateField.define({
    create() {
      10
      return Decoration.none
    },

    update(v, tr) {
      for (const e of tr.effects) {
        if (e.is(effectShowPrompt)) {
          // Add prompt widget
          return Decoration.set([
            Decoration.widget({
              widget: new PromptWidget(plugin, e.value.from, e.value.to),
              side: -10,
              block: true,
            }).range(e.value.from),
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

function triggerShowPrompt(v: EditorView, plugin: AstraEditorPromptPlugin) {
  const currentCursor = v.state.selection.main.from
  const currentCursorLine = v.state.doc.lineAt(currentCursor)
  const nearestA = resolveToNearestStatement(v.state, v.state.selection.main.from)
  const nearestB = resolveToNearestStatement(v.state, v.state.selection.main.to)

  const startLine = v.state.doc.lineAt(nearestA?.from ?? 0)
  const endLine = v.state.doc.lineAt(nearestB?.to ?? v.state.doc.length)

  if (plugin.activeWidget) {
    plugin.activeWidget.dialog.triggerClose()
  }

  setTimeout(() => {
    if (v.state.selection.main.from === v.state.selection.main.to) {
      // We need to find a way to know if user want to generate new query
      // or user want to improve the existing query.

      // We determine if user want to generate new query if it is in empty line
      // and it is not in the middle of statement
      if (currentCursor < startLine.from || currentCursor > endLine.to) {
        v.dispatch({
          effects: [effectShowPrompt.of({ lineNumber: currentCursorLine.number, from: currentCursorLine.from, to: currentCursorLine.to })],
          selection: { anchor: currentCursor, head: currentCursor },
        })
        return true
      }
    }

    v.dispatch({
      effects: [
        effectShowPrompt.of({ lineNumber: startLine.number, from: startLine.from, to: endLine.to }),
        effectSelectedPromptLine.of(Array.from({ length: endLine.number - startLine.number + 1 }, (_, i) => startLine.number + i)),
      ],
      selection: { anchor: startLine.from, head: startLine.from },
    })
  }, 50)

  return true
}

function createPromptKeyBinding(plugin: AstraEditorPromptPlugin) {
  return Prec.highest(
    keymap.of([
      {
        key: 'Ctrl-b',
        mac: 'Cmd-b',
        preventDefault: true,
        run: (v) => {
          return triggerShowPrompt(v, plugin)
        },
      },
    ])
  )
}

const promptSelectedLines = StateField.define({
  create() {
    return Decoration.none
  },

  update(v, tr) {
    for (const e of tr.effects) {
      if (e.is(effectSelectedPromptLine)) {
        return Decoration.set(e.value.map((line) => decorationSelectedLine.range(tr.state.doc.line(line).from)))
      } else if (e.is(effectHidePrompt)) {
        return Decoration.none
      }
    }

    return v
  },
  provide: (f) => EditorView.decorations.from(f),
})

function getCursorTooltips(state: EditorState, plugin: AstraEditorPromptPlugin): readonly Tooltip[] {
  return state.selection.ranges
    .filter((range) => !range.empty)
    .map((range) => {
      return {
        pos: range.head,
        above: range.head < range.anchor,
        strictSide: true,
        arrow: false,
        create: () => {
          let dom = document.createElement('div')
          dom.className = 'cm-tooltip-cursor'

          let editButton = document.createElement('button')
          editButton.innerHTML = 'Edit <span>⌘B</span>'

          editButton.onclick = () => {
            triggerShowPrompt(plugin.editor.getEditorView()!, plugin)
          }

          dom.appendChild(editButton)

          return { dom }
        },
      }
    })
}

@customElement('astra-editor-prompt')
export class AstraEditorPromptPlugin extends AstraEditorPlugin {
  // Tracking if there is any active prompt widget
  isActive: boolean = false
  activeWidget?: PromptWidget
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

      .cm-tooltip-cursor {
        border: 1px solid #eee;
        border-radius: 5px;
        overflow: hidden;
      }

      .dark .cm-tooltip-cursor {
        border: 1px solid #555;
      }

      .cm-tooltip-cursor button {
        padding: 5px 10px;
        border: none;
        background: #f1f1f1;
        cursor: pointer;
      }

      .cm-tooltip-cursor button:hover {
        background: #ccc;
      }

      .cm-tooltip-cursor button span {
        color: #888;
        margin-left: 2px;
      }

      .dark .cm-tooltip-cursor button {
        background: #171717;
        color: white;
      }

      .dark .cm-tooltip-cursor button:hover {
        background: #272727;
      }
    `
    )

    this.editor.updateExtension('prompt', [
      createPromptKeyBinding(this),
      promptSelectedLines,
      this.promptStatePlugin,

      StateField.define<readonly Tooltip[]>({
        create: (state) => getCursorTooltips(state, this),

        update: (tooltips, tr) => {
          if (!tr.docChanged && !tr.selection) return tooltips
          return getCursorTooltips(tr.state, this)
        },

        provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
      }),

      StateField.define({
        create() {
          return Decoration.none
        },
        update: (v, tr) => {
          const cursorPosition = tr.state.selection.main.from
          const line = tr.state.doc.lineAt(cursorPosition)
          const lineText = line.text

          if (lineText === '' && !this.isActive && tr.state.selection && tr.selection?.main.from === tr.selection?.main.to) {
            return Decoration.set([
              Decoration.widget({
                widget: new PlaceholderWidget(),
                side: 10,
              }).range(line.from),
            ])
          }

          return Decoration.none
        },
        provide: (f) => EditorView.decorations.from(f),
      }),
    ])
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.editor.removeStyle('prompt')
    this.editor.removeExtension('prompt')
  }

  async getSuggestion(promptQuery: string, selected?: PromptSelectedFragment) {
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
      return this.promptCallback(promptQuery, selected)
    }

    throw new Error('No token provided')
  }

  handleSuggestion(callback: PromptCallback) {
    this.promptCallback = callback
  }
}
