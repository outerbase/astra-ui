import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ArrowsClockwise } from '../icons/arrows-clockwise.js'
import type { APIResponse, Fields, Rows, SourceSchema, Table } from '../types.js'
import './button.js' // Ensure the button component is imported
import AstraTable from './table/index.js'

@customElement('outerbase-table')
export default class OuterbaseTable extends AstraTable {
  static override styles = [
    ...AstraTable.styles,
    css`
      :host {
        height: 100%;
      }
    `,
  ]

  @property({ attribute: 'api-key', type: String }) apiKey?: string
  @property({ attribute: 'workspace-id', type: String }) workspaceId?: string
  @property({ attribute: 'source-id', type: String }) sourceId?: string
  @property({ attribute: 'schema-name', type: String }) schemaName?: string
  @property({ attribute: 'table-name', type: String }) tableName?: string

  @state() offset = 0
  @state() limit?: number = 50
  @state() total?: number
  @state() fields?: Fields
  @state() sourceSchema?: SourceSchema
  @state() table?: Table

  protected async fetchSchema() {
    if (!(this.apiKey && this.sourceId && this.workspaceId)) {
      throw new Error('Fetching data requires an auth token, api key, base id, source id, and workspace id.')
    }

    const data: APIResponse<SourceSchema> = await (
      await fetch(`https://app.dev.outerbase.com/api/v1/workspace/${this.workspaceId}/source/${this.sourceId}/schema`, {
        headers: {
          'content-type': 'application/json',
          'x-auth-token': this.apiKey,
        },
      })
    ).json()

    return data.response
  }

  protected async fetchData() {
    if (!this.apiKey) throw new Error('Fetching data requires an api-key')
    if (!this.fields) throw new Error('Missing fields')

    const data: APIResponse<Rows> = await (
      await fetch(
        `https://app.dev.outerbase.com/api/v1/workspace/${this.workspaceId}/source/${this.sourceId}/table/${this.schemaName}/${this.tableName}/rows`,
        {
          body: `{"fields":${JSON.stringify(this.fields)},"filters":[],"include_count":true,"limit":${this.limit},"offset":${this.offset},"order":[]}`,
          headers: {
            'content-type': 'application/json',
            'x-auth-token': this.apiKey,
          },
          method: 'POST',
        }
      )
    ).json()

    return data.response
  }

  protected onClickAddRow(_event: MouseEvent) {
    this.addNewRow()
  }

  override async willUpdate(changedProperties: PropertyValueMap<this>) {
    super.willUpdate(changedProperties)

    const has = changedProperties.has.bind(changedProperties)
    if (
      (has('apiKey') || has('sourceId') || has('workspaceId') || has('schemaName') || has('tableName')) &&
      this.apiKey &&
      this.sourceId &&
      this.workspaceId &&
      this.schemaName &&
      this.tableName
    ) {
      this.sourceSchema = await this.fetchSchema()
      this.table = this.sourceSchema[this.schemaName]?.find(({ name }) => name === this.tableName)
      if (this.table) this.schema = { columns: this.table.columns }
      this.fields = this.table?.columns.map(({ name }) => ({ field: name, alias: name }))
    } else if (
      (has('apiKey') || has('sourceId') || has('workspaceId') || has('fields')) &&
      this.apiKey &&
      this.sourceId &&
      this.workspaceId &&
      this.fields
    ) {
      // fetch new rows
      const data = await this.fetchData()
      this.data = data.items.map((r) => ({
        id: self.crypto.randomUUID(),
        values: { ...r },
        originalValues: r,
        isNew: false,
      }))
      this.total = data.count
    }
  }

  public override render() {
    const table = super.render()
    return html`
      <div class=${classMap({ dark: this.theme === 'dark', 'flex flex-col h-full': true, 'bg-black': this.theme === 'dark' })}>
        <div class="flex flex-col h-full text-black dark:text-white">
          <div id="action-bar" class="h-12 font-medium dark:bg-neutral-950 items-center justify-end flex gap-2.5 text-sm p-2 rounded-t">
            <!-- TODO add 'Delete X Record(s)' -->
            <!-- TODO add 'Save changes' -->
            <astra-button size="compact" @click=${this.onClickAddRow} theme="dark">Add Row</astra-button>
            <astra-button size="compact" theme="dark">${ArrowsClockwise(16)}</astra-button>
          </div>

          <div class="relative flex-1">${table}</div>

          <div id="footer" class="h-12 font-medium dark:bg-neutral-950 items-center justify-end flex gap-2.5 text-sm p-2 rounded-b">
            <!-- TODO support pagination -->
            Viewing 1-${this.data.length} of ${this.data.length}
          </div>
        </div>
      </div>
    `
  }
}
