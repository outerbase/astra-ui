import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { isEqual } from 'lodash-es'
import { ArrowsClockwise } from '../icons/arrows-clockwise.js'
import { CaretDown } from '../icons/caret-down.js'
import { CaretLeft } from '../icons/caret-left.js'
import { CaretRight } from '../icons/caret-right.js'
import { Table as TableIcon } from '../icons/table.js'
import { diffObjects } from '../lib/diff-objects.js'
import { normalizeKeys } from '../lib/normalize-object-keys.js'
import type { APIResponse, CellUpdateEvent, Fields, MenuSelectedEvent, RowAsRecord, Rows, SourceSchema, Table } from '../types.js'
import './button.js' // Ensure the button component is imported
import AstraTable from './table/index.js'

// const OUTERBASE_API_DOMAIN = 'app.outerbase.com'
const OUTERBASE_API_DOMAIN = 'app.dev.outerbase.com'

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
  @property({ attribute: 'side-bar', type: Boolean }) showSidebar = false

  @state() offset = 0
  @state() limit = 20
  @state() total = 0
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
      await fetch(`https://${OUTERBASE_API_DOMAIN}/api/v1/workspace/${this.workspaceId}/base/${this.baseId}/schema`, {
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
        `https://${OUTERBASE_API_DOMAIN}/api/v1/workspace/${this.workspaceId}/base/${this.baseId}/table/${this.schemaName}/${this.tableName}/rows`,
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
    this.hasChanges = false
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

    const response = await fetch(
      `https://${OUTERBASE_API_DOMAIN}/api/v1/workspace/${this.workspaceId}/base/${this.baseId}/table/${this.schemaName}/${this.tableName}/rows`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': this.apiKey,
        },
      }
    )

    if (response.status === 200) this.onRefresh()
    else console.error(response)
  }

  protected onDiscardChanges() {
    // this.clearSelection()
    this.resetValues()
    this.hasChanges = false
  }

  protected onClickNextPage() {
    if (this.offset + this.limit > this.total) return
    this.offset += this.limit
  }

  protected onClickPreviousPage() {
    if (this.offset === 0) return
    this.offset -= this.limit
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

    // reset `offset` when changing tables
    if (has('tableName') || (has('schemaName') && this.tableName && this.schemaName)) {
      this.offset = 0
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
      (has('apiKey') || has('baseId') || has('workspaceId') || has('fields') || has('offset')) &&
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

  protected onTableSelection(schemaName: string, tableName: string) {
    this.schemaName = schemaName
    this.tableName = tableName
  }

  protected renderSidebar() {
    const schema = this.sourceSchema
    if (!schema) return null
    const schemaTables = Object.entries(schema)

    return html`<div
      class="w-48 overflow-y-auto overflow-x-clip border rounded-tl rounded-bl text-theme-table-content dark:text-theme-table-content-dark bg-theme-table dark:bg-theme-table-dark border-theme-table-border dark:border-theme-table-border-dark"
    >
      <h2
        class="text-xl font-semibold h-[47px] flex items-center pl-2 border-b border-theme-table-border dark:border-theme-table-border-dark"
      >
        Tables
      </h2>
      <ul class="">
        ${schemaTables.map(
          ([schema, tables]) =>
            html`<div class="py-2 px-2 flex items-center gap-1">${schema} ${CaretDown(16)}</div>
              ${tables?.map(
                (t) =>
                  html`<li
                    class="py-2 flex flex-row pl-5 pr-2 items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring focus-visible:ring-blue-600  text-theme-sidebar-li-text dark:text-theme-sidebar-li-text-dark hover:bg-theme-sidebar-li-hover dark:bg-theme-sidebar-li-hover-dark dark:text-white dark:hover:bg-neutral-800 ${classMap(
                      {
                        '!text-theme-sidebar-li-active': this.tableName === t.name,
                        'font-semibold': this.tableName === t.name,
                      }
                    )}"
                    @click=${() => this.onTableSelection(schema, t.name)}
                  >
                    <span class="flex-none">${TableIcon(16)}</span>
                    <span class="truncate text-sm">${t.name}</span>
                  </li>`
              )}`
        )}
      </ul>
    </div>`
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

    const defaultPaginationBtnMap = {
      'w-8': true,
      'h-8': true,
      'rounded-md': true,
      flex: true,
      'items-center': true,
      'justify-center': true,
    }

    const canGoBack = this.offset > 0
    const canGoForward = this.offset + this.limit < this.total
    const prevBtnClasses = {
      ...defaultPaginationBtnMap,
      'cursor-pointer': canGoBack,
      'bg-neutral-200': canGoBack,
      'dark:bg-neutral-700': canGoBack,
      'text-neutral-900': canGoBack,
      'dark:text-neutral-100': canGoBack,

      'cursor-not-allowed': !canGoBack,
      'bg-neutral-100': !canGoBack,
      'dark:bg-neutral-900': !canGoBack,
      'text-neutral-300': !canGoBack,
      'dark:text-neutral-700': !canGoBack,
    }

    const nextBtnClasses = {
      ...defaultPaginationBtnMap,
      'cursor-pointer': canGoForward,
      'bg-neutral-200': canGoForward,
      'dark:bg-neutral-700': canGoForward,
      'text-neutral-900': canGoForward,
      'dark:text-neutral-100': canGoForward,

      'cursor-not-allowed': !canGoForward,
      'bg-neutral-100': !canGoForward,
      'dark:bg-neutral-900': !canGoForward,
      'text-neutral-300': !canGoForward,
      'dark:text-neutral-700': !canGoForward,
    }

    const sidebar = this.showSidebar ? this.renderSidebar() : null
    const tableWithHeaderFooter = html`
      <div class="flex flex-col flex-1">
        <!-- header; action bar -->
        <div
          id="action-bar"
          class="h-12 font-medium bg-theme-table dark:bg-theme-table-dark items-center justify-end flex gap-2.5 text-sm p-2 rounded-tr border-t border-b border-r border-theme-table-border dark:border-theme-table-border-dark"
        >
          ${discardBtn} ${deleteBtn} ${saveBtn}
          <astra-button size="compact" theme="${this.theme}" @click=${this.onAddRow}>Add Row</astra-button>
          <astra-button size="compact" theme="${this.theme}" @click=${this.onRefresh}>${ArrowsClockwise(16)}</astra-button>
        </div>

        <!-- data -->
        <div class="relative flex-1 border-r border-theme-table-border dark:border-theme-table-border-dark">${table}</div>

        <!-- footer; pagination -->
        <div
          id="footer"
          class="h-12 font-medium bg-theme-table dark:bg-theme-table-dark items-center justify-end flex gap-2.5 text-sm py-2 rounded-br border-t border-b border-r border-theme-border dark:border-theme-table-border-dark p-2"
        >
          Viewing ${this.offset + 1}-${Math.min(this.offset + this.limit, this.total)} of ${this.total}
          <div class="select-none flex items-center">
            <span class=${classMap(prevBtnClasses)} @click=${this.onClickPreviousPage}>${CaretLeft(16)}</span>
            <span class="w-8 text-center">${this.total ? this.offset / this.limit + 1 : 1}</span>
            <span class=${classMap(nextBtnClasses)} @click=${this.onClickNextPage}>${CaretRight(16)}</span>
          </div>
        </div>
      </div>
    `

    return html`
      <div
        class="flex flex-row h-full ${classMap({
          dark: this.theme === 'dark',
          'bg-black': this.theme === 'dark',
        })}"
      >
        ${sidebar} ${tableWithHeaderFooter}
      </div>
    `
  }
}
