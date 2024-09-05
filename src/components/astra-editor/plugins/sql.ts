import { MSSQL, MySQL, PostgreSQL, sql, SQLDialect, SQLite, StandardSQL, type SQLNamespace } from '@codemirror/lang-sql'
import type { PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base.js'
import SqlStatementHighlightPlugin, { resolveToNearestStatement, splitSqlQuery, type StatementSegment } from './sql-statement-highlight.js'

@customElement('astra-editor-sql')
export class AstraEditorSqlPlugin extends AstraEditorPlugin {
  protected _schema: SQLNamespace = {}

  @property() dialect: string = 'sql'
  @property() schema: string = ''

  protected updated(properties: PropertyValues): void {
    super.updated(properties)

    if (properties.has('dialect')) {
      this.updateExtension()
    }

    if (properties.has('schema')) {
      try {
        this._schema = JSON.parse(this.schema)
      } catch {
        this._schema = {}
      }

      this.updateExtension()
    }
  }

  protected updateExtension() {
    if (this.editor) {
      let dialect: SQLDialect = { mysql: MySQL, sqlite: SQLite, postgre: PostgreSQL, mssql: MSSQL }[this.dialect] ?? StandardSQL

      this.editor.updateExtension('sql-plugin', [
        sql({
          dialect,
          schema: this._schema,
        }),
        ...SqlStatementHighlightPlugin,
      ])
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.updateExtension()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.editor.removeExtension('sql-plugin')
  }

  getCurrentStatement() {
    const editor = this.editor.getEditorView()
    if (editor) {
      const segment = resolveToNearestStatement(editor.state)
      const text = editor.state.doc.sliceString(segment.from, segment.to)
      return { ...segment, text }
    }

    return { from: 0, to: 0, text: '' }
  }

  getAllStatements(): StatementSegment[] {
    const editor = this.editor.getEditorView()
    return editor ? splitSqlQuery(editor.state) : []
  }
}
