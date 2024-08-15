import { acceptCompletion, autocompletion, closeBracketsKeymap, completionStatus, startCompletion } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap, indentLess, indentMore, insertNewline } from '@codemirror/commands'
import { defaultHighlightStyle, foldKeymap, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { Compartment, Prec, StateEffect, type Extension } from '@codemirror/state'
import {
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  placeholder,
  ViewUpdate,
  type KeyBinding,
} from '@codemirror/view'
import { EditorView } from 'codemirror'
import { LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { getPredefineTheme } from './theme'

@customElement('astra-editor')
export class AstraEditor extends LitElement {
  protected container: HTMLDivElement
  protected editor?: EditorView
  protected extensions: { name: string; comp: Compartment; ext: Extension }[] = []

  protected _value: string = ''
  protected _wrap: boolean = false
  protected _color: 'dark' | 'light' = 'light'
  protected _theme: string = 'moondust'
  protected _placeholder: string = ''

  constructor() {
    super()

    const container = document.createElement('div')
    container.style.height = '100%'

    this.attachShadow({ mode: 'open' })
    this.shadowRoot?.append(container)

    // We will use icon font instead of SVG because CodeMirror rely
    // on :after content. It is easily to change the color of the icon
    // when we toggle dark/light mode.
    //
    // We append it to document instead of shadowRoot because browser
    // does not support loading font dynamically inside shadowRoot
    //
    // To construct the font, you can do it on
    // https://icomoon.io/app/
    // \62 => https://phosphoricons.com/?q=%22column%22
    // \61 => https://phosphoricons.com/?q=%22table%22
    if (!document.getElementById('codemirror-custom-font')) {
      const head = document.head || document.getElementsByTagName('head')[0]
      const iconFontStyle = document.createElement('style')
      iconFontStyle.id = 'codemirror-custom-font'
      head.appendChild(iconFontStyle)

      iconFontStyle.innerHTML = `
        @font-face {
            font-family: 'outerbase-icon';
            font-weight: normal;
            font-style: normal;
            font-display: block;
            src: url(data:@file/octet-stream;base64,d09GRgABAAAAAAVQAAsAAAAABQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxEM4WNtYXAAAAFoAAAAVAAAAFT/9AFKZ2FzcAAAAbwAAAAIAAAACAAAABBnbHlmAAABxAAAAUAAAAFAAL6X5WhlYWQAAAMEAAAANgAAADYogzvlaGhlYQAAAzwAAAAkAAAAJAdiA8dobXR4AAADYAAAABgAAAAYDgAAAGxvY2EAAAN4AAAADgAAAA4AyAB0bWF4cAAAA4gAAAAgAAAAIAANADJuYW1lAAADqAAAAYYAAAGGmUoJ+3Bvc3QAAAUwAAAAIAAAACAAAwAAAAMDVQGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAQAAAAGIDwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAwAAAAMAAAAcAAEAAwAAABwAAwABAAAAHAAEADgAAAAKAAgAAgACAAEAIABi//3//wAAAAAAIABh//3//wAB/+P/owADAAEAAAAAAAAAAAAAAAEAAf//AA8AAQAA/8AAAAPAAAIAADc5AQAAAAABAAD/wAAAA8AAAgAANzkBAAAAAAEAAP/AAAADwAACAAA3OQEAAAAABAAA/8ADQAPAABMAFwArAC8AAAEjIgYVMREUFjMxMzI2NTERNCYjESMRMyUjIgYVMREUFjMxMzI2NTERNCYjESMRMwGgoBslJRugGyUlG6CgAWCgGyUlG6AbJSUboKADQCUb/YAbJSUbAoAbJf1AAoBAJRv9gBslJRsCgBsl/UACgAAABgAA/8ADoAPAABMAFwAbAB8AIwAnAAABISIGFTERFBYzMSEyNjUxETQmIwEzFSM3IRUhARUhNREzFSMpATUhA4D9AA0TJRsCwBslEw39IKCg4AHg/iAB4P1AoKACwP4gAeADABMN/eAbJSUbAiANE/8AgICAAUCAgP6AgIAAAAABAAAAAAAAbqA4a18PPPUACwQAAAAAAOLie7QAAAAA4uJ7tAAA/8ADoAPAAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAOgAAEAAAAAAAAAAAAAAAAAAAAGBAAAAAAAAAAAAAAAAgAAAAQAAAAEAAAAAAAAAAAKABQAHgBgAKAAAAABAAAABgAwAAYAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEABwAAAAEAAAAAAAIABwBgAAEAAAAAAAMABwA2AAEAAAAAAAQABwB1AAEAAAAAAAUACwAVAAEAAAAAAAYABwBLAAEAAAAAAAoAGgCKAAMAAQQJAAEADgAHAAMAAQQJAAIADgBnAAMAAQQJAAMADgA9AAMAAQQJAAQADgB8AAMAAQQJAAUAFgAgAAMAAQQJAAYADgBSAAMAAQQJAAoANACkaWNvbW9vbgBpAGMAbwBtAG8AbwBuVmVyc2lvbiAxLjAAVgBlAHIAcwBpAG8AbgAgADEALgAwaWNvbW9vbgBpAGMAbwBtAG8AbwBuaWNvbW9vbgBpAGMAbwBtAG8AbwBuUmVndWxhcgBSAGUAZwB1AGwAYQByaWNvbW9vbgBpAGMAbwBtAG8AbwBuRm9udCBnZW5lcmF0ZWQgYnkgSWNvTW9vbi4ARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAASQBjAG8ATQBvAG8AbgAuAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==) format('woff2');
        }  
      `
    }

    const styleElement = document.createElement('style')
    styleElement.innerHTML = `
      .cm-tooltip-autocomplete ul::-webkit-scrollbar,
      .cm-scroller::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      .cm-scroller::-webkit-scrollbar-thumb {
        border-radius: 5px;
      }

      .cm-tooltip-autocomplete ul::-webkit-scrollbar-thumb,
      .cm-scroller::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.3);
      }

      .dark .cm-tooltip-autocomplete ul::-webkit-scrollbar-thumb, 
      .dark .cm-scroller::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
      }

      .cm-tooltip-autocomplete > ul > li {
        display: flex;
      }

      .cm-tooltip-autocomplete > ul > li > .cm-completionIcon {
        width: 1em !important;
        display: flex;
        align-self: center;
        justify-content: center;
      }

      .cm-tooltip-autocomplete .cm-completionLabel {
        flex-grow: 1;
      }

      .cm-tooltip-autocomplete .cm-completionDetail {
        padding-left: 15px;
      }
      
      .cm-completionIcon-property::after {
        content: "\\61" !important;
        font-family: 'outerbase-icon' !important;
      }

      .cm-completionIcon-type::after {
        content: "\\62" !important;
        font-family: 'outerbase-icon' !important;
      }

      .cm-completionIcon-function::after,
      .cm-completionIcon-method::after,
      .cm-completionIcon-variable::after,
      .cm-completionIcon-namespace::after,
      .cm-completionIcon-interface::after {
        content: '⚡' !important;
      }
    `

    this.shadowRoot?.append(styleElement)

    this.container = container
  }

  connectedCallback(): void {
    this._color = this.getAttribute('color') === 'dark' ? 'dark' : 'light'
    this._theme = this.getAttribute('theme') ?? 'moondust'
    this._placeholder = this.getAttribute('placeholder') ?? ''

    if (this._color === 'dark') {
      this.container.classList.add('dark')
    } else {
      this.container.classList.remove('dark')
    }

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
              key: 'Shift-Enter',
              preventDefault: true,
              run: insertNewline,
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
      { name: 'placeholder', ext: placeholder(this._placeholder), comp: new Compartment() },
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

    if (this._color === 'dark') {
      this.container.classList.add('dark')
    } else {
      this.container.classList.remove('dark')
    }

    this.updateExtension('theme', getPredefineTheme(this._color, this._theme))
  }

  get color() {
    return this._color
  }

  @property() set placeholder(value: string | null) {
    this._placeholder = value ?? ''
    this.updateExtension('placeholder', placeholder(this._placeholder))
  }

  get placeholder() {
    return this._placeholder
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

  registerKeymap(name: string, key: KeyBinding) {
    this.updateExtension('custom-keybinding-' + name, Prec.highest(keymap.of([key])))
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
