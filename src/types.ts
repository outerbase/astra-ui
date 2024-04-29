import { type TemplateResult } from 'lit'

export enum Theme {
  light = 'light',
  dark = 'dark',
}

export enum Axis {
  'horizontal' = 'horizontal',
  'vertical' = 'vertical',
  'both' = 'both',
}

export {
  CellUpdateEvent,
  ColumnAddedEvent,
  ColumnEvent,
  ColumnRemovedEvent,
  ColumnRenameEvent,
  ColumnSelectedEvent,
  ColumnUpdatedEvent,
  MenuSelectedEvent,
  RowAddedEvent,
  RowRemovedEvent,
  RowSelectedEvent,
  RowUpdatedEvent,
  RowsEvent,
} from './lib/events.js'

// copied from dashboard
export type TableColumnType = 'string' | 'integer' | 'enum' | 'uuid' | 'date' | 'dateonly'
export enum ColumnStatus {
  created,
  updated,
  deleted,
}
export enum DBType {
  REAL = 'REAL',
  INTEGER = 'INTEGER',
  INT = 'INT',
  TEXT = 'TEXT',
  JSON = 'JSON',
  SMALLINT = 'SMALLINT',
  BIGINT = 'BIGINT',
  DECIMAL = 'DECIMAL',
  NUMERIC = 'NUMERIC',
  DOUBLE_PRECISION = 'DOUBLE PRECISION',
  SERIAL = 'SERIAL',
  BIGSERIAL = 'BIGSERIAL',
  MONEY = 'MONEY',
  CHAR = 'CHAR',
  VARCHAR = 'VARCHAR',
  BYTEA = 'BYTEA',
  TIMESTAMP = 'TIMESTAMP',
  TIMESTAMP_WITH_TIME_ZONE = 'TIMESTAMP WITH TIME ZONE',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  TIME = 'TIME',
  TIME_WITH_TIME_ZONE = 'TIME WITH TIME ZONE',
  INTERVAL = 'INTERVAL',
  BOOLEAN = 'BOOLEAN',
  ENUM = 'ENUM',
  POINT = 'POINT',
  LINE = 'LINE',
  LSEG = 'LSEG',
  BOX = 'BOX',
  PATH = 'PATH',
  POLYGON = 'POLYGON',
  CIRCLE = 'CIRCLE',
  CIDR = 'CIDR',
  INET = 'INET',
  MACADDR = 'MACADDR',
  MACADDR8 = 'MACADDR8',
  JSONB = 'JSONB',
  UUID = 'UUID',
  XML = 'XML',
  TSVECTOR = 'TSVECTOR',
  TSQUERY = 'TSQUERY',
  VARYING = 'CHARACTER VARYING',
}
export type TableColumn = {
  model?: 'column'
  type?: string
  name: string
  position: number
  default?: string // has `::type` appended / casting quirks
  defaultValue?: string
  comment?: string
  // plugins: Array<PluginInstallationModel>
  is_nullable: boolean
  unique: boolean
  primaryKey: boolean
  autoIncrement: boolean

  status: ColumnStatus | undefined
}

export type Schema = {
  columns: Columns
}
export type Columns = Array<TableColumn>
export type RowAsRecord = {
  id: string
  values: Record<string, Serializable>
  originalValues: Record<string, Serializable>
  isNew: boolean
}

// API Response:
export type Queryd = {
  name: string
  query: string
  count: number
  rows: Array<RowAsRecord>
}

// <td />:
export type Position = { column: string; row: string } // column name, row uuid
export type CellDetail = {
  position: Position
  label?: string
  previousValue: Serializable
  value: Serializable
}

// <th />
export type HeaderMenuOptions = Array<{
  label: string | TemplateResult<1>
  value: string
  classes?: string
  icon?: string | null
  options?: HeaderMenuOptions // sub menu
}>

export type ColumnPlugin = {
  columnName: string
  config: string
  displayName: string
  metadata: string
  id: string
  pluginWorkspaceId: string
  tagName: string
  isDefault: boolean
}

export type PluginWorkspaceInstallationId = {
  plugin_workspace_id: string
  plugin_installation_id: string
  isDefaultPlugin?: boolean
  supportingAttributes: string
}

export enum PluginEvent {
  onEdit = 'onedit',
  onStopEdit = 'onstopedit',
  onCancelEdit = 'oncanceledit',
  onSave = 'onsave',
  updateCell = 'updatecell',
  updateRow = 'updaterow',
  createRow = 'createrow',
  deleteRow = 'deleterow',
  getNextPage = 'getnextpage',
  getPreviousPage = 'getpreviouspage',

  configurePlugin = 'configure_plugin',
  installPlugin = 'install_plugin',
  ephemeralPluginInstall = 'ephemeral_install_plugin',
  uninstallPlugin = 'uninstall_plugin',
  sortColumn = 'sort_column',
  hideColumn = 'hide_column',
  deleteColumn = 'delete_column',
  createColumn = 'create_column',
  updateColumn = 'update_column',

  createIndex = 'create_index',
  updateIndex = 'update_index',
  deleteIndex = 'delete_index',
  pageNext = 'page_next',

  // DEPRECATED: Use `updateCell` instead
  cellValue = 'cellvalue',
}

export type Serializable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | Date // Note: Dates are not inherently JSON serializable without conversion to string
  | SerializableArray
  | SerializableRecord
export interface SerializableArray extends Array<Serializable> {}
export interface SerializableRecord extends Record<string, Serializable> {}
