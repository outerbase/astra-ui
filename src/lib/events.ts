import type { CellDetail, ColumnPlugin, PluginWorkspaceInstallationId, RowAsRecord, Serializable } from '../types'

type ColumnAttributes = { name: string; data?: Record<string, Serializable> }
class BubblyEvent extends Event {
  constructor(name: string) {
    super(name, { bubbles: true, composed: true })
  }
}

// CELLS
export class CellUpdateEvent extends BubblyEvent {
  public detail: CellDetail

  constructor(detail: CellDetail) {
    super('cell-updated')
    this.detail = detail
  }
}

export class TabOpenEvent extends BubblyEvent {
  public detail: {
    table: string
    schema: string
    filter: Record<string, string>
  }

  constructor(detail: { table: string; schema: string; filter: Record<string, string> }) {
    super('table-tab-open-event')
    this.detail = detail
  }
}

export class CellBlurEvent extends BubblyEvent {
  public detail: CellDetail

  constructor(detail: CellDetail) {
    super('cell-blurred')
    this.detail = detail
  }
}

// COLUMNS
export class ColumnEvent extends BubblyEvent {
  public data?: Record<string, Serializable>
  public name: string

  constructor(type: string, { data, name }: ColumnAttributes) {
    super(type)
    this.name = name
    this.data = data
  }
}

export class ColumnPluginEvent extends BubblyEvent {
  public plugin: ColumnPlugin

  constructor(type: string, plugin: ColumnPlugin) {
    super(type)
    this.plugin = plugin
  }
}

export class ColumnAddedEvent extends ColumnEvent {
  constructor(attr: ColumnAttributes) {
    super('column-added', attr)
  }
}

export class ColumnRenameEvent extends ColumnEvent {
  constructor(attr: ColumnAttributes) {
    super('column-renamed', attr)
  }
}

export class ColumnRemovedEvent extends ColumnEvent {
  constructor(attr: ColumnAttributes) {
    super('column-removed', attr)
  }
}

export class ColumnHiddenEvent extends ColumnEvent {
  constructor(attr: ColumnAttributes) {
    super('column-hidden', attr)
  }
}

export class ColumnPluginActivatedEvent extends ColumnPluginEvent {
  public column: string

  constructor(column: string, plugin: ColumnPlugin) {
    super('column-plugin-activated', plugin)
    this.column = column
  }
}

export class ColumnPluginDeactivatedEvent extends BubblyEvent {
  public installation: PluginWorkspaceInstallationId
  public column: string

  constructor(column: string, installation: PluginWorkspaceInstallationId) {
    super('column-plugin-deactivated')
    this.column = column
    this.installation = installation
  }
}

export class ColumnUpdatedEvent extends ColumnEvent {
  constructor(attr: ColumnAttributes) {
    super('column-updated', attr)
  }
}

// TODO not implemented
export class ColumnSelectedEvent extends ColumnEvent {
  constructor(attr: ColumnAttributes) {
    super('column-selected', attr)
  }
}

// ROWS
export class RowsEvent extends BubblyEvent {
  public rows: Array<RowAsRecord>

  constructor(type: string, rows: Array<RowAsRecord>) {
    super(type)
    this.rows = rows
  }
}

export class RowAddedEvent extends RowsEvent {
  constructor(row: RowAsRecord) {
    super('row-added', [row])
  }
}

export class RowUpdatedEvent extends RowsEvent {
  constructor(row: RowAsRecord) {
    super('row-updated', [row])
  }
}

export class RowRemovedEvent extends RowsEvent {
  constructor(rows: Array<RowAsRecord>) {
    super('row-removed', rows)
  }
}

// when a row is selected, emits an array of all currently selected rows
export class RowSelectedEvent extends RowsEvent {
  constructor(rows: Array<RowAsRecord>) {
    super('row-selected', rows)
  }
}

//  MENUS

export class MenuSelectedEvent extends BubblyEvent {
  value: string

  constructor(value: string) {
    super('menu-selection')
    this.value = value
  }
}

export class ResizeStartEvent extends BubblyEvent {
  name: string

  constructor(name: string) {
    super('resize-start')
    this.name = name
  }
}

export class ResizeEndEvent extends BubblyEvent {
  name: string
  delta: number // a +/- number denoting number of pixels change in column width

  constructor(name: string, delta: number) {
    super('resize-end')
    this.name = name
    this.delta = delta
  }
}

export class ResizeEvent extends BubblyEvent {
  name: string
  delta: number // a +/- number denoting number of pixels change in column width

  constructor(name: string, delta: number) {
    super('resize')
    this.name = name
    this.delta = delta
  }
}

export class ChangeEvent extends BubblyEvent {
  value: string
  constructor(value: string) {
    super('change')
    this.value = value
  }
}

export class MenuOpenEvent extends BubblyEvent {
  close: () => void
  constructor(close: () => void) {
    super('menuopen')
    this.close = close
  }
}

export class CheckEvent extends BubblyEvent {
  constructor() {
    super('toggle-check')
  }
}
