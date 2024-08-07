import { html, nothing, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { repeat } from 'lit/directives/repeat.js'
import arrayToObject from '../../../lib/array-to-object.js'
import {
  ColumnAddedEvent,
  ColumnHiddenEvent,
  ColumnPluginDeactivatedEvent,
  ColumnRemovedEvent,
  MenuOpenEvent,
  ResizeEvent,
  RowAddedEvent,
  RowRemovedEvent,
  RowSelectedEvent,
} from '../../../lib/events.js'
import {
  ColumnStatus,
  DBType,
  type ColumnPlugin,
  type Columns,
  type HeaderMenuOptions,
  type PluginWorkspaceInstallationId,
  type RowAsRecord,
  type Schema,
  type TableColumn,
  type Theme,
} from '../../../types.js'
import { ClassifiedElement } from '../../classified-element.js'

// import subcomponents
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import type ScrollArea from '../../scroll-area.js'
import '../add-column.js'
import '../check-box.js'
import './tbody.js'
import './td.js'
import type { TableData } from './td.js'
import './th.js'
import './thead.js'
import './tr.js'

const SCROLL_BUFFER_SIZE = 25

@customElement('astra-table')
export default class AstraTable extends ClassifiedElement {
  // STATE
  @property({ type: Boolean, attribute: 'selectable-rows' })
  public selectableRows = false

  @property({ attribute: 'keyboard-shortcuts', type: Boolean })
  public keyboardShortcuts: boolean = false

  @property({ attribute: 'schema', type: Object })
  public schema?: Schema

  @property({ attribute: 'data', type: Array })
  set data(data: Array<RowAsRecord>) {
    this.rows = data
  }
  get data() {
    return this.rows
  }

  @property({ attribute: 'plugins', type: Array })
  public plugins?: Array<ColumnPlugin>

  @property({ attribute: 'installed-plugins', type: Array })
  public installedPlugins?: Record<string, PluginWorkspaceInstallationId | undefined>

  // @Brayden – this property represents the really array of installed plugins
  @property({ attribute: 'real-installed-plugins', type: Array })
  public realInstalledPlugins?: Array<any>

  @property({ attribute: 'non-interactive', type: Boolean })
  public isNonInteractive = false

  @property({ attribute: 'static-widths', type: Boolean })
  public staticWidths = false

  @property({ attribute: 'auth-token', type: String })
  public authToken?: string

  @property({ attribute: 'column-options', type: Array })
  public columnOptions?: Array<HeaderMenuOptions>

  @property({ attribute: 'outer-border', type: Boolean })
  public outerBorder = false

  // TODO @johnny make this a Set
  @property({ attribute: 'hidden-columns', type: Array })
  public hiddenColumnNames: Array<string> = []

  @property({ attribute: 'deleted-columns', type: Array })
  public deletedColumnNames: Array<string> = []

  @property({ attribute: 'renamed-columns', type: Object })
  public renamedColumnNames: Record<string, string | undefined> = {}

  @property({ attribute: 'plugin-attributes', type: String })
  public pluginAttributes: String = ''

  @property({ attribute: 'read-only', type: Boolean })
  public readonly = false

  @property({ attribute: 'blank-fill', type: Boolean })
  public blankFill = false

  @property({ attribute: 'column-width-offsets', type: Object })
  public columnWidthOffsets: Record<string, number | undefined> = {}

  @property({ attribute: 'addable-columns', type: Boolean })
  public addableColumns = false

  @property({ attribute: 'active-column', type: String })
  public activeColumn?: string

  @property({ attribute: 'blurry', type: Boolean })
  public blurry = false

  @state() protected scrollableEl: Ref<ScrollArea> = createRef()
  @state() public rows: Array<RowAsRecord> = []
  @state() public newRows: Array<RowAsRecord> = []
  @state() public oldRows: Array<RowAsRecord> = []
  @state() protected existingVisibleRows: Array<RowAsRecord> = []
  @state() protected allRowsSelected = false
  @state() public columns: Columns = []
  @state() protected visibleColumns: Columns = []
  @state() public selectedRowUUIDs: Set<string> = new Set()
  @state() protected removedRowUUIDs: Set<string> = new Set()
  @state() protected columnTypes?: Record<string, string | number | boolean | undefined>
  @state() protected rowHeight: number = 38

  @state() private visibleEndIndex = 0
  @state() private visibleStartIndex = 0
  @state() private _height?: number

  protected updateVisibleColumns() {
    this.visibleColumns = this.columns.filter(
      ({ name, status }) =>
        status !== ColumnStatus.deleted && this.hiddenColumnNames.indexOf(name) === -1 && this.deletedColumnNames.indexOf(name) === -1
    )
  }

  constructor() {
    super()
    this.updateTableView = this.updateTableView.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  protected closeLastMenu?: () => void
  protected fromIdToRowMap: Record<string, RowAsRecord | undefined> = {}

  // METHODS (public)
  public addNewRow(row?: Partial<RowAsRecord>) {
    const _row: RowAsRecord = {
      id: row?.id ?? self.crypto.randomUUID(),
      values: row?.values ?? {},
      originalValues: row?.originalValues ?? {},
      isNew: row?.isNew ?? true,
      isDeleted: false,
    }

    this.rows.push(_row)
    this.requestUpdate('rows')
    this.dispatchEvent(new RowAddedEvent(_row))

    return _row
  }

  public addNewColumn(name: string) {
    const column: TableColumn = {
      is_nullable: false,
      name,
      position: this.columns.length,
      model: 'column',
      type: DBType.TEXT,
      unique: false,
      primaryKey: false,
      autoIncrement: false,
      status: ColumnStatus.created,
    }

    this.columns = [...this.columns, column]
    this.rows = this.rows.map((row) => ({ ...row, values: { ...row.values, [name]: '' } }))
    this.dispatchEvent(new ColumnAddedEvent({ name })) // JOHNNY pass the other data along too?
    this.updateVisibleColumns()
  }

  public toggleSelectedRow(uuid: string) {
    const _set = this.selectedRowUUIDs
    if (_set.has(uuid)) _set.delete(uuid)
    else _set.add(uuid)
    this.requestUpdate('selectedRowUUIDs')
  }

  public clearSelection() {
    this.selectedRowUUIDs = new Set()
    this.removedRowUUIDs = new Set()

    this.shadowRoot?.querySelectorAll<HTMLInputElement>('.row-select-checkbox').forEach((checkbox) => {
      checkbox.checked = false
      checkbox.dispatchEvent(new Event('change'))
    })
  }

  public resetValues() {
    // replace values with a copy of original values (otherwise they share state and are always equal!!)
    this.rows = this.rows
      .filter(({ isNew }) => !isNew) // remove new rows
      .map((r) => ({ ...r, values: { ...r.originalValues }, isDeleted: false })) // reset values
  }

  public deleteSelectedRows() {
    this.selectedRowUUIDs.forEach((uuid) => this.removedRowUUIDs.add(uuid))

    const removedRows: Array<RowAsRecord> = []
    this.selectedRowUUIDs.forEach((_id) => {
      const row = this.rows.find(({ id }) => _id === id)
      if (row) removedRows.push(row)
    })

    this.dispatchEvent(new RowRemovedEvent(removedRows))
    this.selectedRowUUIDs = new Set()
    this.requestUpdate('removedRowUUIDs')
  }

  // clear param settings
  public resetParams() {
    this.clearSelection()
    this.hiddenColumnNames = []
  }

  // METHODS (private)
  protected _onColumnRemoved({ name }: ColumnRemovedEvent) {
    // remove the column named `name` from columns collection
    this.deletedColumnNames.push(name)
    this.requestUpdate('columns')
    this.updateVisibleColumns()
  }

  protected _onColumnHidden({ name }: ColumnHiddenEvent) {
    this.hiddenColumnNames.push(name)
  }

  // TODO @johnny 'Select All' is firing this once for each row instead of just once
  protected _onRowSelection() {
    const selectedRows: Array<RowAsRecord> = []
    this.selectedRowUUIDs.forEach((_id) => {
      const row = this.fromIdToRowMap[_id]
      if (row) selectedRows.push(row)
    })

    this.dispatchEvent(new RowSelectedEvent(selectedRows))
  }

  protected widthForColumnType(name: string, offset = 0) {
    const columnType = this.visibleColumns.find(({ name: _name }) => name === _name)?.type?.toUpperCase() as DBType
    if (
      [
        DBType.BIGINT,
        DBType.DECIMAL,
        DBType.DECIMAL,
        DBType.DOUBLE_PRECISION,
        DBType.INTEGER,
        DBType.NUMERIC,
        DBType.REAL,
        DBType.SMALLINT,
        DBType.INT,
      ].includes(columnType)
    )
      return 150 + offset
    if ([DBType.CHAR, DBType.TEXT, DBType.VARCHAR, DBType.VARYING].includes(columnType)) return 200 + offset
    if ([DBType.TIME, DBType.DATE, DBType.TIMESTAMP].includes(columnType)) return 110 + offset
    if ([DBType.TIME_WITH_TIME_ZONE, DBType.DATETIME, DBType.TIMESTAMP_WITH_TIME_ZONE].includes(columnType)) return 200 + offset
    if ([DBType.JSON, DBType.JSONB].includes(columnType)) return 200 + offset
    if ([DBType.UUID].includes(columnType)) return 300 + offset

    return 200 + offset
  }

  // KEYBOARD SHORTCUTS
  protected onKeyDown(event: KeyboardEvent) {
    const actualTarget = event.composedPath()[0]
    const validTrigger = actualTarget instanceof HTMLElement && actualTarget.tagName !== 'INPUT' && actualTarget.tagName !== 'TEXTAREA'
    if (!validTrigger) return

    const { shiftKey, key } = event
    if (!shiftKey) return

    // create column
    if (key === 'C') {
      const defaultName = `Column ${Date.now()}`
      const name = prompt('Choose a unique name for this column', defaultName) || defaultName
      this.addNewColumn(name)
    }

    // create row
    if (key === 'R') {
      this.addNewRow()
    }

    // delete selection
    if (key === 'D') {
      this.deleteSelectedRows()
    }
  }

  /////
  // dynamically adjust the table's width when columns are being resized
  // this variable is utilized while updating widths on('mousemove')
  private _previousWidth = 0
  private _onColumnResizeStart() {
    const table = this.shadowRoot?.getElementById('table')
    if (!table) throw new Error('Unexpectedly missing a table')

    this._previousWidth = table.clientWidth
  }

  private _onColumnResized({ delta }: ResizeEvent) {
    const table = this.shadowRoot?.getElementById('table')
    if (!table) throw new Error('Unexpectedly missing a table')

    table.style.width = `${this._previousWidth + delta}px`
  }

  private _onColumnPluginDeactivated({ column }: ColumnPluginDeactivatedEvent) {
    if (this.installedPlugins) {
      delete this.installedPlugins[column]
      this.requestUpdate('installedPlugins')
    }
  }

  private setCssVariablesForPlugin(theme: Theme) {
    if (typeof document === 'undefined') return

    if (theme == 'dark') {
      document.documentElement.style.setProperty('--ob-background-color', '#0A0A0A')
      document.documentElement.style.setProperty('--ob-text-color', '#FFFFFF')
      document.documentElement.style.setProperty('--ob-border-color', '#262626')
      document.documentElement.style.setProperty('--ob-null-text-color', '#959497')
    } else {
      document.documentElement.style.setProperty('--ob-background-color', '#FAFAFA')
      document.documentElement.style.setProperty('--ob-text-color', '#000000')
      document.documentElement.style.setProperty('--ob-border-color', '#E5E5E5')
      document.documentElement.style.setProperty('--ob-null-text-color', '#D0D0D0')
    }

    document.documentElement.style.setProperty('--ob-font-family', '"Inter", sans-serif')
    document.documentElement.style.setProperty('--ob-cell-font-family', '"Inter", sans-serif')
  }

  protected renderRows(rows: Array<RowAsRecord>) {
    return html`${repeat(
      rows,
      ({ id }) => id,
      ({ id, values, originalValues, isNew }, rowIndex) => {
        return !this.removedRowUUIDs.has(id)
          ? html`<astra-tr
              .selected=${this.selectedRowUUIDs.has(id)}
              ?new=${isNew}
              ?blurry=${this.blurry}
              @on-selection=${this._onRowSelection}
            >
              <!-- checkmark cell -->
              ${this.selectableRows
                ? html`<astra-td
                    .position=${{
                      row: id,
                      column: '__selected', // our own; not expected to exist in DB
                    }}
                    .type=${null}
                    theme=${this.theme}
                    ?separate-cells=${true}
                    ?outer-border=${this.outerBorder}
                    ?blank=${true}
                    ?is-last-row=${rowIndex === this.rows.length - 1}
                    ?is-last-column=${false}
                    ?row-selector="${true}"
                    ?read-only=${true}
                    ?interactive=${true}
                    width="42px"
                  >
                    <div class="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center h-full">
                      <check-box
                        ?checked="${this.selectedRowUUIDs.has(id)}"
                        @toggle-check="${() => this.toggleSelectedRow(id)}"
                        theme=${this.theme}
                      />
                    </div>
                  </astra-td>`
                : null}

              <!-- render a TableCell for each column of data in the current row -->
              ${repeat(
                this.visibleColumns,
                ({ name }) => name, // use the column name as the unique identifier for each entry in this row
                ({ name }, idx) => {
                  const installedPlugin = this.plugins?.find(
                    ({ pluginWorkspaceId }) => pluginWorkspaceId === this.installedPlugins?.[name]?.plugin_workspace_id
                  )
                  const defaultPlugin = this.plugins?.find(({ id }) => id === this.installedPlugins?.[name]?.plugin_installation_id)
                  const plugin = installedPlugin ?? defaultPlugin

                  const realInstallation = this.realInstalledPlugins?.find(
                    ({ plugin_workspace_id }) => plugin?.pluginWorkspaceId === plugin_workspace_id
                  )

                  if (plugin && realInstallation?.config) {
                    plugin.config = JSON.stringify(realInstallation?.config)
                  }

                  return html`
                    <!-- TODO @johnny remove separate-cells and instead rely on css variables to suppress borders -->
                    <!-- TODO @caleb & johnny move plugins to support the new installedPlugins variable -->
                    <astra-td
                      .position=${{ row: id, column: name }}
                      .value=${values[name]}
                      .originalValue=${originalValues[name]}
                      .column=${name}
                      width="${this.widthForColumnType(name, this.columnWidthOffsets[name])}px"
                      theme=${this.theme}
                      type=${this.columnTypes?.[name]}
                      .plugin=${plugin}
                      plugin-attributes=${this.installedPlugins?.[name]?.supportingAttributes ?? ''}
                      ?separate-cells=${true}
                      ?outer-border=${this.outerBorder}
                      ?resizable=${!this.staticWidths}
                      ?is-last-row=${rowIndex === this.rows.length - 1}
                      ?is-last-column=${idx === this.visibleColumns.length - 1}
                      ?is-first-row=${rowIndex === 0}
                      ?is-first-column=${idx === 0}
                      ?menu=${!this.isNonInteractive && !this.readonly}
                      ?interactive=${!this.isNonInteractive}
                      ?hide-dirt=${isNew}
                      ?read-only=${this.readonly}
                      ?is-active=${name === this.activeColumn}
                    >
                    </astra-td>
                  `
                }
              )}
              ${this.blankFill
                ? html`<astra-td ?outer-border=${false} ?read-only=${true} ?separate-cells=${false} ?interactive=${false} ?menu=${false} ?blank=${true}></<astra-td>`
                : ''}
            </astra-tr>`
          : null
      }
    )}`
  }

  protected updateTableView(): void {
    const scrollTop = this.scrollableEl?.value?.scroller?.value?.scrollTop ?? 0
    if (scrollTop) {
      this.updateVisibleRows(scrollTop)
    } else {
      setTimeout(() => this.updateVisibleRows(0), 0)
    }
  }

  public updateVisibleRows(scrollTop: number): void {
    const rows = this.oldRows
    const _startIndex = Math.max(Math.floor((scrollTop ?? 0) / this.rowHeight) - SCROLL_BUFFER_SIZE, 0)
    if (this.visibleStartIndex !== _startIndex) {
      this.visibleStartIndex = _startIndex
    }
    const possiblyVisibleEndIndex = _startIndex + this.numberOfVisibleRows() + 2 * SCROLL_BUFFER_SIZE // 2x because we need to re-add it to the start index
    const _endIndex = possiblyVisibleEndIndex < rows.length ? possiblyVisibleEndIndex : rows.length
    if (this.visibleEndIndex !== _endIndex) {
      this.visibleEndIndex = _endIndex
    }

    if (
      this.visibleStartIndex !== _startIndex ||
      this.visibleEndIndex !== _endIndex ||
      this.existingVisibleRows.length !== _startIndex - _endIndex
    ) {
      this.existingVisibleRows = rows.slice(_startIndex, _endIndex)
    }
  }

  public numberOfVisibleRows(): number {
    // +1 because we can see a row transparently through the table header -- without this (and buffer=0) you'd see missing row as new reveals
    return Math.ceil((this.scrollableEl?.value?.scroller?.value?.clientHeight ?? 0) / this.rowHeight) + 1
  }

  public override firstUpdated(_changedProperties: PropertyValueMap<this>): void {
    if (this.keyboardShortcuts) {
      document.addEventListener('keydown', this.onKeyDown)
    }

    // set table width
    const table = this.shadowRoot?.getElementById('table')
    if (!table) throw new Error('Unexpectedly missing a table')
    this._previousWidth = table.clientWidth
    table.style.width = `${this._previousWidth}px`

    // ensure that `this.rowHeight` is correct
    // measure the height of each row
    const elem = document.createElement('astra-td') as TableData
    elem.withBottomBorder = true
    elem.outerBorder = this.outerBorder
    elem.isInteractive = true

    // Temporarily add to the DOM to measure
    this.scrollableEl?.value?.appendChild(elem)
    setTimeout(() => {
      const offsetHeight = elem.offsetHeight
      this.scrollableEl?.value?.removeChild(elem)
      if (this.rowHeight !== offsetHeight) {
        this.rowHeight = offsetHeight
      }
    }, 0)
    // end: ensure that `this.rowHeight` is correct
  }

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    // identify columns from the schema
    if (changedProperties.has('schema')) {
      if (this.schema) {
        this.columns = this.schema.columns
        this.columnTypes = arrayToObject(this.columns, 'name', 'type')
        this.updateVisibleColumns()
      }
    }

    if (changedProperties.has('theme')) {
      this.setCssVariablesForPlugin(this.theme)
    }

    if (changedProperties.has('selectedRowUUIDs')) {
      // disqualify 0 === 0
      if (this.rows.length === 0) return

      if (this.selectedRowUUIDs.size !== this.rows.length && this.allRowsSelected) {
        this.allRowsSelected = false
      } else if (this.selectedRowUUIDs.size === this.rows.length && !this.allRowsSelected) {
        this.allRowsSelected = true
      }
    }

    if (changedProperties.has('rows')) {
      this.fromIdToRowMap = {}
      this.newRows = []
      this.oldRows = []

      this.rows.forEach((row) => {
        if (row.isNew && !row.isDeleted) {
          this.newRows.push(row)
        }

        if (!row.isNew && !row.isDeleted) {
          this.oldRows.push(row)
        }

        this.fromIdToRowMap[row.id] = row
      })

      this.updateTableView()
    }

    if (changedProperties.has('hiddenColumnNames')) {
      this.updateVisibleColumns()
    }
  }

  public override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('keydown', this.onKeyDown)
  }

  public override render() {
    const tableClasses = {
      'table table-fixed bg-theme-table dark:bg-theme-table-dark': true,
      'text-theme-table-content dark:text-theme-table-content-dark text-sm': true,
      'min-w-full': true,
      relative: true,
      dark: this.theme === 'dark',
    }

    const selectAllCheckbox =
      this.rows.length > 0
        ? html`<check-box
            theme=${this.theme}
            ?checked=${this.allRowsSelected}
            @click=${(event: MouseEvent) => {
              event.preventDefault()
            }}
            @toggle-check=${() => {
              const everyRowIsChecked = this.rows.length === this.selectedRowUUIDs.size

              if (everyRowIsChecked) {
                this.selectedRowUUIDs = new Set()
                this.allRowsSelected = false
              } else {
                this.selectedRowUUIDs = new Set(this.rows.map(({ id }) => id))
                this.allRowsSelected = true
              }

              //   dispatch event that row selection changed
              this._onRowSelection()
            }}
          />`
        : ''

    return html`
            <astra-scroll-area ${ref(this.scrollableEl)}
                threshold=${SCROLL_BUFFER_SIZE * this.rowHeight * 0.8}
                theme=${this.theme}
                .onScroll=${this.updateTableView}
            >
                <div
                    id="table"
                    class=${classMap(tableClasses)}
                    @menuopen=${(event: MenuOpenEvent) => {
                      // this special case is when the same menu is opened after being closed
                      // without this the menu is immediately closed on subsequent triggers
                      if (this.closeLastMenu === event.close) return

                      // remember this menu and close it when a subsequent one is opened
                      this.closeLastMenu?.()
                      this.closeLastMenu = event.close
                    }}
                >
                    <astra-thead>
                        <astra-tr header ?blurry=${this.blurry}>
                            <!-- first column of (optional) checkboxes -->
                            ${
                              this.selectableRows
                                ? html`<astra-th
                              theme=${this.theme}
                              table-height=${ifDefined(this._height)}
                              width="42px"
                              .value=${null} .originalValue=${null}
                              ?separate-cells=${true}
                              ?outer-border=${this.outerBorder}
                              ?is-last-column=${0 === this.visibleColumns.length}
                              ?blank=${true}
                              ?read-only=${this.readonly}
                          /><div class="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center h-full">
                          ${selectAllCheckbox}
                      </div></astra-th>`
                                : null
                            }
                            ${repeat(
                              this.visibleColumns,
                              ({ name }, _idx) => name,
                              ({ name }, idx) => {
                                // omit column resizer on the last column because it's sort-of awkward
                                return html`<astra-th
                                  .options=${this.columnOptions || nothing}
                                  .plugins="${this.plugins}"
                                  installed-plugins=${JSON.stringify(this.installedPlugins)}
                                  table-height=${ifDefined(this._height)}
                                  theme=${this.theme}
                                  value="${this.renamedColumnNames[name] ?? name}"
                                  original-value="${name}"
                                  width="${this.widthForColumnType(name, this.columnWidthOffsets[name])}px"
                                  ?separate-cells=${true}
                                  ?outer-border=${this.outerBorder}
                                  ?menu=${!this.isNonInteractive && !this.readonly}
                                  ?with-resizer=${!this.isNonInteractive && !this.staticWidths}
                                  ?is-first-column=${idx === 0}
                                  ?is-last-column=${idx === this.visibleColumns.length - 1}
                                  ?removable=${true}
                                  ?interactive=${!this.isNonInteractive}
                                  ?is-active=${name === this.activeColumn}
                                  @column-hidden=${this._onColumnHidden}
                                  @column-removed=${this._onColumnRemoved}
                                  @column-plugin-deactivated=${this._onColumnPluginDeactivated}
                                  @resize-start=${this._onColumnResizeStart}
                                  @resize=${this._onColumnResized}
                                  ?read-only=${this.readonly}
                                >
                                </astra-th>`
                              }
                            )}
                            ${
                              this.blankFill
                                ? html`<astra-th ?outer-border=${
                                    this.outerBorder
                                  } ?read-only=${true} fill .value=${null} .originalValue=${null}>
                            ${
                              this.isNonInteractive || !this.addableColumns
                                ? ''
                                : html`<span class="flex items-center absolute top-0 left-2 bottom-0 right-0">
                                    <astra-add-column-trigger></astra-add-column-trigger>
                                  </span>`
                            }
                            </<astra-th>`
                                : ''
                            }
                        </astra-tr>
                    </astra-thead>

                    <astra-rowgroup>
                        <div
                            style=${styleMap({
                              height: `${Math.max(this.visibleStartIndex * this.rowHeight, 0)}px`,
                              'will-change': 'transform, height',
                            })}
                        ></div>

                        <!-- render a TableRow element for each row of data -->
                        ${this.renderRows(this.newRows)} ${this.renderRows(this.existingVisibleRows)}

                    <div
                        style=${styleMap({
                          height: `${Math.max((this.rows.length - this.visibleEndIndex) * this.rowHeight, 0)}px`,
                          'will-change': 'transform, height',
                        })}
                    ></div>
                </astra-rowgroup>
            </div>
        </div>`
  }
}

// declare global {
//     interface HTMLElementTagNameMap {
//         'astra-table': AstraTable
//     }
// }
