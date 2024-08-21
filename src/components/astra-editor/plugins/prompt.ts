import { Prec, StateEffect, StateField } from '@codemirror/state'
import { Decoration, keymap, WidgetType } from '@codemirror/view'
import { EditorView } from 'codemirror'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base.js'

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
    wrap.append(document.createTextNode('⌘ + L to get AI assistant'))
    return wrap
  }

  ignoreEvent(): boolean {
    return false
  }
}

class PromptWidget extends WidgetType {
  plugin: AstraEditorPromptPlugin

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

    const container = document.createElement('div')
    container.className = 'prompt-container'

    const buttonGenerateContent = 'Generate <i>⌘ + ↩</i>'
    container.innerHTML = `
      <div class='prompt-wrap'>
        <textarea class='prompt-fake-editor' style='visibility:hidden; position:absolute; height:1px;'></textarea>
        <textarea class='prompt-editor' style='height:50px;' placeholder='I am EZQL, your personal database assistant, how can I help you?'></textarea>
        <div class='prompt-error' style='display:none'></div>
        <div class='prompt-action'>
          <div>
            <button id='prompt-generate'>${buttonGenerateContent}</button>
          </div>
          <div>
            <button id='prompt-reject'>Reject <i>⌘ + Z</i></button>
          </div>
          <div style='flex-grow:1; justify-content: end; align-items:center;'>Esc to close</div>
        </div>
      </div>
    `

    const input = container.querySelector('.prompt-editor') as HTMLTextAreaElement

    const fakeInput = container.querySelector('.prompt-fake-editor') as HTMLTextAreaElement

    const errorMessage = container.querySelector('.prompt-error') as HTMLDivElement

    const generateButton = container.querySelector('#prompt-generate') as HTMLButtonElement

    const rejectButton = container.querySelector('#prompt-reject') as HTMLButtonElement

    const generateQuery = () => {
      generateButton.innerHTML = `
        <svg class='spin' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader">
          <path d="M12 2v4"/>
          <path d="m16.2 7.8 2.9-2.9"/>
          <path d="M18 12h4"/>
          <path d="m16.2 16.2 2.9 2.9"/>
          <path d="M12 18v4"/>
          <path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/>
          <path d="m4.9 4.9 2.9 2.9"/>
        </svg> ${buttonGenerateContent}`

      input.disabled = true
      generateButton.disabled = true
      errorMessage.style.display = 'none'

      this.plugin
        .getSuggestion(input.value)
        .then((r) => {
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
        })
        .catch((e) => {
          errorMessage.style.display = 'flex'
          errorMessage.innerText = e.toString()
        })
        .finally(() => {
          input.disabled = false
          input.focus()
          input.select()
          generateButton.disabled = false
          generateButton.innerHTML = buttonGenerateContent
        })
    }

    const rejectQuery = () => {
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

      input.focus()
      input.select()
    }

    rejectButton.addEventListener('click', rejectQuery)
    generateButton.addEventListener('click', generateQuery)

    input.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })

    input.addEventListener('paste', (e) => {
      e.stopPropagation()
    })

    input.addEventListener('copy', (e) => {
      e.stopPropagation()
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        view.dispatch({ effects: [effectHidePrompt.of(null)] })
        setTimeout(() => view.focus(), 50)
        e.preventDefault()
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        generateQuery()
        e.preventDefault()
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        rejectQuery()
        e.preventDefault()
      }

      e.stopPropagation()
    })

    input.addEventListener('keyup', (e) => {
      // Adjust the height input
      fakeInput.value = input.value
      input.style.height = Math.max(fakeInput.scrollHeight, 50) + 'px'
      e.stopPropagation()
    })

    input.addEventListener('keypress', (e) => {
      e.stopPropagation()
    })

    setTimeout(() => input.focus(), 20)

    container.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })

    return container
  }

  destroy(): void {
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
      key: 'Ctrl-l',
      mac: 'Cmd-l',
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
  isActive: boolean = false

  @property() token: string = ''

  promptCallback?: PromptCallback

  connectedCallback() {
    super.connectedCallback()

    this.editor.addStyle(
      'prompt',
      `
      .prompt-container {
        display: flex;
        flex-direction: column;
        padding: 5px 10px;
      }

      .prompt-wrap {
        position: relative;
        border: 1px solid #aaa;
        border-radius: 5px;
        width: 100%;
        max-width: 500px;
        height: auto;
        display: flex;
        flex-direction: column;
      }

      .dark .prompt-wrap {
        border: 1px solid #555;
      }

      .prompt-error {
        display: flex;
        padding: 5px 8px;
        color: red;
      }

      .prompt-wrap textarea {
        resize: none;
        overflow: hidden;
        border: none;
        padding: 5px 10px;
        outline: none;
        box-sizing: border-box;
        width: 100%;
        background: inherit;
        color: inherit;
      }

      .prompt-action {
        display: flex;
        padding: 5px 10px;
        gap: 5px;
      }

      .prompt-action button {
        cursor: pointer;
        display: flex;
        background: #404040;
        color: white;
        border-radius: 4px;
        border: none;
        padding: 5px;
      }

      .prompt-action button:hover {
        background: #171717;
      }

      .prompt-action button i {
        display: inline-flex;
        align-items: center;
        height: 100%;
        padding: 0 5px;
        font-style: normal;
        font-size: 0.6rem;
        background: #606060;
        border-radius: 3px;
      }

      .dark .prompt-action button {
        background: #e5e5e5;
        color: black;
      }

      .dark .prompt-action button:hover {
        background: white;
      }

      .dark .prompt-action button i {
        background: #c5c5c5;
      }

      .prompt-action div {
        display: flex;
      }

      .prompt-line-preview {
        background: #abf7b1;
      }

      .dark .prompt-line-preview {
        background: #4C5A2C;
      }

      #prompt-generate {
        display: flex;
      }
    `
    )

    this.editor.updateExtension('prompt', [promptKeyBinding, createPromptStatePlugin(this)])
  }

  disconnectedCallback() {
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
