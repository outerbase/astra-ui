import { acceptCompletion, autocompletion, closeBracketsKeymap, completionStatus, startCompletion } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap, indentLess, indentMore, insertNewline } from '@codemirror/commands'
import { defaultHighlightStyle, foldKeymap, indentOnInput, indentUnit, language, syntaxHighlighting } from '@codemirror/language'
import { Compartment, EditorState, Prec, StateEffect, type Extension } from '@codemirror/state'
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
import { css, html, LitElement, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { getPredefineTheme } from './theme.js'

@customElement('astra-editor')
export class AstraEditor extends LitElement {
  protected editor?: EditorView
  protected extensions: { name: string; comp: Compartment; ext: Extension }[] = []
  protected containerRef: Ref<HTMLDivElement> = createRef()
  protected previousValue: string = ''

  @property() color: string = 'light'
  @property({ type: Boolean }) wrap: boolean = false
  @property() theme: string = 'moondust'
  @property() placeholder: string = ''
  @property() value: string = ''
  @property({ type: Boolean }) readonly: boolean = false

  @state() styleSheets: { name: string; styles: string }[] = []

  static styles = css`
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .spin {
      animation-name: spin;
      animation-duration: 1000ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    .cm-tooltip-autocomplete ul::-webkit-scrollbar,
    .cm-scroller::-webkit-scrollbar {
      width: 6px;
      height: 6px;
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
      content: '\\61' !important;
      font-family: 'outerbase-icon' !important;
    }

    .cm-completionIcon-type::after {
      content: '\\62' !important;
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

  constructor() {
    super()

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
  }

  protected firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties)

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
          indentUnit.of('    '),
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
      {
        name: 'placeholder',
        ext: placeholder(this.placeholder),
        comp: new Compartment(),
      },
      {
        name: 'readonly',
        ext: EditorState.readOnly.of(this.readonly),
        comp: new Compartment(),
      },
      {
        name: 'theme',
        ext: getPredefineTheme(this.color === 'dark' ? 'dark' : 'light', this.theme),
        comp: new Compartment(),
      },
      {
        name: 'onchange',
        ext: EditorView.updateListener.of((vu: ViewUpdate) => {
          if (vu.docChanged) {
            const value = vu.state.doc.toString()
            this.value = value
            this.previousValue = value
            this.dispatchEvent(new CustomEvent('change', { detail: value }))
          }
        }),
        comp: new Compartment(),
      },
      ...this.extensions,
    ]

    const editor = new EditorView({
      doc: this.value,
      extensions: this.getExtensions(),
      parent: this.containerRef.value,
      root: this.shadowRoot as ShadowRoot,
    })

    this.editor = editor
  }

  protected updated(properties: PropertyValues<this>): void {
    super.updated(properties)

    if (properties.has('color')) {
      if (this.color === 'dark') {
        this.containerRef?.value?.classList.add('dark')
      } else {
        this.containerRef?.value?.classList.remove('dark')
      }

      this.updateExtension('theme', getPredefineTheme(this.color === 'dark' ? 'dark' : 'light', this.theme))
    }
    if (properties.has('theme')) {
      this.updateExtension('theme', getPredefineTheme(this.color === 'dark' ? 'dark' : 'light', this.theme))
    }

    if (properties.has('wrap')) {
      if (this.wrap) {
        this.updateExtension('line-wrap', EditorView.lineWrapping)
      } else {
        this.removeExtension('line-wrap')
      }
    }

    if (properties.has('placeholder')) {
      this.updateExtension('placeholder', placeholder(this.placeholder))
    }

    if (properties.has('value')) {
      if (this.editor && this.value !== this.previousValue) {
        this.previousValue = this.value
        this.editor.dispatch({
          changes: {
            from: 0,
            to: this.editor.state.doc.length,
            insert: this.value,
          },
        })
      }
    }

    if (properties.has('readonly')) {
      this.updateExtension('readonly', EditorState.readOnly.of(this.readonly))
    }
  }

  render() {
    return html`
      ${this.styleSheets.map(
        ({ styles }) =>
          html`<style>
            ${styles}
          </style>`
      )}
      <div id="container" style="height:100%" ${ref(this.containerRef)}></div>
    `
  }

  private getExtensions() {
    return [
      EditorView.theme({
        '&': {
          height: '100%',
        },
        '& .cm-line': {
          borderLeft: '3px solid transparent',
          paddingLeft: '10px',
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

  getLanguage() {
    if (this.editor) {
      return this.editor.state.facet(language)
    }
  }

  getEditorView() {
    return this.editor
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

  addStyle(name: string, styles: string) {
    this.styleSheets = [...this.styleSheets, { name, styles }]
  }

  removeStyle(name: string) {
    this.styleSheets = this.styleSheets.filter((s) => s.name !== name)
  }
}
