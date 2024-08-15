import { CompletionContext } from '@codemirror/autocomplete'
import { SQLite } from '@codemirror/lang-sql'
import { syntaxTree } from '@codemirror/language'
import { Range } from '@codemirror/state'
import { Decoration, EditorView, ViewPlugin, ViewUpdate, type DecorationSet } from '@codemirror/view'
import { customElement, property } from 'lit/decorators.js'

import { AstraEditorPlugin } from './base'

const handlebarMark = Decoration.mark({ class: 'cm-handlebar' })

function decorateHandlebar(view: EditorView) {
  const decorationList: Range<Decoration>[] = []

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to)

    for (const match of text.matchAll(/(\{\{[\w\d-_]+\}\})|(\[\[[\w\d-_]+\]\])/g)) {
      decorationList.push(handlebarMark.range(from + match.index, from + match.index + match[0].length))
    }
  }

  return Decoration.set(decorationList)
}

@customElement('astra-editor-handlebar')
export class AstraEditorHandlerbarPlugin extends AstraEditorPlugin {
  protected _variables: string = ''

  @property() set variables(value: string) {
    this._variables = value
    this.setupExtension(value ?? '')
  }

  get variables(): string {
    return this._variables
  }

  connectedCallback() {
    super.connectedCallback()
    this.setupExtension(this.getAttribute('variables') ?? '')
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.editor.removeExtension('handlebars')
  }

  setupAutoCompletion(variables: string) {
    const completionList = variables.split(',').filter(Boolean)
    if (completionList.length === 0) return null

    function handlebarCompletion(context: CompletionContext) {
      const node = syntaxTree(context.state).resolveInner(context.pos)

      let ptr = node.parent
      if (ptr?.type.name !== 'Braces' && ptr?.type.name !== 'Brackets') return null

      return {
        from: node.from + 1,
        options: completionList.map((variableName) => ({
          label: variableName,
          type: 'variable',
        })),
      }
    }

    return SQLite.language.data.of({ autocomplete: handlebarCompletion })
  }

  setupExtension(variables: string) {
    if (!this.editor) return

    const markHandlebarPlugin = ViewPlugin.fromClass(
      class {
        decorations: DecorationSet
        constructor(view: EditorView) {
          this.decorations = decorateHandlebar(view)
        }
        update(update: ViewUpdate) {
          this.decorations = decorateHandlebar(update.view)
        }
      },
      { decorations: (v) => v.decorations }
    )

    const markHandlebarTheme = EditorView.baseTheme({
      '.cm-handlebar': {
        backgroundColor: '#3498db',
        color: '#fff',
        padding: '1px',
        border: '1px solid #22a6b3',
      },
      '&dark .cm-handlebar': {
        backgroundColor: '#9b59b6',
        color: '#fff',
        padding: '1px',
        border: '1px solid #8e44ad',
      },
    })

    this.editor.updateExtension(
      'handlebars',
      [markHandlebarPlugin, markHandlebarTheme, this.setupAutoCompletion(variables)].filter(Boolean)
    )
  }
}
