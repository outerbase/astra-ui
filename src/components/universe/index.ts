import { css, html, type PropertyValueMap, type TemplateResult } from 'lit'
import type { DirectiveResult } from 'lit/async-directive.js'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import * as Prism from 'prismjs'
import 'prismjs/components/prism-sql'

import { ClassifiedElement } from '../classified-element'

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

  @property({ type: String, reflect: true }) id = 'myid'
  @property({ type: Boolean, attribute: 'wrap' }) wordWrap = false
  @property() private text = `-- Creating a table with various data types and constraints
CREATE TABLE employees (
    employee_id INT PRIMARY KEY, -- Primary key constraint
    first_name VARCHAR(50) NOT NULL, -- Not null constraint
    last_name VARCHAR(50) NOT NULL, -- Not null constraint
    email VARCHAR(100) NOT NULL UNIQUE, -- Unique constraint
    hire_date DATE NOT NULL, -- Not null constraint
    job_id INT NOT NULL, -- Not null constraint
    salary DECIMAL(10, 2) DEFAULT 0.00, -- Default value
    department_id INT, -- Column without constraint
    FOREIGN KEY (department_id) REFERENCES departments(department_id), -- Foreign key constraint
    CHECK (salary >= 0) -- Check constraint
);

-- Inserting values into the table with various operators blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah  
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, job_id, salary, department_id) VALUES 
(1, 'John', 'Doe', 'john.doe@example.com', '2023-01-15', 101, 60000.00, 1), -- Insert with direct values
(2, 'Jane', 'Smith', 'jane.smith@example.com', '2023-02-20', 102, 55000.00, 2), -- Insert with direct values
(3, 'Jim', 'Brown', 'jim.brown@example.com', '2023-03-30', 103, 52000.00, 3), -- Insert with direct values
(4, 'Emily', 'Davis', 'emily.davis@example.com', '2023-04-25', 104, 58000.00, 4), -- Insert with direct values
(5, 'Michael', 'Wilson', 'michael.wilson@example.com', '2023-05-10', 105, 63000.00, 1); -- Insert with direct values

-- Updating data with various operators
UPDATE employees 
SET salary = salary * 1.10 -- Multiplication operator to increase salary
WHERE hire_date < '2024-01-01' -- Comparison operator to filter records

-- Deleting records with a condition
DELETE FROM employees 
WHERE employee_id = 3; -- Equality operator to specify the record to delete

-- Selecting data with operators
SELECT e.employee_id, e.first_name, e.last_name, e.email, e.salary, d.department_name 
FROM employees e
JOIN departments d ON e.department_id = d.department_id -- Join operator
WHERE e.salary > 50000.00 -- Greater than operator to filter results
AND d.department_name = 'Sales' -- Equality operator to filter results
ORDER BY e.salary DESC; -- Order by operator to sort results

-- Creating an index for performance optimization
CREATE INDEX idx_employees_last_name 
ON employees(last_name); -- Index creation operator

-- Altering the table structure to add a new column
ALTER TABLE employees 
ADD COLUMN phone_number VARCHAR(20) AFTER email; -- Add column operator

-- Dropping a table if it exists
DROP TABLE IF EXISTS temporary_table; -- Drop table operator with existence check

-- Inserting data into a temporary table
INSERT INTO temporary_table (temp_id, temp_data, temp_date) 
VALUES (1, 'Sample data with a very long string that spans multiple words and is quite lengthy, intended to demonstrate extremely long line lengths in SQL code', '2024-07-24'), -- Insert with long text
       (2, 'Another sample with even more data included here to make the line extremely long and unwieldy, showcasing how lengthy SQL lines can become for demonstration purposes', '2024-07-25'); -- Insert with long text

-- Updating data in the temporary table
UPDATE temporary_table 
SET temp_data = CONCAT(temp_data, ' - Updated with a long concatenation string that extends beyond usual length, demonstrating the capability to handle very long text updates effectively in SQL'); -- Concatenation operator to update text
`
  @state() highlightedCode?: DirectiveResult
  @state() private cache: Array<number> = []
  @state() lines: Array<TemplateResult> = []

  private textareaRef: Ref<HTMLTextAreaElement> = createRef()
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

  private handleResize = () => {
    this.updateLineCache()
  }

  override firstUpdated(changedProperties: PropertyValueMap<this>) {
    super.firstUpdated(changedProperties)
    this.updateLineCache() // update again after initial render (otherwise line numbers may fail to handle text wrapping in the editor)
  }

  override render() {
    return html`
      <div class="font-mono flex flex-row border w-full h-full">
        <div class="flex flex-none h-full w-full no-scrollbar">
          <!-- line numbers  -->
          <div
            class="px-3 bg-zinc-500/10 text-right text-white/40 select-none flex-none overflow-auto overscroll-contain no-scrollbar"
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

          <div ${ref(this.scrollerRef)} class="relative h-full w-full cursor-text mx-1 overscroll-contain">
            <div
              id="displayed-code"
              class="top-0 bottom-0 left-0 right-0 absolute w-full text-white/80 select-none overflow-auto overscroll-contain no-scrollbar ${this
                .wordWrap
                ? ''
                : 'whitespace-nowrap'}"
              ${ref(this.displayedCodeRef)}
              @scroll="${() => {
                if (this.textareaRef.value) {
                  this.textareaRef.value.scrollLeft = this.displayedCodeRef.value!.scrollLeft
                }
              }}"
            >
              ${this.lines.map(
                (item, index) =>
                  html`<code
                    class="w-full ${this.wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'} block language-sql"
                    id="line-${index}"
                    >${item}</code
                  >`
              )}
            </div>

            <textarea
              autocorrect="off"
              spellcheck="false"
              class="resize-none top-0 bottom-0 left-0 right-0 absolute focus:outline-none overflow-auto overscroll-contain no-scrollbar caret-lime-400 bg-zinc-100/10 text-transparent ${this
                .wordWrap
                ? ''
                : 'whitespace-nowrap'}"
              .value="${this.text}"
              @input="${this.onInput}"
              @scroll="${() => {
                if (this.displayedCodeRef.value) {
                  this.displayedCodeRef.value.scrollTop = this.textareaRef.value!.scrollTop
                  this.displayedCodeRef.value.scrollLeft = this.textareaRef.value!.scrollLeft
                }
                if (this.lineNumbersRef.value) {
                  this.lineNumbersRef.value.scrollTop = this.textareaRef.value!.scrollTop
                }
              }}"
              ${ref(this.textareaRef)}
            ></textarea>
          </div>
        </div>
      </div>
    `
  }

  private onInput(event: InputEvent) {
    const textarea = event.target as HTMLTextAreaElement
    this.text = textarea.value
    this.updateLineCache()
  }

  protected updateLineCache() {
    const previousValue = this.lines
    this.cache = []

    // WITHOUT PRISM
    // this.lines = (value ?? this.text).split('\n').map((s, index) => {
    //   const line = html`${s === '' ? html`<pre>&nbsp;</pre>` : unsafeHTML(s)}`
    //   this.cache[index] = this.shadowRoot!.getElementById(`line-${index}`)?.offsetHeight || 0
    //   return line
    // })

    // WITH PRISM
    const highlightedCode = Prism.highlight(this.text, Prism.languages.sql, 'sql')
    this.lines = highlightedCode.split('\n').map((s, index) => {
      const line = html`${s === '' ? html`<pre>&nbsp;</pre>` : unsafeHTML(s)}`
      this.cache[index] = this.shadowRoot!.getElementById(`line-${index}`)?.offsetHeight || 0
      return line
    })

    this.requestUpdate('_lines', previousValue)
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

  public toggleLineComments() {
    const textarea = this.textareaRef.value
    const start = textarea!.selectionStart
    const end = textarea!.selectionEnd

    const commentCharacters = '-- '
    const uncommentCharacters = '--'
    const commentLength = commentCharacters.length
    const uncommentLength = uncommentCharacters.length

    // Find the start of the first line and the end of the last line in the selection
    const firstLineStart = this.text.lastIndexOf('\n', start - 1) + 1
    let lastLineEnd = this.text.indexOf('\n', end)
    lastLineEnd = lastLineEnd === -1 ? this.text.length : lastLineEnd

    const beforeSelection = this.text.substring(0, firstLineStart)
    const selectionText = this.text.substring(firstLineStart, lastLineEnd)
    const afterSelection = this.text.substring(lastLineEnd)
    const lines = selectionText.split('\n')

    // Check if all lines are commented out (ignoring leading whitespace)
    const allLinesCommented = lines.every((line) => {
      const trimmedLine = line.trimStart()
      return trimmedLine.startsWith(commentCharacters) || trimmedLine.startsWith(uncommentCharacters)
    })

    const updatedLines = lines.map((line) => {
      const trimmedLine = line.trimStart()
      const leadingWhitespace = line.slice(0, line.length - trimmedLine.length)

      if (allLinesCommented) {
        if (trimmedLine.startsWith(commentCharacters)) {
          return leadingWhitespace + trimmedLine.substring(commentLength)
        } else if (trimmedLine.startsWith(uncommentCharacters)) {
          return leadingWhitespace + trimmedLine.substring(uncommentLength)
        } else {
          return line
        }
      } else {
        return leadingWhitespace + commentCharacters + trimmedLine
      }
    })

    this.text = beforeSelection + updatedLines.join('\n') + afterSelection

    setTimeout(() => {
      const linesCount = lines.length
      const adjustment = allLinesCommented ? -uncommentLength : commentLength

      // Adjust the cursor position after adding/removing comments
      let newSelectionStart = start
      let newSelectionEnd = end
      if (allLinesCommented) {
        newSelectionStart = start - (start > firstLineStart ? commentLength : 0)
        newSelectionEnd = end - (end > firstLineStart ? commentLength * linesCount : 0)
      } else {
        newSelectionStart = start + (start > firstLineStart ? commentLength : 0)
        newSelectionEnd = end + (end > firstLineStart ? commentLength * linesCount : 0)
      }

      // Prevent selection from bleeding into the next line
      newSelectionStart = Math.min(newSelectionStart, this.text.length)
      newSelectionEnd = Math.min(newSelectionEnd, this.text.length)

      textarea!.selectionStart = newSelectionStart
      textarea!.selectionEnd = newSelectionEnd

      if (start === end) {
        // If there was no selection, just move the cursor to the adjusted position
        textarea!.selectionEnd = textarea!.selectionStart
      }
    })

    this.updateLineCache()
  }
}
