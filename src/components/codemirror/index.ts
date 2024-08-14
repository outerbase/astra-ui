import { acceptCompletion, autocompletion, closeBracketsKeymap, completionStatus, startCompletion } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap, indentLess, indentMore } from '@codemirror/commands'
import { defaultHighlightStyle, foldKeymap, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { Compartment, StateEffect, type Extension } from '@codemirror/state'
import { dropCursor, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers, ViewUpdate } from '@codemirror/view'
import { EditorView } from 'codemirror'
import { LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { getPredefineTheme } from './theme'

@customElement('code-mirror')
export class CodeMirror extends LitElement {
  protected container: HTMLDivElement
  protected editor?: EditorView
  protected extensions: { name: string; comp: Compartment; ext: Extension }[] = []

  protected _value: string = ''
  protected _wrap: boolean = false
  protected _color: 'dark' | 'light' = 'light'
  protected _theme: string = 'moondust'

  constructor() {
    super()

    const container = document.createElement('div')
    container.style.height = '100%'

    this.attachShadow({ mode: 'open' })
    this.shadowRoot?.append(container)

    this.container = container
  }

  connectedCallback(): void {
    this._color = this.getAttribute('color') === 'dark' ? 'dark' : 'light'
    this._theme = this.getAttribute('theme') ?? 'moondust'

    // Default extensions
    this.extensions = [
      {
        name: 'basic-setup',
        ext: [
          lineNumbers(),
          highlightActiveLineGutter(),
          history(),
          dropCursor(),
          indentOnInput(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          autocompletion(),
          highlightActiveLine(),
          indentUnit.of('  '),
          keymap.of([
            {
              key: 'Tab',
              preventDefault: true,
              run: (target) => {
                if (completionStatus(target.state) === 'active') {
                  acceptCompletion(target)
                } else {
                  indentMore(target)
                }
                return true
              },
              shift: indentLess,
            },
            {
              key: 'Ctrl-Space',
              mac: 'Cmd-i',
              preventDefault: true,
              run: startCompletion,
            },
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...foldKeymap,
          ]),
        ],
        comp: new Compartment(),
      },
      {
        name: 'theme',
        ext: getPredefineTheme(this._color, this._theme),
        comp: new Compartment(),
      },
      {
        name: 'onchange',
        ext: EditorView.updateListener.of((vu: ViewUpdate) => {
          if (vu.docChanged) {
            const value = vu.state.doc.toString()
            this._value = value
            this.dispatchEvent(new CustomEvent('change', { detail: value }))
          }
        }),
        comp: new Compartment(),
      },
    ]

    const editor = new EditorView({
      doc: this.getAttribute('value') ?? '',
      extensions: this.getExtensions(),
      parent: this.container,
      root: this.shadowRoot as ShadowRoot,
    })

    this.editor = editor
  }

  render() {
    return this.container
  }

  @property() set value(value: string) {
    if (this.editor) {
      if (value !== this._value) {
        this.editor.dispatch({
          changes: {
            from: 0,
            to: this.editor.state.doc.length,
            insert: value,
          },
        })
      }
    }
  }

  get value(): string {
    return this._value
  }

  @property() set wrap(value: string | null) {
    if (value !== null) {
      this._wrap = true
      this.updateExtension('line-wrap', EditorView.lineWrapping)
    } else {
      this._wrap = false
      this.removeExtension('line-wrap')
    }
  }

  get wrap(): boolean {
    return this._wrap
  }

  @property() set color(value: string | null) {
    this._color = value === 'dark' ? 'dark' : 'light'
    this.updateExtension('theme', getPredefineTheme(this._color, this._theme))
  }

  get color() {
    return this._color
  }

  @property() set theme(value: string) {
    this._theme = value
    this.updateExtension('theme', getPredefineTheme(this._color, this._theme))
  }

  get theme() {
    return this._theme
  }

  private getExtensions() {
    return [
      EditorView.theme({
        '&': {
          height: '100%',
        },
        '&.cm-scroller': {
          height: '100% !important',
        },
        '&.cm-focused': {
          outline: 'none !important',
        },
      }),
      ...this.extensions.map((ext) => ext.comp.of(ext.ext)),
    ]
  }

  updateExtension(extensionName: string, ext: any) {
    const exist = this.extensions.find(({ name }) => extensionName === name)

    if (!exist) {
      const extEntry = {
        name: extensionName,
        comp: new Compartment(),
        ext,
      }

      this.extensions.push(extEntry)

      if (this.editor) {
        this.editor.dispatch({
          effects: [StateEffect.appendConfig.of(extEntry.comp.of(ext))],
        })
      }
    } else {
      exist.ext = ext
      if (this.editor) {
        this.editor.dispatch({
          effects: [exist.comp.reconfigure(ext)],
        })
      }
    }
  }

  removeExtension(name: string) {
    const extIndex = this.extensions.findIndex((ext) => ext.name === name)
    if (extIndex >= 0) {
      this.extensions.splice(extIndex, 1)

      if (this.editor) {
        this.editor.dispatch({
          effects: StateEffect.reconfigure.of(this.getExtensions()),
        })
      }
    }
  }
}
