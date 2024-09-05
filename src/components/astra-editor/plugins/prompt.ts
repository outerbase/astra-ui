import { Prec, StateEffect, StateField } from '@codemirror/state'
import { Decoration, keymap, WidgetType } from '@codemirror/view'
import { EditorView } from 'codemirror'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base.js'
import PromptDialog from './prompt-dialog.js'

const effectHidePrompt = StateEffect.define()
const effectShowPrompt = StateEffect.define<number>()
const effectAddHighlight = StateEffect.define<number>()
const effectClearHighlight = StateEffect.define()

type PromptCallback = (promptQuery: string) => Promise<string>

const decorationPreviewLine = Decoration.line({
  class: 'prompt-line-preview',
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

  constructor(plugin: AstraEditorPromptPlugin) {
    super()
    this.plugin = plugin
  }

  toDOM(view: EditorView): HTMLElement {
    this.plugin.isActive = true
    const cursorPosition = view.state.selection.main.head

    // We keep previous suggestion so that we can remove it later
    // when we want to generate another suggestion or reject suggestion
    let previousSuggestion = ''

    const container = document.createElement('astra-editor-prompt-dialog') as PromptDialog

    container.theme = this.plugin.editor.color ?? 'light'

    this.themeHandler = () => {
      container.theme = this.plugin.editor.color ?? 'light'
    }

    this.plugin.editor.addEventListener('color-changed', this.themeHandler)

    container.addEventListener('close', () => {
      view.dispatch({ effects: [effectHidePrompt.of(null)] })
      setTimeout(() => view.focus(), 50)
    })

    container.addEventListener('accept', () => {
      view.dispatch({ effects: [effectHidePrompt.of(null)] })
      setTimeout(() => {
        view.focus()
        view.dispatch({
          selection: {
            anchor: cursorPosition + 1,
            head: cursorPosition + previousSuggestion.length,
          },
        })
      }, 50)
    })

    container.addEventListener('generate', ((e: CustomEvent<string>) => {
      container.loading = true
      container.previousPrompt = ''
      container.error = ''

      this.plugin
        .getSuggestion(e.detail)
        .then((r) => {
          // This prevent when we close the widget before
          // the suggestion return result which cause
          // us to suggestion code to the editor
          if (!this.plugin.isActive) return

          // This plugin works on empty line. We need to add one dummy line
          // or else this widget will self-destruct
          const suggestion = '\n' + r

          view.dispatch({
            changes: {
              from: cursorPosition,
              to: cursorPosition + previousSuggestion.length,
              insert: suggestion,
            },
          })

          view.dispatch({
            effects: [effectClearHighlight.of(null)],
          })

          const startLine = view.state.doc.lineAt(cursorPosition + 1).number
          const endLine = view.state.doc.lineAt(cursorPosition + suggestion.length).number
          const lineEffect = []

          for (let i = startLine; i <= endLine; i++) {
            lineEffect.push(effectAddHighlight.of(view.state.doc.line(i).from))
          }

          view.dispatch({ effects: lineEffect })

          previousSuggestion = suggestion
          container.showReject = true
          container.previousPrompt = e.detail
        })
        .catch((e) => {
          container.error = e.toString()
        })
        .finally(() => {
          container.loading = false
          container.focus()
          container.select()
        })
    }) as EventListener)

    container.addEventListener('reject', () => {
      view.dispatch({
        changes: {
          from: cursorPosition,
          to: cursorPosition + previousSuggestion.length,
          insert: '',
        },
      })

      previousSuggestion = ''

      view.dispatch({
        effects: [effectClearHighlight.of(null)],
      })

      container.showReject = true
    })

    setTimeout(() => {
      container.focus()
    }, 50)

    return container
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
          // Add prompt widget
          return Decoration.set([
            Decoration.widget({
              widget: new PromptWidget(plugin),
              side: 1,
              block: true,
            }).range(e.value),
          ])
        } else if (e.is(effectHidePrompt)) {
          // Remove all line highlight and the prompt widget
          return Decoration.none
        } else if (e.is(effectClearHighlight)) {
          // Remove all the highlight on preview line
          v = v.update({
            filter: (_, __, d) => d !== decorationPreviewLine,
          })
        } else if (e.is(effectAddHighlight)) {
          // Add line highlight
          v = v.update({
            add: [decorationPreviewLine.range(e.value)],
          })
        }
      }

      let promptWidgetFound = false
      const cursorPosition = tr.state.selection.main.from

      // Try to remove the prompt widget if we change the cursor position
      v = v.update({
        filter: (from, _, d) => {
          if (d === decorationPreviewLine) return true
          promptWidgetFound = promptWidgetFound || from === cursorPosition
          return from === cursorPosition
        },
      })

      if (promptWidgetFound) return v

      const line = tr.state.doc.lineAt(cursorPosition).text
      if (line !== '') return Decoration.none

      // If line is empty, we just show the prompt placeholder
      return Decoration.set([
        Decoration.widget({
          widget: new PlaceholderWidget(),
          side: 1,
          block: false,
        }).range(tr.state.selection.main.from),
      ])
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
        if (v.state.doc.lineAt(v.state.selection.main.from).text === '') {
          v.dispatch({
            effects: [effectShowPrompt.of(v.state.selection.main.from)],
          })
        }
        return true
      },
    },
  ])
)

@customElement('astra-editor-prompt')
export class AstraEditorPromptPlugin extends AstraEditorPlugin {
  // Tracking if there is any active prompt widget
  isActive: boolean = false

  @property() token: string = ''

  promptCallback?: PromptCallback

  connectedCallback() {
    super.connectedCallback()

    this.editor.addStyle(
      'prompt',
      `
      .prompt-line-preview {
        background: #abf7b1;
      }

      .dark .prompt-line-preview {
        background: #4C5A2C;
      }
    `
    )

    this.editor.updateExtension('prompt', [promptKeyBinding, createPromptStatePlugin(this)])
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.editor.removeStyle('prompt')
    this.editor.removeExtension('prompt')
  }

  async getSuggestion(promptQuery: string) {
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
      return this.promptCallback(promptQuery)
    }

    throw new Error('No token provided')
  }

  handleSuggestion(callback: PromptCallback) {
    this.promptCallback = callback
  }
}
