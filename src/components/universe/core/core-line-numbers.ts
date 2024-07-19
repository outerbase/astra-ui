import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('core-line-numbers')
export class CoreLineNumbers extends LitElement {
  @property({ type: String }) editorValue = ''
  @property({ type: String }) location = 'center'

  private editor: HTMLTextAreaElement | null = null
  private codeContainer: HTMLElement | null = null

  static styles = css`
    .background-highlight {
      position: absolute;
      min-width: 100%;
      height: var(--line-height);
      background-color: var(--color-neutral-200);
      opacity: 0;
      z-index: 1;
      pointer-events: none;
      border-radius: 4px;
      transition: transform 0.2s;
    }

    .dark .background-highlight {
      background-color: var(--color-neutral-800);
    }
  `

  firstUpdated() {
    this.editor = this.shadowRoot!.querySelector('.editor') as HTMLTextAreaElement
    this.codeContainer = this.shadowRoot!.getElementById('code-container') as HTMLElement
    this.addEventListeners()
  }

  private addEventListeners() {
    if (this.editor) {
      this.editor.addEventListener('focus', this.onFocus.bind(this))
      this.editor.addEventListener('blur', this.onBlur.bind(this))
      this.editor.addEventListener('mousedown', this.onMouseDown.bind(this))
      this.editor.addEventListener('keydown', this.onKeyDown.bind(this))
      this.editor.addEventListener('input', this.onInputChange.bind(this))
    }
  }

  private onFocus() {
    const backgroundHighlight = this.shadowRoot!.querySelector('.background-highlight') as HTMLElement
    backgroundHighlight.style.opacity = '1'
  }

  private onBlur() {
    const backgroundHighlight = this.shadowRoot!.querySelector('.background-highlight') as HTMLElement
    backgroundHighlight.style.opacity = '0'
  }

  private onMouseDown() {
    this.updateActives()
  }

  private onKeyDown() {
    this.updateActives()
  }

  private onInputChange() {
    this.updateActives()
  }

  private updateActives() {
    requestAnimationFrame(() => {
      this.highlightActiveLine()
    })
  }

  private highlightActiveLine() {
    if (!this.editor) return

    const lineHeight = parseFloat(getComputedStyle(this.editor).lineHeight)
    const lineNumber = this.editor.value.substr(0, this.editor.selectionStart).split('\n').length
    const highlightPosition = (lineNumber - 1) * lineHeight
    const backgroundHighlight = this.shadowRoot!.querySelector('.background-highlight') as HTMLElement

    requestAnimationFrame(() => {
      backgroundHighlight.style.top = `${highlightPosition}px`
      backgroundHighlight.style.width = this.editor!.style.width

      backgroundHighlight.style.transform = 'scaleY(1.25)'
      setTimeout(() => {
        backgroundHighlight.style.transform = 'scaleY(1)'
      }, 200)
    })
  }

  render() {
    return html`
      <div id="code-container" class="editor">
        <div class="background-highlight"></div>
      </div>
    `
  }
}
