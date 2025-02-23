import { html, nothing, type PropertyValueMap, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import arrayToObject from '../../../lib/array-to-object.js'
import {
  ColumnAddedEvent,
  ColumnHiddenEvent,
  ColumnPinnedEvent,
  ColumnPluginDeactivatedEvent,
  ColumnRemovedEvent,
  ResizeEvent,
  ResizeStartEvent,
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
import type ScrollArea from '../../scroll-area.js'
import type { TableData } from './td.js'
import '../check-box.js'
import './td.js'
import './th.js'
import debounce from 'lodash-es/debounce.js'

const SCROLL_BUFFER_SIZE = 4
const COLUMN_BUFFER_SIZE = 3

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

  @property({ attribute: 'border-b', type: Boolean })
  public bottomBorder = false

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

  @state() contentScrollsHorizontally = false

  @property({ attribute: 'column-width-offsets', type: Object })
  public columnWidthOffsets: Record<string, number | undefined> = {}

  @property({ attribute: 'addable-columns', type: Boolean })
  public addableColumns = false

  @property({ attribute: 'active-column', type: String })
  public activeColumn?: string

  @property({ attribute: 'blurry', type: Boolean })
  public blurry = false

  @property({ attribute: 'column-menus', type: Boolean })
  public hasColumnMenus = false

  @property({ attribute: 'cell-menus', type: Boolean })
  public hasCellMenus = false

  @property({ attribute: 'virtualized-y-scrolling-disabled', type: Boolean }) public virtualizedYScrollingIsDisabled = false

  @state() protected scrollableEl: Ref<ScrollArea> = createRef()
  @state() public rows: Array<RowAsRecord> = []
  @state() public newRows: Array<RowAsRecord> = []
  @state() public oldRows: Array<RowAsRecord> = []
  @state() protected allRowsSelected = false
  @state() public columns: Columns = []
  @property({ type: Array }) public visibleColumns: Columns = [] // @property so that we can access it in updated()
  private visibleColumnsWidth = 0
  @state() public selectedRowUUIDs: Set<string> = new Set()
  @state() protected removedRowUUIDs: Set<string> = new Set()
  @state() protected columnTypes?: Record<string, string | number | boolean | undefined>
  @state() protected rowHeight: number = 38

  // virtualized scrolling
  @state() private _height?: number // TODO remove this?
  @state() private visibleRowEndIndex = 0
  @state() private visibleRowStartIndex = 0
  @state() visibleColumnStartIndex = 0
  @state() visibleColumnEndIndex = 0
  @state() private leftSpacerWidth = 0
  @state() private rightSpacerWidth = 0

  private _selectAllCheckbox = html`
    <astra-th
      .value=${null}
      .originalValue=${null}
      .width=${42}
      .theme=${this.theme}
      ?separate-cells=${true}
      ?outer-border=${this.outerBorder}
      ?blank=${true}
      ?read-only=${this.readonly}
    >
      <check-box
        .theme=${this.theme}
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

          // dispatch event that row selection changed
          this._onRowSelection()
        }}
      ></check-box>
    </astra-th>
  `

  // sticky pinned columns
  @property({ attribute: 'pinned-columns', type: Array }) pinnedColumns: Columns = []
  private pinnedColumnsWidth = 0

  // prevent leaks
  private rowHeightTimeoutId: number | null = null

  protected updateVisibleColumnIndexesAndSpacers() {
    const scrollContainer = this.scrollableEl?.value?.scroller?.value
    // base case
    if (!scrollContainer || this.visibleColumns.length === 0) {
      this.visibleColumnStartIndex = 0
      this.visibleColumnEndIndex = 0
      this.leftSpacerWidth = 0
      this.rightSpacerWidth = 0
      return

      // TODO detect/trigger re-render -- what if something just changed from the other case and we need to re-render?
    }

    const scrollLeft = scrollContainer.scrollLeft
    const viewportWidth = scrollContainer.clientWidth

    // If all columns fit in the viewport, show them all
    if (this.visibleColumnsWidth <= viewportWidth) {
      this.visibleColumnStartIndex = 0
      this.visibleColumnEndIndex = this.visibleColumns.length
      this.leftSpacerWidth = 0
      this.rightSpacerWidth = 0
      return

      // TODO detect/trigger re-render -- what if something just changed from the other case and we need to re-render?
    }

    let accumulatedWidth = 0
    let newStartIndex = 0
    let newEndIndex = 0
    let foundStartIndex = false
    let didChange = false

    // find COLUMN start/end indexes
    for (let i = 0; i < this.visibleColumns.length; i++) {
      const columnWidth = this.widthForColumnType(this.visibleColumns[i].name, this.columnWidthOffsets[this.visibleColumns[i].name])

      if (!foundStartIndex && accumulatedWidth + columnWidth > scrollLeft) {
        newStartIndex = i
        foundStartIndex = true
      }

      accumulatedWidth += columnWidth

      // subtract checkbox, when selectable
      // subtract pinned columns width
      if (accumulatedWidth > scrollLeft + viewportWidth - (this.selectableRows ? 42 : 0) - this.pinnedColumnsWidth) {
        newEndIndex = i
        break
      }
    } // end for loop

    // If we haven't set newEndIndex, it means all remaining columns fit
    if (newEndIndex === 0) {
      newEndIndex = this.visibleColumns.length
    }

    const _visibleColumnStartIndex = Math.max(0, newStartIndex - COLUMN_BUFFER_SIZE)
    if (this.visibleColumnStartIndex !== _visibleColumnStartIndex) {
      didChange = true
      this.visibleColumnStartIndex = _visibleColumnStartIndex
    }

    const _visibleColumnEndIndex = Math.min(this.visibleColumns.length, newEndIndex + COLUMN_BUFFER_SIZE)
    if (this.visibleColumnEndIndex !== _visibleColumnEndIndex) {
      didChange = true
      this.visibleColumnEndIndex = _visibleColumnEndIndex
    }

    // Calculate widths
    let leftSpacerWidth = 0
    for (let i = 0; i < this.visibleColumnStartIndex; i++) {
      leftSpacerWidth += this.widthForColumnType(this.visibleColumns[i].name, this.columnWidthOffsets[this.visibleColumns[i].name])
    }
    if (leftSpacerWidth !== this.leftSpacerWidth) {
      didChange = true
      this.leftSpacerWidth = leftSpacerWidth
    }

    let _rightSpacerWidth = 0
    for (let i = this.visibleColumnEndIndex; i < this.visibleColumns.length; i++) {
      _rightSpacerWidth += this.widthForColumnType(this.visibleColumns[i].name, this.columnWidthOffsets[this.visibleColumns[i].name])
    }
    if (_rightSpacerWidth !== this.rightSpacerWidth) {
      didChange = true
      this.rightSpacerWidth = _rightSpacerWidth
    }

    if (didChange) this.requestUpdate('visibleColumns')
  }

  constructor() {
    super()
    this.updateTableView = this.updateTableView.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this._onResize = this._onResize ? debounce(this._onResize, 50).bind(this) : this._onResize.bind(this)
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
    this.updateVisibleColumnIndexesAndSpacers()
  }

  public toggleSelectedRow(uuid: string) {
    const s = (this.selectedRowUUIDs = new Set(this.selectedRowUUIDs))
    if (s.has(uuid)) s.delete(uuid)
    else s.add(uuid)

    this._onRowSelection()
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
    this.updateVisibleColumnIndexesAndSpacers() // TODO i think this can be removed / is handled in a lifecycle hook?
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

  private _previousWidth = 0
  private _onColumnResizeStart({ name }: ResizeStartEvent) {
    this._previousWidth = this.columnWidthOffsets[name] ?? 0
  }

  private _onColumnResized(e: ResizeEvent) {
    const { delta, name } = e
    this.columnWidthOffsets = { ...this.columnWidthOffsets, [name]: this._previousWidth + delta }
  }

  private _onColumnPluginDeactivated({ column }: ColumnPluginDeactivatedEvent) {
    if (this.installedPlugins) {
      delete this.installedPlugins[column]
      this.requestUpdate('installedPlugins')
    }
  }

  private _onResize(event: UIEvent) {
    // skip when columns are being resized
    if (event.target === this) return

    this.updateTableView()
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

  protected updateTableView(): void {
    if (!this.virtualizedYScrollingIsDisabled) this.updateVisibleRowIndexes()
    else {
      this.visibleRowStartIndex = 0
      this.visibleRowEndIndex = this.oldRows.length
    }
    this.updateVisibleColumnIndexesAndSpacers()
  }

  protected updateVisibleRowIndexes(): void {
    const previousStart = this.visibleRowStartIndex
    const previousEnd = this.visibleRowEndIndex
    const scrollTop = this.scrollableEl?.value?.scroller?.value?.scrollTop ?? 0
    const relevantRows = this.oldRows
    const _startIndex = Math.max(Math.floor(scrollTop / this.rowHeight) - SCROLL_BUFFER_SIZE, 0)
    const possiblyVisibleRowEndIndex = _startIndex + this.numberOfVisibleRows() + SCROLL_BUFFER_SIZE
    const _endIndex = possiblyVisibleRowEndIndex < relevantRows.length ? possiblyVisibleRowEndIndex : relevantRows.length

    this.visibleRowStartIndex = _startIndex
    this.visibleRowEndIndex = _endIndex

    // if any changes are detected
    if (previousStart !== _startIndex || previousEnd || _endIndex) {
      this.requestUpdate('oldRows')
    }
  }

  public numberOfVisibleRows(): number {
    return Math.ceil((this.scrollableEl?.value?.scroller?.value?.clientHeight ?? 0) / this.rowHeight)
  }

  public override firstUpdated(changedProperties: PropertyValueMap<this>): void {
    super.firstUpdated(changedProperties)

    if (this.keyboardShortcuts) {
      document.addEventListener('keydown', this.onKeyDown)
    }

    // ensure that `this.rowHeight` is correct
    const elem = document.createElement('astra-td') as TableData
    elem.outerBorder = this.outerBorder
    elem.bottomBorder = this.bottomBorder
    elem.isInteractive = true

    // Temporarily add to the DOM to measure
    this.scrollableEl?.value?.appendChild(elem)
    this.rowHeightTimeoutId = window.setTimeout(() => {
      const offsetHeight = elem.offsetHeight
      this.scrollableEl?.value?.removeChild(elem)
      if (this.rowHeight !== offsetHeight) {
        this.rowHeight = offsetHeight
      }
    }, 0)
    // end: ensure that `this.rowHeight` is correct

    // without this setTimeout, toggling between Data/Strucuture in Dashboard will cause the header to disappear
    setTimeout(this.updateTableView, 0)
  }

  @state() unpinnedTableSection: TemplateResult<1> | typeof nothing = nothing
  @state() pinnedTableSection: TemplateResult<1> | typeof nothing = nothing

  public override updated(changedProperties: PropertyValueMap<this>): void {
    super.updated(changedProperties)
    const has = changedProperties.has.bind(changedProperties)

    // update pinned columns width
    if (has('pinnedColumns')) {
      this.pinnedColumnsWidth = this.pinnedColumns.reduce(
        (sum, column) => sum + this.widthForColumnType(column.name, this.columnWidthOffsets[column.name]),
        0
      )
    }

    // when any props used in _renderTable() change
    // update our cached rendering
    if (
      has('pinnedColumns') ||
      has('visibleColumns') ||
      has('oldRows') ||
      has('newRows') ||
      has('selectableRows') ||
      has('visibleColumnStartIndex') ||
      has('visibleColumnEndIndex') ||
      has('columnWidthOffsets') ||
      has('renamedColumnNames') ||
      has('installedPlugins') ||
      has('columnOptions') ||
      has('plugins') ||
      has('theme') ||
      has('isNonInteractive') ||
      has('readonly') ||
      has('hasColumnMenus') ||
      has('staticWidths') ||
      has('activeColumn') ||
      has('outerBorder')
    ) {
      this.pinnedTableSection = this._renderTable(this.pinnedColumns, true)
    }

    if (
      has('visibleColumns') ||
      has('oldRows') ||
      has('newRows') ||
      has('selectableRows') ||
      has('visibleColumnStartIndex') ||
      has('visibleColumnEndIndex') ||
      has('columnWidthOffsets') ||
      has('renamedColumnNames') ||
      has('installedPlugins') ||
      has('columnOptions') ||
      has('plugins') ||
      has('theme') ||
      has('isNonInteractive') ||
      has('readonly') ||
      has('hasColumnMenus') ||
      has('staticWidths') ||
      has('activeColumn') ||
      has('outerBorder')
    ) {
      this.unpinnedTableSection = this._renderTable(this.visibleColumns)
    }

    if (has('rows')) {
      this.fromIdToRowMap = {}
      this.newRows = []
      this.oldRows = []

      this.rows.forEach((row) => {
        if (row.isNew && !row.isDeleted && !this.removedRowUUIDs.has(row.id)) {
          this.newRows.push(row)
        }

        if (!row.isNew && !row.isDeleted && !this.removedRowUUIDs.has(row.id)) {
          this.oldRows.push(row)
        }

        this.fromIdToRowMap[row.id] = row
      })

      this.updateTableView()
    }

    if (has('columns') || has('hiddenColumnNames') || has('deletedColumnNames') || has('pinnedColumns')) {
      this.visibleColumns = this.columns.filter(
        ({ name, status }) =>
          status !== ColumnStatus.deleted &&
          this.hiddenColumnNames.indexOf(name) === -1 &&
          this.deletedColumnNames.indexOf(name) === -1 &&
          !this.pinnedColumns.find((c) => c.name === name)
      )
      this.visibleColumnsWidth = this.visibleColumns.reduce(
        (sum, column) => sum + this.widthForColumnType(column.name, this.columnWidthOffsets[column.name]),
        0
      )
    }
  }

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    // identify columns from the schema
    if (changedProperties.has('schema')) {
      if (this.schema) {
        this.columns = this.schema.columns
        this.columnTypes = arrayToObject(this.columns, 'name', 'type')
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

      this.updateTableView() // necessary in astra, but not dashboard 🤔
    }

    if (changedProperties.has('hiddenColumnNames') || changedProperties.has('schema') || changedProperties.has('rows')) {
      // without the setTimeout, toggling between two tabs in Dashboard causes us to see a flat/collapsed/empty table, while a delay of 0s resolves it
      setTimeout(this.updateTableView, 0)
    }

    if (changedProperties.has('pinnedColumns')) {
      // this IS necessary when viewing from Astra, or else you see double columns immediately after pinning (disappears on scroll)
      this.updateTableView()
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('resize', this._onResize)
  }

  public override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('keydown', this.onKeyDown)
    if (this.rowHeightTimeoutId !== null) {
      clearTimeout(this.rowHeightTimeoutId)
    }
    window.removeEventListener('resize', this._onResize)
  }

  private _renderTable(columns: Columns, isPinned = false) {
    const {
      visibleRowStartIndex,
      visibleRowEndIndex,
      visibleColumns,
      pinnedColumns,
      selectableRows,
      newRows,
      oldRows,
      _selectAllCheckbox,
      visibleColumnStartIndex,
      visibleColumnEndIndex,
      columnWidthOffsets,
      renamedColumnNames,
      columnOptions,
      plugins,
      installedPlugins,
      realInstalledPlugins,
      theme,
      isNonInteractive,
      readonly,
      hasColumnMenus,
      staticWidths,
      activeColumn,
      outerBorder,
      bottomBorder,
      selectedRowUUIDs,
      columnTypes,
      hasCellMenus,
    } = this
    const selectAllCheckbox = selectableRows && isPinned ? _selectAllCheckbox : nothing
    const columnHeaders = repeat(
      columns,
      ({ name }, _idx) => name,
      ({ name }, idx) => {
        const rowOutOfRange = idx < visibleColumnStartIndex || idx > visibleColumnEndIndex
        const rowInRange = !rowOutOfRange
        const shouldRender = rowInRange || isPinned
        if (!shouldRender) return nothing

        return html`
          <astra-th
            .width=${this.widthForColumnType(name, columnWidthOffsets[name])}
            .options=${columnOptions || nothing}
            .plugins="${plugins}"
            installed-plugins=${JSON.stringify(installedPlugins)}
            theme=${theme}
            value="${renamedColumnNames[name] ?? name}"
            original-value="${name}"
            ?separate-cells=${true}
            ?outer-border=${outerBorder}
            ?menu=${!isNonInteractive && !readonly && hasColumnMenus}
            ?with-resizer=${!isNonInteractive && !staticWidths}
            ?is-first-column=${idx === 0 && !selectableRows}
            ?is-last-column=${idx === columns.length - 1}
            ?removable=${true}
            ?interactive=${!isNonInteractive}
            ?is-active=${name === activeColumn}
            ?pinned=${isPinned}
            @column-hidden=${this._onColumnHidden}
            @column-removed=${this._onColumnRemoved}
            @column-plugin-deactivated=${this._onColumnPluginDeactivated}
            @resize-start=${this._onColumnResizeStart}
            @resize=${this._onColumnResized}
            @column-pinned=${(ev: ColumnPinnedEvent) => {
              const column = this.columns.find((c) => c.name === ev.name)
              const pinnedIndex = column ? pinnedColumns.indexOf(column) : -1
              if (pinnedIndex > -1) pinnedColumns.splice(pinnedIndex, 1)
              else if (column) pinnedColumns.push(column)

              this.requestUpdate('pinnedColumns')
            }}
            ?read-only=${this.readonly}
          >
          </astra-th>
        `
      }
    )
    const newRowCheckboxes = selectableRows
      ? repeat(
          this.newRows,
          ({ id }) => id,
          ({ id }) =>
            html`<astra-td
              .position=${{
                row: id,
                column: '__selected', // our own; not expected to exist in DB
              }}
              .type=${null}
              .width=${42}
              .theme=${theme}
              ?separate-cells=${true}
              ?outer-border=${outerBorder}
              ?border-b=${bottomBorder}
              ?blank=${true}
              ?is-last-row=${false}
              ?is-last-column=${false}
              ?row-selector=${true}
              ?read-only=${true}
              ?interactive=${true}
              ?row-is-new=${true}
            >
              <check-box ?checked=${selectedRowUUIDs.has(id)} @toggle-check=${() => this.toggleSelectedRow(id)} theme=${theme} />
            </astra-td>`
        )
      : nothing
    const oldRowCheckboxes = selectableRows
      ? html`<div>
          ${repeat(
            this.oldRows,
            ({ id }) => id,
            ({ id }, rowIndex) =>
              rowIndex >= visibleRowStartIndex - SCROLL_BUFFER_SIZE && rowIndex < visibleRowEndIndex + SCROLL_BUFFER_SIZE
                ? html`<astra-td
                    .position=${{
                      row: id,
                      column: '__selected', // our own; not expected to exist in DB
                    }}
                    .type=${null}
                    .width=${42}
                    theme=${theme}
                    ?separate-cells=${true}
                    ?outer-border=${outerBorder}
                    ?border-b=${bottomBorder}
                    ?blank=${true}
                    ?is-last-row=${false}
                    ?is-last-column=${false}
                    ?row-selector="${true}"
                    ?read-only=${true}
                    ?interactive=${true}
                  >
                    <check-box
                      .theme=${theme}
                      ?checked=${selectedRowUUIDs.has(id)}
                      @toggle-check=${() => this.toggleSelectedRow(id)}
                    ></check-box>
                  </astra-td>`
                : nothing
          )}
        </div>`
      : nothing

    const unpinnedNewRows = isPinned
      ? nothing
      : visibleColumns.map(({ name }, cidx) => {
          const rowOutOfRange = cidx < visibleColumnStartIndex || cidx > visibleColumnEndIndex
          if (rowOutOfRange) return nothing

          const adjustedColumnIndex = cidx + visibleColumnStartIndex

          // plugin
          const installedPlugin = plugins?.find(
            ({ pluginWorkspaceId }) => pluginWorkspaceId === installedPlugins?.[name]?.plugin_workspace_id
          )
          const defaultPlugin = plugins?.find(({ id }) => id === installedPlugins?.[name]?.plugin_installation_id)
          const plugin = installedPlugin ?? defaultPlugin
          const realInstallation = realInstalledPlugins?.find(
            ({ plugin_workspace_id }) => plugin?.pluginWorkspaceId === plugin_workspace_id
          )
          if (plugin && realInstallation?.config) {
            plugin.config = JSON.stringify(realInstallation?.config)
          }

          return html`<div class="">
            ${repeat(
              newRows,
              ({ id }) => id,
              ({ id, values, originalValues }, rowIndex) => html`
                <astra-td
                  .position=${{ row: id, column: name }}
                  .value=${values[name]}
                  .originalValue=${originalValues[name]}
                  .column=${name}
                  .plugin=${plugin}
                  .width=${this.widthForColumnType(name, columnWidthOffsets[name])}
                  theme=${theme}
                  type=${columnTypes?.[name]}
                  plugin-attributes=${installedPlugins?.[name]?.supportingAttributes ?? ''}
                  ?separate-cells=${true}
                  ?outer-border=${outerBorder}
                  ?border-b=${bottomBorder}
                  ?resizable=${!staticWidths}
                  ?is-last-row=${false}
                  ?is-last-column=${adjustedColumnIndex === columns.length - 1}
                  ?is-first-row=${rowIndex === 0}
                  ?is-first-column=${adjustedColumnIndex === 0}
                  ?menu=${!isNonInteractive && !readonly && hasCellMenus}
                  ?interactive=${!isNonInteractive}
                  ?read-only=${readonly}
                  ?is-active=${name === activeColumn}
                  ?pinned=${isPinned}
                  ?hide-dirt=${true}
                  ?row-is-new=${true}
                >
                </astra-td>
              `
            )}
          </div>`
        })
    const unpinnedExistingRows = isPinned
      ? nothing
      : columns.map(({ name }, cidx) => {
          if (cidx < visibleColumnStartIndex || cidx > visibleColumnEndIndex) return nothing
          const adjustedColumnIndex = cidx + visibleColumnStartIndex

          // plugin
          const installedPlugin = plugins?.find(
            ({ pluginWorkspaceId }) => pluginWorkspaceId === installedPlugins?.[name]?.plugin_workspace_id
          )
          const defaultPlugin = plugins?.find(({ id }) => id === installedPlugins?.[name]?.plugin_installation_id)
          const plugin = installedPlugin ?? defaultPlugin
          const realInstallation = realInstalledPlugins?.find(
            ({ plugin_workspace_id }) => plugin?.pluginWorkspaceId === plugin_workspace_id
          )
          if (plugin && realInstallation?.config) {
            plugin.config = JSON.stringify(realInstallation?.config)
          }

          return html`<div>
            ${repeat(
              oldRows,
              ({ id }) => id,
              ({ id, values, originalValues }, rowIndex) =>
                rowIndex >= visibleRowStartIndex - SCROLL_BUFFER_SIZE && rowIndex < visibleRowEndIndex + SCROLL_BUFFER_SIZE
                  ? html`
                      <astra-td
                        .position=${{ row: id, column: name }}
                        .value=${values[name]}
                        .originalValue=${originalValues[name]}
                        .column=${name}
                        .plugin=${plugin}
                        .width=${this.widthForColumnType(name, this.columnWidthOffsets[name])}
                        theme="${this.theme}"
                        type="${this.columnTypes?.[name]}"
                        plugin-attributes=${this.installedPlugins?.[name]?.supportingAttributes ?? ''}
                        ?separate-cells=${true}
                        ?outer-border=${this.outerBorder}
                        ?border-b=${this.bottomBorder}
                        ?resizable=${!this.staticWidths}
                        ?is-last-row=${false}
                        ?is-last-column=${adjustedColumnIndex === columns.length - 1}
                        ?is-first-row=${rowIndex === 0}
                        ?is-first-column=${adjustedColumnIndex === 0}
                        ?menu=${!this.isNonInteractive && !this.readonly && this.hasCellMenus}
                        ?interactive=${!this.isNonInteractive}
                        ?read-only=${this.readonly}
                        ?is-active=${name === this.activeColumn || this.selectedRowUUIDs.has(id)}
                        ?pinned=${isPinned}
                        ?hide-dirt=${false}
                        ?row-is-new=${false}
                      >
                      </astra-td>
                    `
                  : nothing
            )}
          </div>`
        })
    const pinnedExistingRows = !isPinned
      ? nothing
      : columns.map(({ name }, cidx) => {
          const adjustedColumnIndex = cidx + visibleColumnStartIndex

          // plugin
          const installedPlugin = plugins?.find(
            ({ pluginWorkspaceId }) => pluginWorkspaceId === installedPlugins?.[name]?.plugin_workspace_id
          )
          const defaultPlugin = plugins?.find(({ id }) => id === installedPlugins?.[name]?.plugin_installation_id)
          const plugin = installedPlugin ?? defaultPlugin
          const realInstallation = realInstalledPlugins?.find(
            ({ plugin_workspace_id }) => plugin?.pluginWorkspaceId === plugin_workspace_id
          )
          if (plugin && realInstallation?.config) {
            plugin.config = JSON.stringify(realInstallation?.config)
          }

          return html`<div>
            ${repeat(
              oldRows,
              ({ id }) => id,
              ({ id, values, originalValues }, rowIndex) =>
                rowIndex >= visibleRowStartIndex - SCROLL_BUFFER_SIZE && rowIndex < visibleRowEndIndex + SCROLL_BUFFER_SIZE
                  ? html`
                      <astra-td
                        .position=${{ row: id, column: name }}
                        .value=${values[name]}
                        .originalValue=${originalValues[name]}
                        .column=${name}
                        .plugin=${plugin}
                        .width=${this.widthForColumnType(name, this.columnWidthOffsets[name])}
                        theme="${this.theme}"
                        type="${this.columnTypes?.[name]}"
                        plugin-attributes=${this.installedPlugins?.[name]?.supportingAttributes ?? ''}
                        ?separate-cells=${true}
                        ?outer-border=${this.outerBorder}
                        ?border-b=${this.bottomBorder}
                        ?resizable=${!this.staticWidths}
                        ?is-last-row=${false}
                        ?is-last-column=${adjustedColumnIndex === columns.length - 1}
                        ?is-first-row=${rowIndex === 0}
                        ?is-first-column=${adjustedColumnIndex === 0}
                        ?menu=${!this.isNonInteractive && !this.readonly && this.hasCellMenus}
                        ?interactive=${!this.isNonInteractive}
                        ?read-only=${this.readonly}
                        ?is-active=${name === this.activeColumn || this.selectedRowUUIDs.has(id)}
                        ?pinned=${isPinned}
                        ?hide-dirt=${false}
                        ?row-is-new=${false}
                      >
                      </astra-td>
                    `
                  : nothing
            )}
          </div>`
        })
    const pinnedNewRows = !isPinned
      ? nothing
      : columns.map(({ name }, cidx) => {
          const adjustedColumnIndex = cidx + visibleColumnStartIndex

          // plugin
          const installedPlugin = plugins?.find(
            ({ pluginWorkspaceId }) => pluginWorkspaceId === installedPlugins?.[name]?.plugin_workspace_id
          )
          const defaultPlugin = plugins?.find(({ id }) => id === installedPlugins?.[name]?.plugin_installation_id)
          const plugin = installedPlugin ?? defaultPlugin
          const realInstallation = realInstalledPlugins?.find(
            ({ plugin_workspace_id }) => plugin?.pluginWorkspaceId === plugin_workspace_id
          )
          if (plugin && realInstallation?.config) {
            plugin.config = JSON.stringify(realInstallation?.config)
          }

          return html`<div class="bg-red-100 flex flex-col">
            ${repeat(
              newRows,
              ({ id }) => id,
              ({ id, values, originalValues }, rowIndex) => html`
                <astra-td
                  .position=${{ row: id, column: name }}
                  .value=${values[name]}
                  .originalValue=${originalValues[name]}
                  .column=${name}
                  .plugin=${plugin}
                  .width=${this.widthForColumnType(name, columnWidthOffsets[name])}
                  theme=${theme}
                  type=${columnTypes?.[name]}
                  plugin-attributes=${installedPlugins?.[name]?.supportingAttributes ?? ''}
                  ?separate-cells=${true}
                  ?outer-border=${outerBorder}
                  ?border-b=${bottomBorder}
                  ?resizable=${!staticWidths}
                  ?is-last-row=${false}
                  ?is-last-column=${adjustedColumnIndex === columns.length - 1}
                  ?is-first-row=${rowIndex === 0}
                  ?is-first-column=${adjustedColumnIndex === 0}
                  ?menu=${!isNonInteractive && !readonly && hasCellMenus}
                  ?interactive=${!isNonInteractive}
                  ?read-only=${readonly}
                  ?is-active=${name === activeColumn}
                  ?pinned=${isPinned}
                  ?hide-dirt=${true}
                  ?row-is-new=${true}
                >
                </astra-td>
              `
            )}
          </div>`
        })

    return html`<!-- header + body -->
      <div
        class="flex flex-col ${isPinned
          ? 'sticky left-0 z-[19] shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgb(0,0,0)]'
          : ''}"
      >
        <!-- header -->
        <div class="flex flex-row sticky top-0 z-10">${selectAllCheckbox} ${columnHeaders}</div>

        <!-- vertical spacer -->
        <div
          class="flex-none"
          style=${styleMap({ height: `${Math.max(0, this.visibleRowStartIndex - SCROLL_BUFFER_SIZE) * this.rowHeight}px`, width: '1px' })}
        ></div>

        <!-- body -->
        ${isPinned
          ? html`<div class="flex bg-theme-table-row-even dark:bg-theme-table-row-even-dark">
              <div class="flex">
                <!-- check boxes -->
                <div class="flex flex-col">
                  <!-- new rows -->
                  <div class="sticky z-[1] top-[36px]">${newRowCheckboxes}</div>

                  <!-- old rows -->
                  ${oldRowCheckboxes}
                </div>
              </div>

              <div class="flex flex-col">
                <div class="flex sticky z-[1] top-[36px]">${pinnedNewRows}</div>
                <div class="flex">${pinnedExistingRows}</div>
              </div>
            </div>`
          : nothing}

        <!-- columns + rows of data -->
        <div class="flex sticky z-[1] top-[36px]">${unpinnedNewRows}</div>
        <div class="flex">${unpinnedExistingRows}</div>

        <!-- vertical spacer -->
        <div
          class="flex-none"
          style=${styleMap({
            height: `${Math.max(0, this.oldRows.length - this.visibleRowEndIndex - SCROLL_BUFFER_SIZE) * this.rowHeight}px`,
            width: '1px',
          })}
        ></div>
      </div>`
  }

  public override render() {
    const tableEndPlaceholder = html`<div class="flex-1 flex flex-col">
      <!-- header -->
      <div class="sticky top-0 z-10">
        <astra-th
          theme=${this.theme}
          table-height=${ifDefined(this._height)}
          .value=${null}
          .originalValue=${null}
          ?separate-cells=${true}
          ?outer-border=${this.outerBorder}
          ?is-last-column=${true}
          ?blank=${true}
          ?read-only=${true}
        >
        </astra-th>
      </div>

      <!-- body -->
      <!-- vertical spacer -->
      <div
        class="flex-none"
        style=${styleMap({ height: `${Math.max(0, this.visibleRowStartIndex - SCROLL_BUFFER_SIZE) * this.rowHeight}px`, width: '1px' })}
      ></div>
      <!-- new rows (sticky) -->
      <div class="sticky z-[1] top-[36px]">
        <div class="flex flex-col">
          ${repeat(
            this.newRows,
            ({ id }) => id,
            ({ id }, rowIndex) => html`
              <astra-td
                theme=${this.theme}
                .position=${{ row: id, column: '' }}
                ?separate-cells=${true}
                ?outer-border=${this.outerBorder}
                ?border-b=${this.bottomBorder}
                ?resizable=${false}
                ?is-last-row=${false}
                ?is-last-column=${true}
                ?is-first-row=${rowIndex === 0}
                ?is-first-column=${false}
                ?menu=${false}
                ?interactive=${false}
                ?read-only=${true}
                ?blank=${true}
                ?is-active=${this.selectedRowUUIDs.has(id)}
                ?row-is-new=${true}
              >
              </astra-td>
            `
          )}
        </div>
      </div>

      <!-- existing rows -->
      <div class="flex-auto">
        <div class="flex flex-col">
          ${repeat(
            this.oldRows,
            ({ id }) => id,
            ({ id }, rowIndex) =>
              rowIndex >= this.visibleRowStartIndex - SCROLL_BUFFER_SIZE && rowIndex < this.visibleRowEndIndex + SCROLL_BUFFER_SIZE
                ? html`
                    <astra-td
                      .theme=${this.theme}
                      .position=${{ row: id, column: '' }}
                      ?separate-cells=${true}
                      ?outer-border=${this.outerBorder}
                      ?border-b=${this.bottomBorder}
                      ?resizable=${false}
                      ?is-last-row=${rowIndex === this.oldRows.length - 1}
                      ?is-last-column=${true}
                      ?is-first-row=${rowIndex === 0}
                      ?is-first-column=${false}
                      ?menu=${false}
                      ?interactive=${false}
                      ?read-only=${true}
                      ?blank=${true}
                      ?is-active=${this.selectedRowUUIDs.has(id)}
                      ?row-is-new=${false}
                    >
                    </astra-td>
                  `
                : nothing
          )}
        </div>
      </div>
      <!-- vertical spacer -->
      <div
        class="flex-none"
        style=${styleMap({
          height: `${Math.max(0, this.oldRows.length - this.visibleRowEndIndex - SCROLL_BUFFER_SIZE) * this.rowHeight}px`,
          width: '1px',
        })}
      ></div>
    </div>`

    // threshold-x is potentially problematic if columns aren't all divisible by 50
    // which customized ones, for example, won't be
    // but the buffer offsets the chance of a column rendering blank regardless?
    return html`
      <astra-scroll-area
        ${ref(this.scrollableEl)}
        threshold-x=${50}
        threshold-y=${34}
        theme=${this.theme}
        .onScroll=${this.updateTableView}
      >
        <!-- important: 'id=table' is used by dashboard -->
        <div class="flex w-full min-w-fit" id="table">
          <!-- pinned columns -->
          ${this.pinnedTableSection}

          <!-- virtualized column scrolling; left -->
          <div class="flex-none" id="leftSpacer" style=${styleMap({ width: `${this.leftSpacerWidth}px`, height: '1px' })}></div>

          <!-- remaining unpinned content -->
          ${this.unpinnedTableSection}

          <!-- virtualized column scrolling; right -->
          <div id="rightSpacer" style=${styleMap({ width: `${this.rightSpacerWidth}px`, height: '1px' })}></div>

          <!-- this is only visible when there is negative space to the right of the table -->
          ${tableEndPlaceholder}
        </div>
      </astra-scroll-area>
    `
  }
}
