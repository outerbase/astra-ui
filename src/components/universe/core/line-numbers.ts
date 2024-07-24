import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('line-numbers')
export class LineNumbers extends LitElement {
  @property({ type: Boolean }) isFocused = false

  static styles = css`
    #line-number-container {
      padding: var(--padding-horizontal);
      font-family: var(--font-family-mono);
      font-size: var(--font-size);
      line-height: var(--line-height);
      color: var(--color-neutral-500);
      text-align: right;
      user-select: none;
    }

    .dark #line-number-container {
      color: var(--color-neutral-400);
    }

    .active-line-number {
      color: var(--color-neutral-800);
    }

    .dark .active-line-number {
      color: var(--color-neutral-50);
    }
  `

  connectedCallback() {
    super.connectedCallback()
    this.attachEventListeners()
  }

  private attachEventListeners() {
    const parentComponent = this.parentNode?.shadowRoot || this.parentNode
    console.log('parentComponent', parentComponent)
    if (parentComponent) {
      const editor = parentComponent.querySelector('.editor')
      if (editor) {
        editor.addEventListener('focus', () => this.onFocus())
        editor.addEventListener('blur', () => this.onBlur())
        editor.addEventListener('mousedown', () => this.updateActives())
        editor.addEventListener('keydown', () => this.updateActives())
        editor.addEventListener('input', () => this.onInputChange())
      }
    }
  }

  private onFocus() {
    this.isFocused = true
  }

  private onBlur() {
    this.isFocused = false
    this.unhighlightAllLineNumbers()
  }

  private onInputChange() {
    this.updateLineNumbers()
    this.updateActives()
  }

  private updateActives() {
    requestAnimationFrame(() => {
      this.highlightActiveLineNumber()
    })
  }

  private updateLineNumbers() {
    const parentComponent = this.parentNode?.shadowRoot || this.parentNode
    if (parentComponent) {
      const editor = parentComponent.querySelector('.editor')
      if (editor) {
        const lineCount = editor.value.split('\n').length
        const lineNumberContainer = this.shadowRoot?.getElementById('line-number-container')
        lineNumberContainer.innerHTML = '' // Clear existing line numbers

        for (let i = 1; i <= lineCount; i++) {
          const lineNumberDiv = document.createElement('div')
          lineNumberDiv.textContent = `${i}`
          lineNumberContainer.appendChild(lineNumberDiv)
        }
      }
    }
  }

  private highlightActiveLineNumber() {
    const parentComponent = this.parentNode?.shadowRoot || this.parentNode
    if (parentComponent) {
      const editor = parentComponent.querySelector('.editor')
      if (editor) {
        const selectionStart = editor.selectionStart
        const selectionEnd = editor.selectionEnd
        const startLineNumber = editor.value.substring(0, selectionStart).split('\n').length
        const endLineNumber = editor.value.substring(0, selectionEnd).split('\n').length
        const lineNumberContainer = this.shadowRoot?.getElementById('line-number-container')
        const lineNumbers = lineNumberContainer.children

        this.unhighlightAllLineNumbers()

        for (let i = startLineNumber; i <= endLineNumber; i++) {
          const lineNumberDiv = lineNumbers[i - 1] as HTMLElement
          lineNumberDiv?.classList.add('active-line-number')
        }
      }
    }
  }

  private unhighlightAllLineNumbers() {
    const lineNumberContainer = this.shadowRoot?.getElementById('line-number-container')
    if (lineNumberContainer) {
      Array.from(lineNumberContainer.children).forEach((line) => {
        ;(line as HTMLElement).classList.remove('active-line-number')
      })
    }
  }

  render() {
    return html` <div id="line-number-container"></div> `
  }
}
