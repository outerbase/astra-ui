import { type TemplateResult } from 'lit';
export * from './lib/events.js';
export declare enum Theme {
    light = "light",
    dark = "dark"
}
export declare enum Axis {
    'horizontal' = "horizontal",
    'vertical' = "vertical",
    'both' = "both"
}
export type TableColumnType = 'string' | 'integer' | 'enum' | 'uuid' | 'date' | 'dateonly';
export declare enum ColumnStatus {
    created = 0,
    updated = 1,
    deleted = 2
}
export declare enum DBType {
    REAL = "REAL",
    INTEGER = "INTEGER",
    INT = "INT",
    TEXT = "TEXT",
    JSON = "JSON",
    SMALLINT = "SMALLINT",
    BIGINT = "BIGINT",
    DECIMAL = "DECIMAL",
    NUMERIC = "NUMERIC",
    DOUBLE_PRECISION = "DOUBLE PRECISION",
    SERIAL = "SERIAL",
    BIGSERIAL = "BIGSERIAL",
    MONEY = "MONEY",
    CHAR = "CHAR",
    VARCHAR = "VARCHAR",
    BYTEA = "BYTEA",
    TIMESTAMP = "TIMESTAMP",
    TIMESTAMP_WITH_TIME_ZONE = "TIMESTAMP WITH TIME ZONE",
    DATE = "DATE",
    DATETIME = "DATETIME",
    TIME = "TIME",
    TIME_WITH_TIME_ZONE = "TIME WITH TIME ZONE",
    INTERVAL = "INTERVAL",
    BOOLEAN = "BOOLEAN",
    ENUM = "ENUM",
    POINT = "POINT",
    LINE = "LINE",
    LSEG = "LSEG",
    BOX = "BOX",
    PATH = "PATH",
    POLYGON = "POLYGON",
    CIRCLE = "CIRCLE",
    CIDR = "CIDR",
    INET = "INET",
    MACADDR = "MACADDR",
    MACADDR8 = "MACADDR8",
    JSONB = "JSONB",
    UUID = "UUID",
    XML = "XML",
    TSVECTOR = "TSVECTOR",
    TSQUERY = "TSQUERY",
    VARYING = "CHARACTER VARYING"
}
export type TableColumn = {
    model?: 'column';
    type?: string;
    name: string;
    position: number;
    default?: string;
    defaultValue?: string;
    comment?: string;
    is_nullable: boolean;
    unique: boolean;
    primaryKey: boolean;
    autoIncrement: boolean;
    status: ColumnStatus | undefined;
};
export type Schema = {
    columns: Columns;
};
export type Columns = Array<TableColumn>;
export type RowAsRecord = {
    id: string;
    values: Record<string, Serializable>;
    originalValues: Record<string, Serializable>;
    isNew: boolean;
};
export type Queryd = {
    name: string;
    query: string;
    count: number;
    rows: Array<RowAsRecord>;
};
export type Position = {
    column: string;
    row: string;
};
export type CellDetail = {
    position: Position;
    label?: string;
    previousValue: Serializable;
    value: Serializable;
};
export type HeaderMenuOptions = Array<{
    label: string | TemplateResult<1>;
    value: string;
    classes?: string;
    icon?: string | null;
    options?: HeaderMenuOptions;
}>;
export type ColumnPlugin = {
    columnName: string;
    config: string;
    displayName: string;
    metadata: string;
    id: string;
    pluginWorkspaceId: string;
    tagName: string;
    isDefault: boolean;
};
export type PluginWorkspaceInstallationId = {
    plugin_workspace_id: string;
    plugin_installation_id: string;
    isDefaultPlugin?: boolean;
    supportingAttributes: string;
};
export declare enum PluginEvent {
    onEdit = "onedit",
    onStopEdit = "onstopedit",
    onCancelEdit = "oncanceledit",
    onSave = "onsave",
    updateCell = "updatecell",
    updateRow = "updaterow",
    createRow = "createrow",
    deleteRow = "deleterow",
    getNextPage = "getnextpage",
    getPreviousPage = "getpreviouspage",
    configurePlugin = "configure_plugin",
    installPlugin = "install_plugin",
    ephemeralPluginInstall = "ephemeral_install_plugin",
    uninstallPlugin = "uninstall_plugin",
    sortColumn = "sort_column",
    hideColumn = "hide_column",
    deleteColumn = "delete_column",
    createColumn = "create_column",
    updateColumn = "update_column",
    createIndex = "create_index",
    updateIndex = "update_index",
    deleteIndex = "delete_index",
    pageNext = "page_next",
    cellValue = "cellvalue"
}
export type Serializable = string | number | bigint | boolean | null | undefined | Date | SerializableArray | SerializableRecord;
export interface SerializableArray extends Array<Serializable> {
}
export interface SerializableRecord extends Record<string, Serializable> {
}
//# sourceMappingURL=types.d.ts.map