import { CompletionContext } from '@codemirror/autocomplete'
import { MSSQL, MySQL, PostgreSQL, SQLite, StandardSQL } from '@codemirror/lang-sql'
import { syntaxTree } from '@codemirror/language'
import { Range } from '@codemirror/state'
import { Decoration, EditorView, ViewPlugin, ViewUpdate, type DecorationSet } from '@codemirror/view'
import type { PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base.js'

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
  @property() variables: string = ''

  protected updated(properties: PropertyValues): void {
    super.updated(properties)

    if (properties.has('variables')) {
      this.setupExtension()
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.setupExtension()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.editor.removeExtension('handlebars')
  }

  setupAutoCompletion() {
    const completionList = (this.variables ?? '').split(',').filter(Boolean)
    if (completionList.length === 0) return []

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

    return [
      StandardSQL.language.data.of({ autocomplete: handlebarCompletion }),
      SQLite.language.data.of({ autocomplete: handlebarCompletion }),
      MySQL.language.data.of({ autocomplete: handlebarCompletion }),
      MSSQL.language.data.of({ autocomplete: handlebarCompletion }),
      PostgreSQL.language.data.of({ autocomplete: handlebarCompletion }),
    ]
  }

  setupExtension() {
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

    this.editor.updateExtension('handlebars', [markHandlebarPlugin, markHandlebarTheme, ...this.setupAutoCompletion()])
  }
}
