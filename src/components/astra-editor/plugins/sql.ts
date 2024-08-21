import { MSSQL, MySQL, PostgreSQL, sql, SQLDialect, SQLite, StandardSQL, type SQLNamespace } from '@codemirror/lang-sql'
import type { PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base.js'

@customElement('astra-editor-sql')
export class AstraEditorSqlPlugin extends AstraEditorPlugin {
  protected _schema: SQLNamespace = {}

  @property() dialect: string = 'sql'
  @property() schema: string = ''

  protected updated(properties: PropertyValues): void {
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

      this.editor.updateExtension(
        'sql-plugin',
        sql({
          dialect,
          schema: this._schema,
        })
      )
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
}
