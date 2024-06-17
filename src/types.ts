import { type TemplateResult } from 'lit'

export * from './lib/events.js'

export enum Theme {
  light = 'light',
  dark = 'dark',
}

export enum Axis {
  'horizontal' = 'horizontal',
  'vertical' = 'vertical',
  'both' = 'both',
}

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
  config: any
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
  config?: any
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

// CHARTS

export type Dataset = {
  data: { label: string; value: number }[]
  color?: string // hex
}

export type Row = {
  column: string
  sampleData: any
  columnName: string
  type: string
  include: boolean
}

export type ChartTypeV3 = 'column' | 'bar' | 'pie' | 'donut' | 'line' | 'area' | 'single_value' | 'table' | 'scatter' | 'heatmap' | 'text'
export type DashboardV3ChartLegend = 'none' | 'top' | 'bottom' | 'left' | 'right'
export type DashboardV3ChartLabelDisplayX = 'auto' | '0' | '45' | '90' | 'hidden'
export type DashboardV3ChartLabelDisplayY = 'left' | 'right' | 'hidden'
export type DashboardV3ChartSortOrder = 'default' | 'asc' | 'desc'
export type DashboardV3HighlightType = 'total' | 'average' | 'percent_change'

export type DashboardV3ChartQuery = {
  // SQL query to fetch the data for the chart
  sql?: string
  // If the source of the SQL is from an attached saved query, this is the ID of the saved query
  queryId?: string
  // The type of chart to render
  type: ChartTypeV3
  // The data result of the query being executed
  result: Row[] | null | undefined
  // Indicates if this queries results should be hidden from the user
  hidden?: boolean
}

export type DashboardV3ChartOptions = {
  // The location of the legend on the chart
  legend?: DashboardV3ChartLegend
  // The X axis label for the chart
  xAxisLabel?: string
  // The Y axis label for the chart
  yAxisLabel?: string
  // The X axis column key for the chart
  xAxisKey?: string
  // The Y axis column keys for the chart series
  yAxisKeys?: string[]
  // The display, or hidden, and angle degree of the X axis labels
  xAxisLabelDisplay?: DashboardV3ChartLabelDisplayX
  // The position of the Y axis, or hidden
  yAxisLabelDisplay?: DashboardV3ChartLabelDisplayY
  // Order the data in a specific order
  sortOrder?: DashboardV3ChartSortOrder
  // The column to group the data by
  groupBy?: string
  // indicate that we're using % values
  percentage?: boolean
}

export type DashboardV3Highlight = {
  type: DashboardV3HighlightType
}

export type DashboardV3Chart = {
  // The unique identifier for the chart
  id?: string
  // The name of the chart as provided by the user
  name: string
  description?: string
  // An API key value that is used to fetch details of the chart
  apiKey: string
  // Array of queries that are used to render various charts on the widget
  layers: Array<DashboardV3ChartQuery>
  // highlights
  highlights?: Array<DashboardV3HighlightType>
  // Chart options
  options: DashboardV3ChartOptions
}

export enum DashboardFilterType {
  enum = 'enum',
  sql = 'sql',
  search = 'search',
}

export type DashboardV3Filters = {
  type: DashboardFilterType
  name: string
  value: string
  sql?: string
  options?: Array<string>
}

export type DashboardV3 = {
  id: string
  name: string
  // Specify a version of the chart to allow for backwards compatibility
  version?: number
  charts: Array<DashboardV3Chart>
  chart_ids: Array<string>
  layout: Array<{
    // Unique identifier of the item in this layout position
    i: string
    // The X value where the item starts in the layout grid
    x: number
    // The Y value where the item starts in the layout grid
    y: number
    // The width of the item in the layout grid
    w: number
    // The height of the item in the layout grid
    h: number
    // The maximum height of the item in the layout grid
    maxH: number
    // The maximum width of the item in the layout grid
    maxW: number
  }>
  filters?: Array<DashboardV3Filters>
}
