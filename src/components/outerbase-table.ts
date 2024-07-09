import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { isEqual } from 'lodash-es'
import { ArrowsClockwise } from '../icons/arrows-clockwise.js'
import { diffObjects } from '../lib/diff-objects.js'
import { normalizeKeys } from '../lib/normalize-object-keys.js'
import type { APIResponse, CellUpdateEvent, Fields, MenuSelectedEvent, RowAsRecord, Rows, SourceSchema, Table } from '../types.js'
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

  @property({ attribute: 'starlink', type: String }) starlink?: string // contains api-key, workspace-id and base-id as query-params
  @property({ attribute: 'api-key', type: String }) apiKey?: string
  @property({ attribute: 'workspace-id', type: String }) workspaceId?: string
  @property({ attribute: 'base-id', type: String }) baseId?: string
  @property({ attribute: 'schema-name', type: String }) schemaName?: string
  @property({ attribute: 'table-name', type: String }) tableName?: string

  @state() offset = 0
  @state() limit?: number = 50
  @state() total?: number
  @state() fields?: Fields
  @state() sourceSchema?: SourceSchema
  @state() table?: Table
  @state() hasSelectedRows = false
  @state() hasChanges = false

  constructor() {
    super()
    this.onCellUpdated = this.onCellUpdated.bind(this)
    this.onMenuSelection = this.onMenuSelection.bind(this)
  }

  protected async fetchSchema() {
    if (!(this.apiKey && this.baseId && this.workspaceId)) {
      throw new Error('Fetching data requires an auth-token/api-key, base-id, and workspace id.')
    }

    const data: APIResponse<SourceSchema> = await (
      await fetch(`https://app.dev.outerbase.com/api/v1/workspace/${this.workspaceId}/base/${this.baseId}/schema`, {
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
        `https://app.dev.outerbase.com/api/v1/workspace/${this.workspaceId}/base/${this.baseId}/table/${this.schemaName}/${this.tableName}/rows`,
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

    // stringify all the values so user modifications are consistent with the "OG" data
    // i.e. +46 <=> "46"
    const stringifiedData: Record<string, string>[] = []
    data.response.items.forEach((row) => {
      const _row: Record<string, string> = {}
      Object.entries(row).forEach(([key, value]) => {
        const _key = key.toString()
        if (!_key || !value) return

        _row[_key] = value?.toString()
      })

      stringifiedData.push(_row)
    })

    return { ...data.response, items: stringifiedData }
  }

  protected detectChanges() {
    this.hasChanges =
      this.rows.some((r) => {
        // true when a new or deleted row
        if (r.isDeleted || r.isNew) return true

        // true when the current/original values differ
        const [normalizedOriginalValue, normalizedValues] = normalizeKeys(r.originalValues, r.values)
        return !isEqual(normalizedOriginalValue, normalizedValues)
      }) || this.newRows.length > 0
  }

  protected onAddRow(_event: MouseEvent) {
    this.addNewRow()
  }

  protected async onRefresh() {
    // fetch new rows
    const data = await this.fetchData()
    this.data = data.items.map((r) => ({
      id: self.crypto.randomUUID(),
      values: { ...r },
      originalValues: { ...r },
      isNew: false,
      isDeleted: false,
    }))
    this.total = data.count
  }

  protected onDeleteRows(_event: Event) {
    const rowsToBeDeleted = this.rows.filter((r) => this.selectedRowUUIDs.has(r.id)) // non-new selected rows
    rowsToBeDeleted.forEach((r) => (r.isDeleted = true)) // mark for deletion
    this.requestUpdate('rows')
    this.clearSelection()
    this.detectChanges()
  }

  protected async onSaveRows() {
    if (!(this.apiKey && this.baseId && this.workspaceId)) {
      throw new Error('Saving data requires an auth-token/api-key, base-id, and workspace id.')
    }

    const created: Array<RowAsRecord> = []
    const deleted: Array<RowAsRecord> = []
    const modified: Array<RowAsRecord> = []

    // determine which rows are created/deleted/modified
    this.rows.forEach((r) => {
      if (r.isNew && !r.isDeleted) created.push(r)
      else if (r.isDeleted && !r.isNew) deleted.push(r)
      else if (!r.isDeleted && !r.isNew) {
        // check if modified
        const [normalizedOriginalValue, normalizedValues] = normalizeKeys(r.originalValues, r.values)
        if (!isEqual(normalizedOriginalValue, normalizedValues)) modified.push(r)
      }
    })

    const primaryColumn = this.table?.constraints.find(({ type }) => type?.toLowerCase().includes('primary'))?.column
    const body = {
      create: created.map((r) => r.values),
      update: modified.map((r) => ({
        where: primaryColumn ? { [primaryColumn]: r.originalValues[primaryColumn] } : r.originalValues, // single primary key, OR all original values
        set: diffObjects(r.values, r.originalValues), // only values that are different from the original
      })),
      remove: deleted.map((r) => (primaryColumn ? { [primaryColumn]: r.originalValues[primaryColumn] } : r.originalValues)),
    }

    const result = await fetch(
      `https://app.dev.outerbase.com/api/v1/workspace/${this.workspaceId}/base/${this.baseId}/table/${this.schemaName}/${this.tableName}/rows`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.apiKey,
        },
      }
    )

    this.onRefresh()
  }

  protected onDiscardChanges() {
    // this.clearSelection()
    this.resetValues()
    this.hasChanges = false
  }

  protected onCellUpdated(event: Event) {
    const cellUpdateEvent = event as CellUpdateEvent
    const { column, row: rowId } = cellUpdateEvent.detail.position

    // find this row in our collection
    const row = this.rows.find((r) => r.id === rowId)

    if (!row) throw new Error(`Failed to find row with ID = ${rowId}`)

    // update it's value to reflect the change
    row.values[column] = cellUpdateEvent.detail.value

    // update hasChanges if this cell is now dirty
    this.hasChanges = this.hasChanges || row.values[column] !== row.originalValues[column]
  }

  protected onCellBlurred(_event: Event) {
    // hasChanges if any cells are dirty
    this.detectChanges()
  }

  protected onRowAdded(_event: Event) {
    this.hasChanges = true
  }

  protected onMenuSelection(event: Event) {
    const cellUpdateEvent = event as MenuSelectedEvent

    if (cellUpdateEvent.value === 'reset') {
      this.detectChanges()
    }
  }

  override async updated(changedProperties: PropertyValueMap<this>) {
    const has = changedProperties.has.bind(changedProperties)

    // extract and set props from starlink url
    if (has('starlink') && this.starlink) {
      const params = new URLSearchParams(this.starlink.split('?')[1])
      this.apiKey = params.get('auth_token') ?? undefined
      this.baseId = params.get('base_id') ?? undefined
      this.workspaceId = params.get('workspace_id') ?? undefined
    }
  }

  override async willUpdate(changedProperties: PropertyValueMap<this>) {
    super.willUpdate(changedProperties)
    const has = changedProperties.has.bind(changedProperties)

    if (
      (has('apiKey') || has('baseId') || has('workspaceId') || has('schemaName') || has('tableName')) &&
      this.apiKey &&
      this.baseId &&
      this.workspaceId &&
      this.schemaName &&
      this.tableName
    ) {
      this.sourceSchema = await this.fetchSchema()
      this.table = this.sourceSchema[this.schemaName]?.find(({ name }) => name === this.tableName)

      if (this.table) this.schema = { columns: this.table.columns }
      this.fields = this.table?.columns.map(({ name }) => ({ field: name, alias: name }))
    } else if (
      (has('apiKey') || has('baseId') || has('workspaceId') || has('fields')) &&
      this.apiKey &&
      this.baseId &&
      this.workspaceId &&
      this.fields
    ) {
      this.onRefresh()
    }

    this.hasSelectedRows = this.selectedRowUUIDs.size > 0
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('cell-updated', this.onCellUpdated)
    this.addEventListener('cell-blurred', this.onCellBlurred)
    this.addEventListener('row-added', this.onRowAdded)
    this.addEventListener('menu-selection', this.onMenuSelection)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback
    this.removeEventListener('cell-updated', this.onCellUpdated)
    this.removeEventListener('menu-selection', this.onMenuSelection)
  }

  public override render() {
    const table = super.render()

    const deleteBtn = this.hasSelectedRows
      ? html`<astra-button size="compact" theme="${this.theme}" @click=${this.onDeleteRows}>Delete Rows</astra-button>`
      : null

    const saveBtn = this.hasChanges
      ? html`<astra-button size="compact" theme="${this.theme}" @click=${this.onSaveRows}>Save</astra-button>`
      : null

    const discardBtn = this.hasChanges
      ? html`<astra-button size="compact" theme="${this.theme}" @click=${this.onDiscardChanges}>Discard</astra-button>`
      : null

    return html`
      <div class=${classMap({ dark: this.theme === 'dark', 'flex flex-col h-full': true, 'bg-black': this.theme === 'dark' })}>
        <div class="flex flex-col h-full text-black dark:text-white">
          <div id="action-bar" class="h-12 font-medium dark:bg-neutral-950 items-center justify-end flex gap-2.5 text-sm p-2 rounded-t">
            ${discardBtn} ${deleteBtn} ${saveBtn}
            <astra-button size="compact" theme="${this.theme}" @click=${this.onAddRow}>Add Row</astra-button>
            <astra-button size="compact" theme="${this.theme}" @click=${this.onRefresh}>${ArrowsClockwise(16)}</astra-button>
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