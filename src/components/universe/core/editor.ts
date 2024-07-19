import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import Prism from 'prismjs'
import 'prismjs/components/prism-sql.js'
import baseStyles from '../../../lib/base-styles.js'

@customElement('universe-core-editor')
export default class UniverseCoreEditor extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        --font-family-mono: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        --font-size: 13px;
        --line-height: 18px;
        --padding-horizontal: 0 10px;

        --color-neutral-50: #fafafa;
        --color-neutral-100: #f5f5f5;
        --color-neutral-200: #e5e5e5;
        --color-neutral-300: #d4d4d4;
        --color-neutral-400: #a3a3a3;
        --color-neutral-500: #737373;
        --color-neutral-600: #525252;
        --color-neutral-700: #404040;
        --color-neutral-800: #262626;
        --color-neutral-900: #171717;
        --color-neutral-950: #0a0a0a;
        --color-primary-dark: white;
        --color-primary-light: black;

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      ::-moz-selection {
        background: var(--astra-neutral-300);
      }

      ::selection {
        background: var(--astra-neutral-300);
      }

      .dark ::-moz-selection {
        background: var(--astra-neutral-700);
      }

      .dark ::selection {
        background: var(--astra-neutral-700);
      }

      #code-container {
        flex: 1;
        position: relative;
        overflow: scroll;
        min-height: 100%;
        -ms-overflow-style: none;
        scrollbar-width: none;

        // remove these
        width: 100%;
        height: 800px;
        border: 1px solid lime;
      }

      #code-container::-webkit-scrollbar {
        display: none;
      }

      textarea,
      code,
      #placeholder {
        padding: var(--padding-horizontal);
        white-space: pre;
        overflow-wrap: normal;
        word-wrap: normal;
      }

      textarea {
        resize: none;
        outline: none;
        overflow: hidden;
      }

      pre,
      textarea,
      code,
      #placeholder {
        margin: 0 !important;
        min-height: 100%;
        min-width: calc(100% - 20px);
        background-color: transparent;
        font-family: var(--font-family-mono);
        font-size: var(--font-size);
        line-height: var(--line-height);
      }

      .editor,
      pre,
      code {
        z-index: 2;
      }

      .editor {
        color: transparent;
        caret-color: var(--color-primary-light);
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        left: 0;
        top: 0;
        overflow-x: hidden;
      }

      .dark .editor {
        caret-color: var(--color-primary-dark);
      }

      pre {
        padding: 0;
      }

      code {
        pointer-events: none;
        position: absolute;
        top: 0px;
        left: 0px;
        width: calc(100% - 20px);
        height: 100%;
        color: var(--color-primary-light);
      }

      #placeholder {
        z-index: 1;
        position: absolute;
      }
    `,
  ]

  @property() placeholder = '-- Enter SQL statement here'
  @property() language = 'sql'
  @property() mode = 'dark'
  @property() theme = 'freedom'
  @property() code = `SELECT 
    CASE 
        WHEN u.email IS NULL OR u.email = '' THEN CONCAT('user_', u.id::text) 
        ELSE u.email 
    END AS user_identifier, 
    COUNT(ae.id) as events_count 
FROM workspace_profile.analytics_event ae 
JOIN user_profile.user u ON ae.user_id = u.id 
WHERE ae.created_at > (CURRENT_TIMESTAMP - INTERVAL '24 HOURS') 
GROUP BY user_identifier 
ORDER BY events_count DESC;
`

  private editor: HTMLTextAreaElement | null = null
  editorRef = createRef() // Declared as a class property
  codeRef = createRef() // Declared as a class property
  codeContainerRef = createRef() // Declared as a class property

  private visualizer: HTMLElement | null = null
  private codeContainer: HTMLElement | null = null
  private placeholderElement: HTMLElement | null = null

  firstUpdated() {
    this.init()
    this.editor = this.editorRef.value as HTMLTextAreaElement // Type assertion
    this.visualizer = this.codeRef.value as HTMLElement
    this.codeContainer = this.codeContainerRef.value as HTMLElement
  }

  init() {
    this.placeholderElement = this.shadowRoot!.getElementById('placeholder') as HTMLElement

    if (this.placeholderElement) {
      this.placeholderElement.innerText = this.placeholder
      this.placeholderElement.className = `language-${this.language}`
    }

    if (this.visualizer) {
      this.visualizer.className = `language-${this.language}`
    }

    Prism.highlightElement(this.placeholderElement!)
  }

  render() {
    return html`
      <div id="container" class="moondust light">
        <div id="layout-container">
          <div id="left"></div>
          <div id="center"></div>
          <div id="right"></div>
        </div>
      </div>

      <div id="code-container">
        <pre id="placeholder"></pre>
        <textarea
          ${ref(this.editorRef)}
          class="editor"
          spellcheck="false"
          .value=${this.code}
          @focus="${this.onFocus}"
          @blur="${this.onBlur}"
          @mousedown="${() => {
            this.broadcastEvent('onMouseDown')
          }}"
          @mouseup="${() => this.broadcastEvent('onMouseUp')}"
          @mousemove="${() => this.broadcastEvent('onMouseMove')}"
          @keydown="${(event: KeyboardEvent) => this.broadcastEvent('onKeyDown', event)}"
          @keyup="${(event: KeyboardEvent) => this.broadcastEvent('onKeyUp', event)}"
          @input="${(event: Event) => this.onInputChange((event.target as HTMLTextAreaElement).value)}"
        >
        </textarea>
        <pre><code ${ref(this.codeRef)}></code></pre>
      </div>
    `
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('code')) {
      this.onInputChange(this.code)
    }
  }

  private onFocus() {
    this.broadcastEvent('onFocus')
  }

  private onBlur() {
    this.broadcastEvent('onBlur')
  }

  private onInputChange(value: string) {
    if (!this.editor || !this.visualizer) return

    if (value.length === 0) {
      this.placeholderElement!.style.opacity = '1'
      this.placeholderElement!.innerText = this.placeholder
    } else {
      this.placeholderElement!.style.opacity = '0'
    }

    this.editor.value = value
    this.visualizer.innerHTML = value
    this._adjustTextAreaSize()

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value } }))
    Prism.highlightElement(this.placeholderElement!)
    Prism.highlightElement(this.visualizer!)
  }

  private _adjustTextAreaSize() {
    const lineHeight = parseFloat(getComputedStyle(this.editor!).lineHeight)
    const lineCount = this.editor!.value.split('\n').length
    const height = lineCount * lineHeight
    const widthPadding = 8

    const lines = this.editor!.value.split('\n')
    let width = 0
    const characterWidth = 7.87
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineWidth = line.length * characterWidth
      width = Math.max(width, lineWidth)
    }

    this.editor!.style.width = `${width + widthPadding}px`
    this.editor!.style.height = `${height}px`
  }

  private broadcastEvent(eventName: string, detail: any = null) {
    this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true, detail }))
  }

  attributeName() {
    return 'core'
  }
}
