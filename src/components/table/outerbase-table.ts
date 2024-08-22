import { css, html, nothing, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { isEqual } from 'lodash-es'

import { ArrowsClockwise } from '../../icons/arrows-clockwise.js'
import { CaretLeft } from '../../icons/caret-left.js'
import { CaretRight } from '../../icons/caret-right.js'
import { Table as TableIcon } from '../../icons/table.js'
import { diffObjects } from '../../lib/diff-objects.js'
import { normalizeKeys } from '../../lib/normalize-object-keys.js'
import stringifyWithoutNewLines from '../../lib/stringify-without-new-lines.js'
import type {
  APIResponse,
  CellUpdateEvent,
  Fields,
  MenuSelectedEvent,
  RowAsRecord,
  Rows,
  Schema,
  SourceSchema,
  Table,
} from '../../types.js'
import '../button.js' // Ensure the button component is imported
import AstraTable from './core/index.js'
import './outerbase/table-list-item.js'

const OUTERBASE_API_DOMAIN = 'app.outerbase.com'
// const OUTERBASE_API_DOMAIN = 'app.dev.outerbase.com'

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
  @property({ attribute: 'show-editor', type: Boolean }) showEditor = false
  @property({ attribute: 'sql', type: Boolean }) codeEditorValue = ''
  @property({ type: Number }) offset = 0
  @property({ type: Number }) limit = 50
  @property({ type: Number }) total = 0

  @state() fields?: Fields
  @state() sourceSchema?: SourceSchema
  @state() table?: Table
  @state() hasSelectedRows = false
  @state() hasChanges = false

  private previousData?: Array<RowAsRecord>
  private previousSchema?: Schema
  private previousTotal?: number

  constructor() {
    super()
    this.onCellUpdated = this.onCellUpdated.bind(this)
    this.onMenuSelection = this.onMenuSelection.bind(this)
    this.onRunQuery = this.onRunQuery.bind(this)
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

        _row[_key] = typeof value === 'object' ? stringifyWithoutNewLines(value) : value?.toString()
      })

      stringifiedData.push(_row)
    })

    return { ...data.response, items: stringifiedData }
  }

  // Note: this is returning `[]`
  protected async fetchConnections() {
    if (!this.apiKey) throw new Error('Fetching data requires an api-key')

    const data: APIResponse<Rows> = await (
      await fetch(`https://${OUTERBASE_API_DOMAIN}/api/v1/workspace/${this.workspaceId}/connection`, {
        headers: {
          'content-type': 'application/json',
          'x-auth-token': this.apiKey,
        },
        method: 'GET',
      })
    ).json()

    let items = data?.response?.items ?? []

    if (this.baseId) {
      // ensure this is a uuid or throw
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(this.baseId)

      if (!isValidUUID) throw new Error('attempted to fetch connection source with non-uuid for base; this endpoint only works with UUIDs?')

      items = items.filter((connection) => connection.base_id === this.baseId)
    }

    return items
  }

  // Note: this is untested, pending `sourceId`
  protected async queryData() {
    if (!this.apiKey) throw new Error('Fetching data requires an api-key')
    if (!this.codeEditorValue) throw new Error('Missing SQL query')

    const data: APIResponse<Rows> = await // TODO replace `1234567890` with a valid source id
    (
      await fetch(`https://${OUTERBASE_API_DOMAIN}/api/v1/workspace/${this.workspaceId}/base/${this.baseId}/query/raw`, {
        body: JSON.stringify({ query: this.codeEditorValue, options: {} }),
        headers: {
          'content-type': 'application/json',
          'x-auth-token': this.apiKey,
        },
        method: 'POST',
      })
    ).json()

    // stringify all the values so user modifications are consistent with the "OG" data
    // i.e. +46 <=> "46"
    const stringifiedData: Record<string, string>[] = []
    data.response.items.forEach((row) => {
      const _row: Record<string, string> = {}
      Object.entries(row).forEach(([key, value]) => {
        const _key = key.toString()
        if (!_key || !value) return

        _row[_key] = typeof value === 'object' ? stringifyWithoutNewLines(value) : value?.toString()
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

  protected async refreshData(_data?: { items: Record<string, string>[]; count: number; query?: string; name?: string }) {
    const data = _data ?? (await this.fetchData())

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

  protected async onRefresh() {
    // fetch data and schema
    const [_, schema] = await Promise.all([this.refreshData(), this.fetchSchema()])
    this.sourceSchema = schema
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
    if (this.offset < 1) return
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

  protected async onRunQuery(_event?: Event) {
    // submit query and create a pseudo-schema
    const data = await this.queryData()
    data.count = data.items.length // API doesn't set `count` for queries
    this.refreshData(data)

    // assumes every item has the same columns/schema
    const columns = Object.keys(data.items[0] ?? {}).map((name) => ({ name }))

    this.schema = { columns }
    this.isNonInteractive = true
    this.readonly = true
    this.selectableRows = false
  }

  override async updated(changedProperties: PropertyValueMap<this>) {
    super.updated(changedProperties)

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

    // fetch latest schema
    if (has('apiKey') || has('baseId') || has('workspaceId')) {
      this.sourceSchema = await this.fetchSchema()

      // set a default schema name; prefer 'public'
      if (!this.schemaName) {
        if (this.sourceSchema.public) this.schemaName = 'public'
        else this.schemaName = Object.keys(this.sourceSchema)?.[0]
      }

      // set a default table name; the first one in the schema
      if (!this.tableName) {
        const tables = this.sourceSchema[this.schemaName]
        if (tables && tables.length > 0) this.tableName = tables[0].name
      }
    }

    if (
      (has('apiKey') || has('baseId') || has('workspaceId') || has('schemaName') || has('tableName')) &&
      this.apiKey &&
      this.baseId &&
      this.workspaceId &&
      this.schemaName &&
      this.tableName &&
      this.sourceSchema
    ) {
      this.table = this.sourceSchema[this.schemaName]?.find(({ name }) => name === this.tableName)

      // update columns (<th/>) & fields (api params)
      if (this.table) {
        this.schema = { columns: this.table.columns }
        this.fields = this.table.columns.map(({ name }) => ({ field: name, alias: name }))
      }
    }

    // fetch data when any params change
    if (
      !this.showEditor && // skip when query editing
      (has('apiKey') || has('baseId') || has('workspaceId') || has('fields') || has('offset')) &&
      this.apiKey &&
      this.baseId &&
      this.workspaceId &&
      this.fields
    ) {
      this.refreshData()
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
    super.disconnectedCallback()
    this.removeEventListener('cell-updated', this.onCellUpdated)
    this.removeEventListener('cell-blurred', this.onCellBlurred)
    this.removeEventListener('row-added', this.onRowAdded)
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
      class="w-48 flex flex-col border text-theme-table-content dark:text-theme-table-content-dark bg-theme-table dark:bg-theme-table-dark border-theme-table-border dark:border-theme-table-border-dark"
    >
      <h1
        class="p-4 leading-none text-xl font-semibold flex-none flex items-center text-theme-sidebar-header-content border-theme-table-border dark:border-theme-table-border-dark"
      >
        Tables
      </h1>
      <div class="relative h-full">
        <astra-scroll-area>
          <ul class="text-sm">
            <!-- scroller content -->
            ${schemaTables.map(
              ([schema, tables]) =>
                html`<outerbase-table-list-item label="${schema}" ?open=${schema === 'public'}>
                  ${tables
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map(
                      (t) =>
                        html`<li
                          class="pl-7 pr-2 py-2 flex flex-row items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring focus-visible:ring-blue-600  hover:bg-theme-sidebar-li-hover dark:bg-theme-sidebar-li-hover-dark dark:text-white dark:hover:bg-neutral-800 ${classMap(
                            {
                              'text-theme-sidebar-li-active': this.tableName === t.name,
                              'text-theme-sidebar-li-content': this.tableName !== t.name,
                              'dark:text-theme-sidebar-li-content-dark': this.tableName !== t.name,
                              'font-semibold': this.tableName === t.name,
                            }
                          )}"
                          @click=${() => {
                            if ((this.hasChanges && confirm('Discard unsaved changes?')) || !this.hasChanges)
                              this.onTableSelection(schema, t.name)
                          }}
                        >
                          <span class="flex-none">${TableIcon(14)}</span>
                          <span class="truncate text-sm">${t.name}</span>
                        </li>`
                    )}
                </outerbase-table-list-item> `
            )}
          </ul>
        </astra-scroll-area>
      </div>
    </div>`
  }

  public override render() {
    const table = super.render()

    const editor = html`
      <div id="container" class="h-1/3">
        <astra-editor
          id="editor"
          value="SELECT 1 + 1;"
          theme="freedom"
          @change=${({ detail }: CustomEvent) => {
            this.codeEditorValue = detail
          }}
        >
          <astra-editor-sql dialect="sqlite" schema="{JSON.stringify(SCHEMA)}" />
          <astra-editor-handlebar variables="variable1,variable2" />
        </astra-editor>
      </div>
    `

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
      'bg-neutral-300/30': canGoBack,
      'dark:bg-neutral-500/30': canGoBack,

      'cursor-not-allowed': !canGoBack,
      'opacity-60': !canGoBack,
      'bg-neutral-500/10': !canGoBack,
      'dark:bg-neutral-900': !canGoBack,
    }

    const nextBtnClasses = {
      ...defaultPaginationBtnMap,
      'cursor-pointer': canGoForward,
      'bg-neutral-300/30': canGoForward,
      'dark:bg-neutral-500/30': canGoForward,

      'cursor-not-allowed': !canGoForward,
      'opacity-60': !canGoForward,
      'bg-neutral-500/10': !canGoForward,
      'dark:bg-neutral-900': !canGoForward,
    }

    const sidebar = this.showSidebar ? this.renderSidebar() : null
    const footer = this.showEditor
      ? nothing
      : html`<div
          id="footer"
          class="h-12 font-medium bg-theme-table dark:bg-theme-table-dark items-center justify-end flex gap-2.5 text-sm py-2 border-t border-b border-r border-theme-table-border dark:border-theme-table-border-dark p-2"
        >
          Viewing ${Math.min(this.offset + 1, this.total)}-${Math.min(this.offset + this.limit, this.total)} of ${this.total}
          <div class="select-none flex items-center">
            <span class=${classMap(prevBtnClasses)} @click=${this.onClickPreviousPage}>${CaretLeft(16)}</span>
            <span class="w-8 text-center">${this.total ? this.offset / this.limit + 1 : 1}</span>
            <span class=${classMap(nextBtnClasses)} @click=${this.onClickNextPage}>${CaretRight(16)}</span>
          </div>
        </div>`
    const tableWithHeaderFooter = html`
      <div class="relative flex flex-col flex-1 text-theme-secondary-content dark:text-theme-secondary-content-dark">
        <!-- header; action bar -->
        <div
          id="action-bar"
          class="bg-theme-table dark:bg-theme-table-dark flex gap-2.5 text-sm p-2 border-t border-b border-r border-theme-table-border dark:border-theme-table-border-dark"
        >
          <!-- hide/show editor button -->
          <astra-button
            size="compact"
            theme="${this.theme}"
            @click=${() => {
              // when hiding the editor
              if (this.showEditor) {
                // restore original state
                if (this.previousTotal) this.total = this.previousTotal
                if (this.previousData) this.data = this.previousData
                if (this.previousSchema) this.schema = this.previousSchema

                // restore interactivity
                this.isNonInteractive = false
                this.readonly = false
                this.selectableRows = true

                delete this.previousTotal
                delete this.previousData
                delete this.previousSchema
              }

              // when showing the editor
              if (!this.showEditor) {
                this.previousTotal = this.total
                this.previousData = this.data
                this.previousSchema = this.schema
                this.data = []
                this.schema = { columns: [] }
              }

              this.showEditor = !this.showEditor
            }}
          >
            ${this.showEditor ? 'Hide Editor' : 'Edit Query'}
          </astra-button>

          <!-- editor run button -->
          ${this.showEditor
            ? html`<astra-button size="compact" theme="${this.theme}" @click=${this.onRunQuery}>Run</astra-button>`
            : nothing}

          <!-- table buttons -->
          ${this.showEditor
            ? nothing
            : html`<div class="flex items-center justify-center flex-auto font-bold text-xl">${this.tableName}</div>
                ${discardBtn} ${deleteBtn} ${saveBtn}
                <astra-button size="compact" theme="${this.theme}" @click=${this.onAddRow}>Add Row</astra-button>
                <astra-button size="compact" theme="${this.theme}" @click=${this.onRefresh}>${ArrowsClockwise(16)}</astra-button>`}
        </div>

        <!-- data -->
        ${this.showEditor ? editor : nothing}
        <div class="relative flex-1 border-r border-theme-table-border dark:border-theme-table-border-dark">${table}</div>

        <!-- footer; pagination -->
        ${footer}
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
