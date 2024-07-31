import { css, html, type PropertyValueMap, type TemplateResult } from 'lit'
import type { DirectiveResult } from 'lit/async-directive.js'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import * as Prism from 'prismjs'
import 'prismjs/components/prism-sql'

import { classMap } from 'lit/directives/class-map.js'
import debounce from 'lodash-es/debounce'
import { ClassifiedElement } from '../classified-element'
import SQL_EXAMPLE_TEXT from './sql-text-snippet'

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
    css`
      .keyword {
        color: white;
        font-weight: bold;
        // font-style: italic;
        // text-decoration: underline;
      }

      .punctuation {
        color: white;
      }

      .operator {
        // font-style: italic;
        font-weight: bold;
        color: white;
      }

      .comment {
        font-style: italic;
        // color: aqua;
        opacity: 0.2;
      }

      .boolean,
      .number,
      .string {
        // text-decoration: underline;
        font-style: italic;
      }
    `,
  ]

  public textareaRef: Ref<HTMLTextAreaElement> = createRef()

  @property({ type: Boolean, attribute: 'wrap' }) wordWrap = false
  @property() text = SQL_EXAMPLE_TEXT

  @state() protected highlightedCode?: DirectiveResult
  @state() protected lines: Array<TemplateResult> = []
  @state() protected activeLineNumber?: number
  @state() protected hasSelectedText = false
  @state() private cache: Array<number> = []

  private displayedCodeRef: Ref<HTMLElement> = createRef()
  private lineNumbersRef: Ref<HTMLElement> = createRef()
  private scrollerRef: Ref<HTMLElement> = createRef()
  private computedLineHeight: number | null = null

  override connectedCallback() {
    super.connectedCallback()
    this.updateLineCache()

    // Add resize event listeners
    window.addEventListener('resize', this.handleResize)
    this.addEventListener('resize', this.handleResize)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()

    // Remove resize event listeners
    window.removeEventListener('resize', this.handleResize)
    this.removeEventListener('resize', this.handleResize)
  }

  override firstUpdated(changedProperties: PropertyValueMap<this>) {
    super.firstUpdated(changedProperties)
    this.updateLineCache() // update again after initial render (otherwise line numbers may fail to handle text wrapping in the editor)
  }

  override render() {
    return html`
      <div class="font-mono flex flex-row border-4 border-transparent w-full h-full">
        <div class="flex flex-none h-full w-full no-scrollbar">
          <!-- line numbers  -->
          <div
            class="px-3 bg-zinc-500/10 text-right text-white/40 select-none flex-none overflow-y-scroll overscroll-contain no-scrollbar"
            @scroll="${() => {
              // immediately synchronize the displayed code
              if (this.displayedCodeRef.value) {
                this.displayedCodeRef.value.scrollTop = this.lineNumbersRef.value!.scrollTop
              }

              // delayed updating of the textarea's scroll position
              this.handleScrollEnd()
            }}"
            ${ref(this.lineNumbersRef)}
          >
            ${this.getLineNumbers()}
          </div>

          <div ${ref(this.scrollerRef)} class="relative h-full w-full cursor-text ml-1">
            <div
              id="displayed-code"
              class="top-0 bottom-0 left-0 right-0 absolute text-white/80 select-none overflow-scroll overscroll-contain no-scrollbar"
              ${ref(this.displayedCodeRef)}
            >
              ${this.lines.map(
                (item, index) =>
                  html`<code
                    class="w-full block language-sql 
                      ${classMap({
                      'whitespace-break-spaces': this.wordWrap,
                      'whitespace-pre': !this.wordWrap,
                      'bg-white/20': this.activeLineNumber === index + 1 && !this.hasSelectedText,
                    })}
                      "
                    id="line-${index + 1}"
                    >${item}</code
                  >`
              )}
            </div>

            <!-- pt-[3px] here slightly breaks the alignment (if the text weren't transparent), but better aligns the cursor with the <code>'s background highlight effect -->
            <textarea
              autocorrect="off"
              spellcheck="false"
              class="resize-none top-0 pt-[3px] bottom-0 left-0 right-0 absolute focus:outline-none no-scrollbar caret-lime-400 bg-zinc-100/10 text-transparent ${classMap(
                {
                  'whitespace-pre': !this.wordWrap,
                }
              )}"
              .value="${this.text}"
              @input="${this.onInput}"
              @scroll="${() => {
                if (this.lineNumbersRef.value) {
                  this.lineNumbersRef.value.scrollTop = this.textareaRef.value!.scrollTop
                }
                if (this.displayedCodeRef.value) {
                  this.displayedCodeRef.value.scrollTop = this.textareaRef.value!.scrollTop // this doesn't appear to be necessary and seems to reduce the smoothness of momentum scrolling
                  this.displayedCodeRef.value.scrollLeft = this.textareaRef.value!.scrollLeft
                }
              }}"
              @mouseup="${this.updateActiveCodeLine}"
              @keydown="${this.updateActiveCodeLine}"
              @blur="${() => (this.activeLineNumber = undefined)}"
              @select="${this.handleSelectionChange}"
              ${ref(this.textareaRef)}
            ></textarea>
          </div>
        </div>
      </div>
    `
  }

  public updateLineCache() {
    const previousValue = this.lines
    this.cache = []

    // WITHOUT PRISM
    // this.lines = (value ?? this.text).split('\n').map((s, index) => {
    //   const line = html`${s === '' ? html`<pre>&nbsp;</pre>` : unsafeHTML(s)}`;
    //   this.cache[index] = this.shadowRoot!.getElementById(`line-${index}`)?.offsetHeight || 0;
    //   return line;
    // });

    // WITH PRISM
    const highlightedCode = Prism.highlight(this.text, Prism.languages.sql, 'sql')
    this.lines = highlightedCode.split('\n').map((s, index) => {
      const line = html`${s === '' ? html`<pre>&nbsp;</pre>` : unsafeHTML(s)}`
      this.cache[index] = this.shadowRoot!.getElementById(`line-${index + 1}`)?.offsetHeight || 0
      return line
    })

    this.requestUpdate('_lines', previousValue)
  }

  private onInput(event: InputEvent) {
    const textarea = event.target as HTMLTextAreaElement
    this.text = textarea.value
    this.updateLineCache()
    this.handleSelectionChange()
  }

  private handleResize() {
    this.updateLineCache()
  }

  private updateActiveCodeLine() {
    const textarea = this.textareaRef.value
    if (textarea) {
      setTimeout(() => {
        const cursorPosition = textarea.selectionStart
        const textUntilCursor = textarea.value.substring(0, cursorPosition)
        this.activeLineNumber = textUntilCursor.split('\n').length
        this.handleSelectionChange()
      })
    }
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
      lineNumbers.push(html`<div class="h-[${singleLineHeight}px] leading-[${singleLineHeight}px]">1</div>`)
    }

    // add numbers for each line, including wrapped content
    this.lines.forEach((_line, idx) => {
      const currentLineHeight = this.cache[idx] ?? singleLineHeight
      const wrappedLines = Math.max(Math.ceil(currentLineHeight / singleLineHeight), 1)
      for (let i = 0; i < wrappedLines; i++) {
        lineNumbers.push(
          html`<div class="h-[${singleLineHeight}px] leading-[${singleLineHeight}px] ${i > 0 ? 'text-zinc-300/30' : ''}">
            ${i === 0 ? lineNumber : '.'}
          </div>`
        )
      }
      lineNumber++
    })

    return html`${lineNumbers}`
  }

  private handleSelectionChange() {
    setTimeout(() => (this.hasSelectedText = this.textareaRef.value?.selectionEnd !== this.textareaRef.value?.selectionStart))
  }

  // keeping the textarea in sync while scrolling interferes with momentum/smoothness
  // so we update it when scrolling ends instead
  private handleScrollEnd = debounce(() => {
    if (this.textareaRef.value) {
      this.textareaRef.value.scrollTop = this.lineNumbersRef.value!.scrollTop
    }
  }, 100)
}
