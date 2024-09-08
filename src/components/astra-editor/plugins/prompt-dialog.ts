import { css, html, LitElement, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

const MINIMAL_HEIGHT = 40

const LoadingSvg = `<svg class='spin' xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader">
  <path d="M12 2v4"/>
  <path d="m16.2 7.8 2.9-2.9"/>
  <path d="M18 12h4"/>
  <path d="m16.2 16.2 2.9 2.9"/>
  <path d="M12 18v4"/>
  <path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/>
  <path d="m4.9 4.9 2.9 2.9"/>
</svg>`

@customElement('astra-editor-prompt-dialog')
export default class PromptDialog extends LitElement {
  @property() theme: string = 'light'
  @property({ type: Boolean }) loading: boolean = false
  @property() error: string = ''
  @property() previousPrompt: string = ''
  @property({ type: Boolean }) showReject: boolean = false

  @state() text: string = ''
  @state() inputHeight = MINIMAL_HEIGHT

  protected inputRef: Ref<HTMLTextAreaElement> = createRef()
  protected inputFakeRef: Ref<HTMLTextAreaElement> = createRef()

  static styles = css`
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 12px;
      cursor: pointer;
    }

    .spin {
      animation-name: spin;
      animation-duration: 1000ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    .container {
      display: flex;
      flex-direction: column;
      padding: 5px 10px;
      color: black;
      white-space: normal;
      font-family:
        Inter,
        Helvetica,
        ui-sans-serif,
        system-ui,
        sans-serif,
        Apple Color Emoji,
        Segoe UI Emoji,
        Segoe UI Symbol,
        Noto Color Emoji;
    }

    .dark.container {
      color: white;
    }

    .wrap {
      position: relative;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      width: 100%;
      max-width: 500px;
      height: auto;
      display: flex;
      flex-direction: column;
      padding: 5px;
    }

    .dark .wrap {
      border: 1px solid #262626;
    }

    .error {
      display: flex;
      padding: 5px 10px;
      color: red;
      font-size: 13px;
    }

    textarea {
      resize: none;
      overflow: hidden;
      border: none;
      padding: 10px;
      padding-right: 30px;
      outline: none;
      box-sizing: border-box;
      width: 100%;
      font-family: inherit;
      background: inherit;
      color: inherit;
    }

    .actions {
      display: flex;
      padding: 5px 10px;
      gap: 5px;
    }

    button {
      cursor: pointer;
      display: flex;
      border-radius: 4px;
      border: none;
      padding: 4px 10px;
      background: inherit;
      justify-items: center;
      align-items: center;
      gap: 4px;
      color: #888;
    }

    .primary {
      background: #404040;
      color: white;
    }

    .primary:hover {
      background: #171717;
    }

    .primary:disabled,
    .primary:disabled:hover {
      opacity: 0.4;
    }

    .dark .primary {
      background: #e5e7eb;
      color: black;
    }

    .muted {
      color: #a3a3a3;
    }

    .dark .muted {
      color: #737373;
    }
  `

  focus() {
    this.inputRef.value?.focus()
  }

  select() {
    this.inputRef.value?.select()
  }

  triggerGenerate(text: string) {
    if (text) {
      this.dispatchEvent(new CustomEvent('generate', { detail: text }))
    }
  }

  triggerAccept() {
    this.dispatchEvent(new CustomEvent('accept'))
  }

  triggerReject() {
    this.dispatchEvent(new CustomEvent('reject'))
  }

  triggerClose() {
    this.dispatchEvent(new CustomEvent('close'))
  }

  protected shouldShowAcceptButton() {
    if (!this.previousPrompt) return false
    return this.previousPrompt === this.text
  }

  protected shouldShowSubmitEditButton() {
    if (!this.previousPrompt) return false
    return this.previousPrompt !== this.text
  }

  protected shouldShowGenerateButton() {
    return !this.previousPrompt
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties)
    const inputRef = this.inputRef.value

    // This prevent main editor to steal this event from input
    if (inputRef) {
      inputRef.addEventListener('paste', (e) => {
        e.stopPropagation()
      })

      inputRef.addEventListener('copy', (e) => {
        e.stopPropagation()
      })
    }
  }

  render() {
    return html`<div
      class=${`container ${this.theme}`}
      @mousedown=${(e: KeyboardEvent) => {
        // Prevent main editor from stealing focus
        // from our prompt text area
        e.stopPropagation()
      }}
    >
      <div class="wrap">
        <div class="close" @click=${this.triggerClose}>✕</div>
        <textarea
          ${ref(this.inputFakeRef)}
          style="visibility:hidden; position:absolute; height:1px; right:5px; left: 5px; width:auto;"
        ></textarea>
        <textarea
          ${ref(this.inputRef)}
          @input="${(e: any) => {
            this.text = e.target.value
          }}"
          @keyup=${(e: KeyboardEvent) => {
            const inputFakeRef = this.inputFakeRef.value
            const inputRef = this.inputRef.value
            if (!inputFakeRef || !inputRef) return

            inputFakeRef.value = inputRef.value

            // Auto resize the height of the editor to fit the text
            const newHeight = Math.max(inputFakeRef.scrollHeight, MINIMAL_HEIGHT)
            this.inputHeight = newHeight

            e.stopPropagation()
          }}
          @keydown=${(e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              if (this.shouldShowAcceptButton()) {
                this.triggerAccept()
                e.preventDefault()
              } else if (this.shouldShowSubmitEditButton()) {
                this.triggerGenerate(this.text)
                e.preventDefault()
              }
            } else if (!e.shiftKey && e.key === 'Enter') {
              if (this.shouldShowGenerateButton()) {
                this.triggerGenerate(this.text)
              }
              e.preventDefault()
            } else if (e.key === 'Escape') {
              this.triggerClose()
              e.preventDefault()
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
              this.triggerReject()
              e.preventDefault()
            }

            e.stopPropagation()
          }}
          .value="${this.text}"
          style="height:${this.inputHeight}px;"
          placeholder="Enter text to generate SQL..."
        ></textarea>

        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}

        <div class="actions">
          ${this.shouldShowGenerateButton() || this.shouldShowSubmitEditButton()
            ? html`
                <button
                  class="primary"
                  ?disabled=${this.loading || !this.text}
                  @click=${() => {
                    this.triggerGenerate(this.text)
                  }}
                >
                  ${this.loading
                    ? unsafeHTML(LoadingSvg)
                    : html`<span style="min-width:13px">${this.shouldShowGenerateButton() ? '↩' : '⌘↩'}</span>`}
                  ${this.shouldShowGenerateButton() ? 'Generate' : 'Submit Edit'}
                </button>
              `
            : nothing}
          ${this.shouldShowAcceptButton()
            ? html` <button class="primary" @click=${this.triggerAccept}>
                <span>⌘↩</span>
                <span>Accept</span>
              </button>`
            : nothing}

          <button style=${this.showReject ? 'display:block' : 'display:none'} @click=${this.triggerReject}>
            <span>⌘⌫</span>
            <span>Reject</span>
          </button>
          <div class="muted" style="display:flex; flex-grow:1; justify-content: end; align-items:center; font-size: 13px;">
            ${this.previousPrompt ? 'Edit prompt to continue chat' : 'esc to close'}
          </div>
        </div>
      </div>
    </div>`
  }
}
