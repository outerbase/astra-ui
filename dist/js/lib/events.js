class BubblyEvent extends Event {
    constructor(name) {
        super(name, { bubbles: true, composed: true });
    }
}
// CELLS
export class CellUpdateEvent extends BubblyEvent {
    constructor(detail) {
        super('cell-updated');
        this.detail = detail;
    }
}
// COLUMNS
export class ColumnEvent extends BubblyEvent {
    constructor(type, { data, name }) {
        super(type);
        this.name = name;
        this.data = data;
    }
}
export class ColumnPluginEvent extends BubblyEvent {
    constructor(type, plugin) {
        super(type);
        this.plugin = plugin;
    }
}
export class ColumnAddedEvent extends ColumnEvent {
    constructor(attr) {
        super('column-added', attr);
    }
}
export class ColumnRenameEvent extends ColumnEvent {
    constructor(attr) {
        super('column-renamed', attr);
    }
}
export class ColumnRemovedEvent extends ColumnEvent {
    constructor(attr) {
        super('column-removed', attr);
    }
}
export class ColumnHiddenEvent extends ColumnEvent {
    constructor(attr) {
        super('column-hidden', attr);
    }
}
export class ColumnPluginActivatedEvent extends ColumnPluginEvent {
    constructor(column, plugin) {
        super('column-plugin-activated', plugin);
        this.column = column;
    }
}
export class ColumnPluginDeactivatedEvent extends BubblyEvent {
    constructor(column, installation) {
        super('column-plugin-deactivated');
        this.column = column;
        this.installation = installation;
    }
}
export class ColumnUpdatedEvent extends ColumnEvent {
    constructor(attr) {
        super('column-updated', attr);
    }
}
// TODO not implemented
export class ColumnSelectedEvent extends ColumnEvent {
    constructor(attr) {
        super('column-selected', attr);
    }
}
// ROWS
export class RowsEvent extends BubblyEvent {
    constructor(type, rows) {
        super(type);
        this.rows = rows;
    }
}
export class RowAddedEvent extends RowsEvent {
    constructor(row) {
        super('row-added', [row]);
    }
}
export class RowUpdatedEvent extends RowsEvent {
    constructor(row) {
        super('row-updated', [row]);
    }
}
export class RowRemovedEvent extends RowsEvent {
    constructor(rows) {
        super('row-removed', rows);
    }
}
// when a row is selected, emits an array of all currently selected rows
export class RowSelectedEvent extends RowsEvent {
    constructor(rows) {
        super('row-selected', rows);
    }
}
//  MENUS
export class MenuSelectedEvent extends BubblyEvent {
    constructor(value) {
        super('menu-selection');
        this.value = value;
    }
}
export class ResizeStartEvent extends BubblyEvent {
    constructor(name) {
        super('resize-start');
        this.name = name;
    }
}
export class ResizeEndEvent extends BubblyEvent {
    constructor(name, delta) {
        super('resize-end');
        this.name = name;
        this.delta = delta;
    }
}
export class ResizeEvent extends BubblyEvent {
    constructor(name, delta) {
        super('resize');
        this.name = name;
        this.delta = delta;
    }
}
export class ChangeEvent extends BubblyEvent {
    constructor(value) {
        super('change');
        this.value = value;
    }
}
export class MenuOpenEvent extends BubblyEvent {
    constructor(close) {
        super('menuopen');
        this.close = close;
    }
}
export class CheckEvent extends BubblyEvent {
    constructor() {
        super('toggle-check');
    }
}
