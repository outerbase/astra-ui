import { MSSQL, MySQL, PostgreSQL, sql, SQLDialect, SQLite, StandardSQL, type SQLNamespace } from '@codemirror/lang-sql'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base'

@customElement('astra-editor-sql')
export class AstraEditorSqlPlugin extends AstraEditorPlugin {
  protected _schema: SQLNamespace = {}
  protected _dialect: string = 'sql'

  @property() set schema(value: string) {
    try {
      this._schema = JSON.parse(value)
    } catch {
      this._schema = {}
    }

    if (this.editor) {
      this.editor.updateExtension(
        'sql-plugin',
        sql({
          dialect: SQLite,
          schema: this._schema,
        })
      )
    }
  }

  get schema(): string {
    return JSON.stringify(this._schema)
  }

  @property() set dialect(value: string) {
    this._dialect = value
  }

  protected updateExtension() {
    if (this.editor) {
      let dialect: SQLDialect = { mysql: MySQL, sqlite: SQLite, postgre: PostgreSQL, mssql: MSSQL }[this._dialect] ?? StandardSQL

      this.editor.updateExtension(
        'sql-plugin',
        sql({
          dialect: dialect,
          schema: this._schema,
        })
      )
    }
  }

  connectedCallback() {
    super.connectedCallback()

    this.editor.updateExtension(
      'sql-plugin',
      sql({
        dialect: SQLite,
        schema: this._schema,
      })
    )
  }

  disconnectedCallback() {
    this.editor.removeExtension('sql-plugin')
  }
}
