export var Theme;
(function (Theme) {
    Theme["light"] = "light";
    Theme["dark"] = "dark";
})(Theme || (Theme = {}));
export var Axis;
(function (Axis) {
    Axis["horizontal"] = "horizontal";
    Axis["vertical"] = "vertical";
    Axis["both"] = "both";
})(Axis || (Axis = {}));
export { CellUpdateEvent, ColumnAddedEvent, ColumnEvent, ColumnRemovedEvent, ColumnRenameEvent, ColumnSelectedEvent, ColumnUpdatedEvent, MenuSelectedEvent, RowAddedEvent, RowRemovedEvent, RowSelectedEvent, RowUpdatedEvent, RowsEvent, } from './lib/events.js';
export var ColumnStatus;
(function (ColumnStatus) {
    ColumnStatus[ColumnStatus["created"] = 0] = "created";
    ColumnStatus[ColumnStatus["updated"] = 1] = "updated";
    ColumnStatus[ColumnStatus["deleted"] = 2] = "deleted";
})(ColumnStatus || (ColumnStatus = {}));
export var DBType;
(function (DBType) {
    DBType["REAL"] = "REAL";
    DBType["INTEGER"] = "INTEGER";
    DBType["INT"] = "INT";
    DBType["TEXT"] = "TEXT";
    DBType["JSON"] = "JSON";
    DBType["SMALLINT"] = "SMALLINT";
    DBType["BIGINT"] = "BIGINT";
    DBType["DECIMAL"] = "DECIMAL";
    DBType["NUMERIC"] = "NUMERIC";
    DBType["DOUBLE_PRECISION"] = "DOUBLE PRECISION";
    DBType["SERIAL"] = "SERIAL";
    DBType["BIGSERIAL"] = "BIGSERIAL";
    DBType["MONEY"] = "MONEY";
    DBType["CHAR"] = "CHAR";
    DBType["VARCHAR"] = "VARCHAR";
    DBType["BYTEA"] = "BYTEA";
    DBType["TIMESTAMP"] = "TIMESTAMP";
    DBType["TIMESTAMP_WITH_TIME_ZONE"] = "TIMESTAMP WITH TIME ZONE";
    DBType["DATE"] = "DATE";
    DBType["DATETIME"] = "DATETIME";
    DBType["TIME"] = "TIME";
    DBType["TIME_WITH_TIME_ZONE"] = "TIME WITH TIME ZONE";
    DBType["INTERVAL"] = "INTERVAL";
    DBType["BOOLEAN"] = "BOOLEAN";
    DBType["ENUM"] = "ENUM";
    DBType["POINT"] = "POINT";
    DBType["LINE"] = "LINE";
    DBType["LSEG"] = "LSEG";
    DBType["BOX"] = "BOX";
    DBType["PATH"] = "PATH";
    DBType["POLYGON"] = "POLYGON";
    DBType["CIRCLE"] = "CIRCLE";
    DBType["CIDR"] = "CIDR";
    DBType["INET"] = "INET";
    DBType["MACADDR"] = "MACADDR";
    DBType["MACADDR8"] = "MACADDR8";
    DBType["JSONB"] = "JSONB";
    DBType["UUID"] = "UUID";
    DBType["XML"] = "XML";
    DBType["TSVECTOR"] = "TSVECTOR";
    DBType["TSQUERY"] = "TSQUERY";
    DBType["VARYING"] = "CHARACTER VARYING";
})(DBType || (DBType = {}));
export var PluginEvent;
(function (PluginEvent) {
    PluginEvent["onEdit"] = "onedit";
    PluginEvent["onStopEdit"] = "onstopedit";
    PluginEvent["onCancelEdit"] = "oncanceledit";
    PluginEvent["onSave"] = "onsave";
    PluginEvent["updateCell"] = "updatecell";
    PluginEvent["updateRow"] = "updaterow";
    PluginEvent["createRow"] = "createrow";
    PluginEvent["deleteRow"] = "deleterow";
    PluginEvent["getNextPage"] = "getnextpage";
    PluginEvent["getPreviousPage"] = "getpreviouspage";
    PluginEvent["configurePlugin"] = "configure_plugin";
    PluginEvent["installPlugin"] = "install_plugin";
    PluginEvent["ephemeralPluginInstall"] = "ephemeral_install_plugin";
    PluginEvent["uninstallPlugin"] = "uninstall_plugin";
    PluginEvent["sortColumn"] = "sort_column";
    PluginEvent["hideColumn"] = "hide_column";
    PluginEvent["deleteColumn"] = "delete_column";
    PluginEvent["createColumn"] = "create_column";
    PluginEvent["updateColumn"] = "update_column";
    PluginEvent["createIndex"] = "create_index";
    PluginEvent["updateIndex"] = "update_index";
    PluginEvent["deleteIndex"] = "delete_index";
    PluginEvent["pageNext"] = "page_next";
    // DEPRECATED: Use `updateCell` instead
    PluginEvent["cellValue"] = "cellvalue";
})(PluginEvent || (PluginEvent = {}));
