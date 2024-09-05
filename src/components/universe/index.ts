import { css, html, type PropertyValueMap, type TemplateResult } from 'lit'
import type { DirectiveResult } from 'lit/async-directive.js'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import debounce from 'lodash-es/debounce'
import * as Prism from 'prismjs'
import 'prismjs/components/prism-sql'

import { classMap } from 'lit/directives/class-map.js'
import { ClassifiedElement } from '../classified-element.js'
import SQL_EXAMPLE_TEXT from './sql-text-snippet.js'

@customElement('text-editor')
export class TextEditor extends ClassifiedElement {
  static styles = [
    ...ClassifiedElement.styles,
    css`
      #container {
        border-color: var(--border-color, transparent);
      }

      #line-numbers {
        color: var(--line-number-fg-color, rgb(255 255 255 / 0.4));
        background-color: var(--line-number-bg-color, rgb(113 113 122 / 0.1));
      }

      #displayed-code {
        color: var(--code-fg-color, rgb(255 255 255 / 0.8));
        background-color: var(--code-bg-color, rgb(244 244 245 / 0.1));
      }

      .active-line {
        background-color: var(--active-line-bg-color, rgb(255 255 255 / 0.2));
      }

      textarea {
        caret-color: var(--caret-color, #a3e635);
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
        color: var(--keyword-fg-color, white);
        font-weight: var(--keyword-weight, bold);
        font-style: var(--keyword-style, italic);
        text-decoration: var(--keyword-decoration, underline);
      }

      .punctuation {
        color: var(--punctuation-fg-color, white);
      }

      .operator {
        font-style: var(--operator-style, italic);
        font-weight: var(--operator-weight, bold);
        color: var(--operator-fg-color, white);
      }

      .comment {
        font-style: italic;
        color: var(--comment-fg-color, inherit);
        opacity: var(--comment-opacity, 0.2);
      }

      .boolean {
        text-decoration: var(--boolean-decoration, underline);
        font-style: var(--boolean-style, italic);
      }
      .number {
        color: var(--number-fg-color, inherit);
        text-decoration: var(--number-decoration, underline);
        font-style: var(--number-style, italic);
      }
      .string {
        color: var(--string-fg-color, inherit);
        text-decoration: var(--string-decoration, underline);
        font-style: var(--string-style, italic);
      }
      .variable {
        color: var(--variable-fg-color, inherit);
      }
      .function {
        color: var(--function-fg-color, inherit);
      }
      .invalid {
        color: var(--invalid-fg-color, inherit);
      }
    `,
  ]

  public textareaRef: Ref<HTMLTextAreaElement> = createRef()

  @property({ type: Boolean, attribute: 'wrap' }) wordWrap = false
  @property() text = SQL_EXAMPLE_TEXT
  @state() cursorX = 0
  @state() cursorY = 0

  @state() public hasSelectedText = false
  @state() protected highlightedCode?: DirectiveResult
  @state() protected lines: Array<TemplateResult> = []
  @state() protected activeLineNumber?: number
  @state() protected cache: Array<number> = []

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
      <div id="container" class="font-mono flex flex-row border-4 w-full h-full relative">
        <!-- positions a div immediately following the cursor; useful for, say, a context menu -->
        <div class="absolute z-10 ml-12" style="top: ${this.cursorY}px; left: ${this.cursorX}px"><slot name="cursor" /></div>

        <div class="flex flex-none h-full w-full no-scrollbar">
          <!-- line numbers  -->
          <div
            id="line-numbers"
            class="px-3 text-right select-none flex-none overflow-y-scroll overscroll-contain no-scrollbar"
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
              class="top-0 bottom-0 left-0 right-0 absolute  select-none overflow-scroll overscroll-contain no-scrollbar"
              ${ref(this.displayedCodeRef)}
            >
              ${this.lines.map(
                (item, index) =>
                  html`<code
                    class="w-full block language-sql 
                      ${classMap({
                      'whitespace-break-spaces': this.wordWrap,
                      'whitespace-pre': !this.wordWrap,
                      'active-line': this.activeLineNumber === index + 1 && !this.hasSelectedText,
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
              class="resize-none top-0 pt-[3px] bottom-0 left-0 right-0 absolute focus:outline-none no-scrollbar bg-transparent text-transparent ${classMap(
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

                this.updateCursorPosition()
              }}"
              @mouseup="${() => {
                this.updateActiveCodeLine()
                this.updateCursorPosition()
              }}"
              @keydown="${() => {
                this.updateActiveCodeLine()
                this.updateCursorPosition()
              }}"
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
    this.updateCursorPosition()
  }

  private handleResize() {
    this.updateLineCache()
  }

  private updateActiveCodeLine() {
    const textarea = this.textareaRef.value!
    setTimeout(() => {
      const cursorPosition = textarea.selectionStart
      const textUntilCursor = textarea.value.substring(0, cursorPosition)
      this.activeLineNumber = textUntilCursor.split('\n').length
      this.handleSelectionChange()
    })
  }

  public computeLineHeight(): number {
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
        lineNumbers.push(html`<div class="h-[${singleLineHeight}px] leading-[${singleLineHeight}px]">${i === 0 ? lineNumber : '.'}</div>`)
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

  getMonospaceCharWidth(textarea: HTMLElement) {
    const testChar = 'A'
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    const style = window.getComputedStyle(textarea)

    context.font = `${style.fontSize} ${style.fontFamily}`
    return context.measureText(testChar).width
  }

  calculateHeight(text: string, textarea: HTMLElement) {
    const style = window.getComputedStyle(textarea)
    const div = document.createElement('div')

    div.style.position = 'absolute'
    div.style.visibility = 'hidden'
    div.style.whiteSpace = 'pre-wrap'
    div.style.wordWrap = this.wordWrap ? 'break-word' : 'normal'
    div.style.width = this.wordWrap ? `${textarea.clientWidth}px` : 'auto'
    div.style.font = style.font
    div.style.lineHeight = style.lineHeight
    div.textContent = text

    document.body.appendChild(div)
    const height = div.offsetHeight
    document.body.removeChild(div)

    return height
  }

  calculateWrappedLineCount(text: string, textarea: HTMLElement) {
    const style = window.getComputedStyle(textarea)
    const div = document.createElement('div')

    div.style.position = 'absolute'
    div.style.visibility = 'hidden'
    div.style.whiteSpace = 'pre-wrap'
    div.style.wordWrap = this.wordWrap ? 'break-word' : 'normal'
    div.style.width = this.wordWrap ? `${textarea.clientWidth}px` : 'auto'
    div.style.font = style.font
    div.style.lineHeight = style.lineHeight
    div.textContent = text

    document.body.appendChild(div)
    const lineCount = Math.ceil(div.scrollHeight / parseInt(style.lineHeight))
    document.body.removeChild(div)

    return lineCount
  }

  calculateWrappedLineWidth(text: string, textarea: HTMLElement) {
    const style = window.getComputedStyle(textarea)
    const div = document.createElement('div')

    div.style.position = 'absolute'
    div.style.visibility = 'hidden'
    div.style.whiteSpace = 'pre-wrap'
    div.style.wordWrap = this.wordWrap ? 'break-word' : 'normal'
    div.style.width = this.wordWrap ? `${textarea.clientWidth}px` : 'auto'
    div.style.font = style.font
    div.style.lineHeight = style.lineHeight
    div.textContent = text

    document.body.appendChild(div)
    const width = div.scrollWidth
    document.body.removeChild(div)

    return width
  }

  updateCursorPosition() {
    const textarea = this.textareaRef.value!
    const characterWidth = this.getMonospaceCharWidth(textarea)

    setTimeout(() => {
      const cursorPosition = textarea.selectionStart
      const textBeforeCursor = textarea.value.substring(0, cursorPosition)
      const lines = textBeforeCursor.split('\n')

      const lineHeight = 24 // assuming each line has a fixed height of 24px
      const leftOffset = 0 // assuming a left margin offset of 12px

      let totalLines = 0

      // Calculate total number of lines, including wrapped lines
      lines.forEach((line) => {
        if (line.length === 0) {
          totalLines += 1
        } else {
          totalLines += this.wordWrap ? this.calculateWrappedLineCount(line, textarea) : 1
        }
      })

      const lastLine = lines[lines.length - 1]
      const wrappedLineWidth = this.wordWrap ? this.calculateWrappedLineWidth(lastLine, textarea) : 0
      const charCountInCurrentLine = lastLine.length

      const top = totalLines * lineHeight + 2

      // Calculate the wrapped line x position
      const visibleWidth = textarea.clientWidth
      const wrappedLineCount = this.wordWrap ? Math.ceil(wrappedLineWidth / visibleWidth) : 1
      const lastLineTextWidth = this.wordWrap ? wrappedLineWidth % visibleWidth : 0
      const isWrappedLine = this.wordWrap && wrappedLineCount > 1

      let left
      if (isWrappedLine) {
        const lastWrappedLineText = lastLine.slice(-Math.floor(lastLineTextWidth / characterWidth))
        left = leftOffset + lastWrappedLineText.length * characterWidth
      } else {
        // Handle the first character on the line
        if (charCountInCurrentLine === 0 || lastLine === '\n') {
          left = leftOffset
        } else {
          left = leftOffset + charCountInCurrentLine * characterWidth
        }
      }

      this.cursorY = top - textarea.scrollTop - 3
      this.cursorX = left - textarea.scrollLeft
      this.requestUpdate()
    })
  }
}
