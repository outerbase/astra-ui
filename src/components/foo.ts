import { css, html, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { ClassifiedElement } from './classified-element'

@customElement('text-editor')
export class TextEditor extends ClassifiedElement {
  protected classMap() {
    return {
      foo: true,
      ...super.classMap(),
    }
  }

  static styles = [
    ...ClassifiedElement.styles,
    css`
      :host {
      }

      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }

      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  ]

  @property({ type: Boolean }) wordWrap = false
  @property() private text = `<div class="font-mono flex flex-row border w-full bg-green-500 h-[400px]">
    <div class="flex flex-none h-full w-full no-scrollbar">
      <div
        class="px-3 bg-zinc-500/10 text-right text-white/40 select-none flex-none overflow-auto no-scrollbar"
        @scroll="\${() => {
          if (this.displayedCodeRef.value) {
            this.displayedCodeRef.value.scrollTop = this.lineNumbersRef.value!.scrollTop
          }
          if (this.textareaRef.value) {
            this.textareaRef.value.scrollTop = this.lineNumbersRef.value!.scrollTop
          }
        }}"
      >`
  @state() private cache: Array<number> = []
  @state() _lines: Array<TemplateResult> = []
  get lines(): Array<TemplateResult> {
    return this._lines
  }
  set lines(value: string) {
    const previousValue = this._lines
    this.cache = []
    this._lines = value.split('\n').map((s, index) => {
      const line = html`${s === '' ? html`<pre>&nbsp;</pre>` : s}`
      this.cache[index] = this.shadowRoot!.getElementById(`line-${index}`)?.offsetHeight || 0
      return line
    })

    this.requestUpdate('_lines', previousValue)
  }

  private textareaRef: Ref<HTMLTextAreaElement> = createRef()
  private displayedCodeRef: Ref<HTMLElement> = createRef()
  private lineNumbersRef: Ref<HTMLElement> = createRef()
  private scrollerRef: Ref<HTMLElement> = createRef()
  private computedLineHeight: number | null = null

  override connectedCallback() {
    super.connectedCallback()
    this.lines = this.text
  }

  override firstUpdated() {
    this.updateLineNumbers() // update again after initial render (otherwise line numbers may fail to handle text wrapping in the editor)
  }

  override render() {
    return html`
      <div class="font-mono flex flex-row border w-full bg-green-500 h-[400px]">
        <div class="flex flex-none h-full w-full no-scrollbar">
          <div
            class="px-3 bg-zinc-500/10 text-right text-white/40 select-none flex-none overflow-auto no-scrollbar"
            @scroll="${() => {
              if (this.displayedCodeRef.value) {
                this.displayedCodeRef.value.scrollTop = this.lineNumbersRef.value!.scrollTop
              }
              if (this.textareaRef.value) {
                this.textareaRef.value.scrollTop = this.lineNumbersRef.value!.scrollTop
              }
            }}"
            ${ref(this.lineNumbersRef)}
          >
            ${this.getLineNumbers()}
          </div>

          <div ${ref(this.scrollerRef)} class="relative h-full w-full cursor-text mx-1">
            <textarea
              autocorrect="off"
              spellcheck="false"
              class="resize-none top-0 bottom-0 left-0 right-0 absolute focus:outline-none overflow-auto no-scrollbar caret-lime-400 bg-zinc-100/10 text-transparent"
              .value="${this.text}"
              @input="${this.onInput}"
              @scroll="${() => {
                if (this.displayedCodeRef.value) {
                  this.displayedCodeRef.value.scrollTop = this.textareaRef.value!.scrollTop
                }
                if (this.lineNumbersRef.value) {
                  this.lineNumbersRef.value.scrollTop = this.textareaRef.value!.scrollTop
                }
              }}"
              ${ref(this.textareaRef)}
            ></textarea>
            <div
              id="displayed-code"
              class="top-0 bottom-0 left-0 right-0 absolute w-full text-black select-none pointer-events-none z-1 overflow-auto no-scrollbar"
              ${ref(this.displayedCodeRef)}
            >
              ${this._lines.map((item, index) => html`<div class="w-full whitespace-pre-wrap" id="line-${index}">${item}</div>`)}
            </div>
          </div>
        </div>
      </div>
    `
  }

  private onInput(event: InputEvent) {
    const textarea = event.target as HTMLTextAreaElement
    this.text = textarea.value
    this.lines = this.text
  }

  private updateLineNumbers() {
    this.cache = []
    this._lines = this.text.split('\n').map((s, index) => {
      const line = html`${s === '' ? html`<pre>&nbsp;</pre>` : s}`
      this.cache[index] = this.shadowRoot!.getElementById(`line-${index}`)?.offsetHeight || this.computedLineHeight || 0
      return line
    })
  }

  private computeLineHeight(): number {
    if (this.computedLineHeight === null) {
      const tempElement = document.createElement('div')
      tempElement.style.visibility = 'hidden'
      tempElement.style.position = 'absolute'
      tempElement.style.height = 'auto'
      tempElement.style.whiteSpace = 'pre'
      tempElement.textContent = 'A'
      this.shadowRoot!.appendChild(tempElement)
      this.computedLineHeight = tempElement.offsetHeight
      this.shadowRoot!.removeChild(tempElement)
    }
    return this.computedLineHeight!
  }

  private getLineNumbers(): TemplateResult {
    const lineNumbers: Array<TemplateResult> = []
    let lineNumber = 1

    const singleLineHeight = this.computeLineHeight()

    // initial load before any text is entered
    if (this.lines.length === 0) {
      lineNumbers.push(html`<div class="whitespace-nowrap h-[${singleLineHeight}px] leading-[${singleLineHeight}px]">1</div>`)
    }

    // add numbers for each line, including wrapped content
    this.lines.forEach((line, idx) => {
      const currentLineHeight = this.cache[idx] ?? singleLineHeight
      const wrappedLines = Math.max(Math.ceil(currentLineHeight / singleLineHeight), 1)
      for (let i = 0; i < wrappedLines; i++) {
        lineNumbers.push(
          html`<div class="whitespace-nowrap h-[${singleLineHeight}px] leading-[${singleLineHeight}px] ${i > 0 ? 'text-zinc-300/30' : ''}">
            ${i === 0 ? lineNumber : '.'}
          </div>`
        )
      }
      lineNumber++
    })

    return html`${lineNumbers}`
  }
}
