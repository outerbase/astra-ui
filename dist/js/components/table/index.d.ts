import { type PropertyValueMap } from 'lit';
import { ColumnHiddenEvent, ColumnRemovedEvent } from '../../lib/events.js';
import { type ColumnPlugin, type Columns, type HeaderMenuOptions, type PluginWorkspaceInstallationId, type RowAsRecord, type Schema } from '../../types.js';
import { ClassifiedElement } from '../classified-element.js';
import { type Ref } from 'lit/directives/ref.js';
import '../check-box.js';
import type ScrollArea from '../scroll-area.js';
import '../widgets/add-column.js';
import './tbody.js';
import './td.js';
import './th.js';
import './thead.js';
import './tr.js';
export default class AstraTable extends ClassifiedElement {
    selectableRows: boolean;
    keyboardShortcuts: boolean;
    schema?: Schema;
    set data(data: Array<RowAsRecord>);
    plugins?: Array<ColumnPlugin>;
    installedPlugins?: Record<string, PluginWorkspaceInstallationId | undefined>;
    isNonInteractive: boolean;
    authToken?: string;
    columnOptions?: Array<HeaderMenuOptions>;
    outerBorder: boolean;
    hiddenColumnNames: Array<string>;
    deletedColumnNames: Array<string>;
    renamedColumnNames: Record<string, string | undefined>;
    pluginAttributes: String;
    readonly: boolean;
    blankFill: boolean;
    columnWidthOffsets: Record<string, number | undefined>;
    addableColumns: boolean;
    protected scrollableEl: Ref<ScrollArea>;
    rows: Array<RowAsRecord>;
    newRows: Array<RowAsRecord>;
    protected existingVisibleRows: Array<RowAsRecord>;
    protected allRowsSelected: boolean;
    columns: Columns;
    protected visibleColumns: Columns;
    selectedRowUUIDs: Set<string>;
    protected removedRowUUIDs: Set<string>;
    protected columnTypes?: Record<string, string | number | boolean | undefined>;
    protected rowHeight: number;
    private visibleEndIndex;
    private visibleStartIndex;
    private _height?;
    protected updateVisibleColumns(): void;
    constructor();
    protected closeLastMenu?: () => void;
    protected fromIdToRowMap: Record<string, RowAsRecord | undefined>;
    addNewRow(row?: Partial<RowAsRecord>): RowAsRecord;
    addNewColumn(name: string): void;
    toggleSelectedRow(uuid: string): void;
    clearSelection(): void;
    deleteSelectedRows(): void;
    resetParams(): void;
    protected _onColumnRemoved({ name }: ColumnRemovedEvent): void;
    protected _onColumnHidden({ name }: ColumnHiddenEvent): void;
    protected _onRowSelection(): void;
    protected widthForColumnType(name: string, offset?: number): number;
    protected onKeyDown(event: KeyboardEvent): void;
    private _previousWidth;
    private _onColumnResizeStart;
    private _onColumnResized;
    private _onColumnPluginDeactivated;
    private setCssVariablesForPlugin;
    protected renderRows(rows: Array<RowAsRecord>): import("lit").TemplateResult<1>;
    protected updateTableView(): void;
    updateVisibleRows(scrollTop: number): void;
    numberOfVisibleRows(): number;
    firstUpdated(_changedProperties: PropertyValueMap<this>): void;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=index.d.ts.map