var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
// import subcomponents
import { CaretRight } from '../../icons/caret-right.js';
import { ColumnHiddenEvent, ColumnPluginActivatedEvent, ColumnPluginDeactivatedEvent, ColumnRemovedEvent, ColumnRenameEvent, ColumnUpdatedEvent, } from '../../lib/events.js';
import { Theme } from '../../types.js';
import '../column-resizer-element.js';
import '../menu/column-menu.js'; // <astra-th-menu />
import { MutableElement } from '../mutable-element.js';
// tl;dr <th/>, table-cell
let TH = class TH extends MutableElement {
    constructor() {
        super(...arguments);
        this.readonly = true;
        this.withResizer = false;
        this.installedPlugins = {};
        this.options = [
            {
                label: 'Sort A-Z',
                value: 'sort:alphabetical:ascending',
            },
            {
                label: 'Sort Z-A',
                value: 'sort:alphabetical:descending',
            },
            {
                label: 'Hide Column',
                value: 'hide',
            },
            {
                label: 'Rename Column',
                value: 'rename',
            },
            {
                label: 'Delete Column',
                value: 'delete',
                classes: 'text-red-500 dark:text-red-400/90 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
            },
        ];
        this._previousWidth = 0;
        this._options = [];
        this._pluginOptions = [];
    }
    classMap() {
        return {
            ...super.classMap(),
            'table-cell relative whitespace-nowrap h-[38px]': true, // h-[38px] was added to preserve the height when toggling to <input />
            'cursor-pointer': true,
            'border-b border-theme-border dark:border-theme-border-dark': true,
            'first:border-l border-t': this.outerBorder,
            'px-cell-padding-x py-cell-padding-y': true,
            'bg-theme-column dark:bg-theme-column-dark': !this.dirty,
            'bg-theme-cell-dirty dark:bg-theme-cell-dirty-dark': this.dirty,
            'select-none': this.hasMenu, // this is really about handling SSR without hydration; TODO use a better flag?
            // prevent double borders
            'border-r': (!this.withResizer && this.isLastColumn && this.outerBorder) ||
                (!this.withResizer && this.separateCells && !this.isLastColumn),
        };
    }
    get value() {
        return this._value?.toString();
    }
    set value(newValue) {
        const oldValue = this._value;
        this._value = newValue;
        this.requestUpdate('value', oldValue);
    }
    get originalValue() {
        return this._originalValue?.toString();
    }
    set originalValue(newValue) {
        const oldValue = this._originalValue;
        this._originalValue = newValue;
        this.requestUpdate('value', oldValue);
    }
    dispatchChangedEvent() {
        if (typeof this.originalValue !== 'string')
            return;
        this.dispatchEvent(new ColumnRenameEvent({
            name: this.originalValue,
            data: { name: this.value },
        }));
    }
    onMenuSelection(event) {
        event.stopPropagation();
        let dispatchColumnUpdateEvent = false;
        const columnName = this.originalValue ?? this.value ?? '';
        // handle (potential) plugin selection
        const plugin = this.plugins?.find(({ tagName }) => event.value === tagName);
        if (plugin) {
            return this.dispatchEvent(new ColumnPluginActivatedEvent(columnName, { ...plugin, columnName }));
        }
        // look for the 'none' plugin and delete installed column plugin as a result when chosen
        if (event.value === 'uninstall-column-plugin') {
            // starboard can immediately update it's state
            // dashboard will also receive this event
            const installedPlugin = this.installedPlugins[columnName];
            if (!installedPlugin)
                throw new Error(`Attempting to uninstall a non-existent plugin on ${columnName}`);
            this.dispatchEvent(new ColumnPluginDeactivatedEvent(columnName, installedPlugin));
        }
        switch (event.value) {
            case 'hide':
                return this.hideColumn();
            case 'rename':
                return (this.isEditing = true);
            case 'delete':
                return this.removeColumn();
            case 'reset':
                this.dispatchEvent(new ColumnRenameEvent({
                    name: this.originalValue ?? '',
                    data: { value: this.value },
                }));
                return (this.value = this.originalValue ?? '');
            default:
                // intentionally let other (e.g. sorting) events pass-through to parent
                dispatchColumnUpdateEvent = true;
        }
        if (dispatchColumnUpdateEvent) {
            this.dispatchEvent(new ColumnUpdatedEvent({
                name: this.originalValue ?? this.value ?? '',
                data: { action: event.value },
            }));
        }
    }
    onContextMenu(event) {
        const menu = this.shadowRoot?.querySelector('astra-th-menu');
        if (menu) {
            event.preventDefault();
            menu.focus();
            menu.open = true;
        }
    }
    onClick(event) {
        const path = event.composedPath();
        const hasTrigger = path.some((p) => p.getAttribute?.('id') === 'trigger');
        const name = this.originalValue ?? this.value;
        const isNotResizer = !path.some((p) => p.tagName?.toLowerCase() === 'column-resizer');
        // we check for the 'trigger' which is the button inside this cell
        // if it's being clicked we don't want to interfere with it's operation / trigger sorting
        if (!hasTrigger && name && isNotResizer) {
            this.dispatchEvent(new ColumnUpdatedEvent({
                name,
                data: { action: 'sort:alphabetical:ascending' },
            }));
        }
        else {
            // ignore
        }
    }
    removeColumn() {
        if (!this.originalValue)
            throw new Error('missing OG value');
        this.dispatchEvent(new ColumnRemovedEvent({
            name: this.originalValue,
        }));
    }
    hideColumn() {
        if (!this.originalValue)
            throw new Error('missing OG value');
        this.dispatchEvent(new ColumnHiddenEvent({
            name: this.originalValue,
        }));
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('contextmenu', this.onContextMenu);
        this.addEventListener('click', this.onClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback;
        this.removeEventListener('contextmenu', this.onContextMenu);
        this.removeEventListener('click', this.onClick);
    }
    firstUpdated(_changedProperties) {
        if (this.width && this.style) {
            this.style.width = this.width;
        }
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('plugins')) {
            const withoutDefault = this.plugins?.filter((p) => !p.isDefault) ?? [];
            this._pluginOptions =
                withoutDefault.map((plugin) => ({
                    label: plugin.displayName,
                    value: plugin.tagName,
                })) ?? [];
        }
        if (changedProperties.has('width') && this.width && this.style) {
            this.style.width = this.width;
        }
        if (changedProperties.has('readonly')) {
            if (this.readonly) {
                this.options = [
                    {
                        label: 'Sort A-Z',
                        value: 'sort:alphabetical:ascending',
                    },
                    {
                        label: 'Sort Z-A',
                        value: 'sort:alphabetical:descending',
                    },
                    {
                        label: 'Hide Column',
                        value: 'hide',
                    },
                    {
                        label: 'Delete Column',
                        value: 'delete',
                        classes: 'text-red-500 dark:text-red-400/90 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
                    },
                ];
            }
            else {
                this.options = [
                    {
                        label: 'Sort A-Z',
                        value: 'sort:alphabetical:ascending',
                    },
                    {
                        label: 'Sort Z-A',
                        value: 'sort:alphabetical:descending',
                    },
                    {
                        label: 'Hide Column',
                        value: 'hide',
                    },
                    {
                        label: 'Rename Column',
                        value: 'rename',
                    },
                    {
                        label: 'Delete Column',
                        value: 'delete',
                        classes: 'text-red-500 dark:text-red-400/90 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
                    },
                ];
            }
        }
        // set id=first-cell on the first row, first column
        if (changedProperties.has('isFirstColumn') || changedProperties.has('isFirstColumn')) {
            if (this.isFirstColumn) {
                this.setAttribute('first-cell', 'true');
            }
        }
    }
    render() {
        const name = this.originalValue ?? this.value ?? '';
        const hasPlugin = typeof this.installedPlugins?.[name] !== 'undefined' && !this.installedPlugins?.[name]?.isDefaultPlugin;
        const options = this.dirty
            ? [
                ...this.options,
                {
                    label: html `Revert to <span class="pointer-events-none italic whitespace-nowrap">${this.originalValue}</span>`,
                    value: 'reset',
                },
            ]
            : [...this.options];
        if (this._pluginOptions.length > 0) {
            options.splice(2, 0, hasPlugin
                ? {
                    label: html `<span class="">Remove Plugin</span> `,
                    value: 'uninstall-column-plugin',
                }
                : {
                    label: html `<div class="flex items-center justify-between">Plugins ${CaretRight(16)}</div>`,
                    value: 'plugins',
                    options: this._pluginOptions,
                });
        }
        const blankElementClasses = {
            'absolute top-0 bottom-0 right-0 left-0': true,
            dark: this.theme == Theme.dark,
        };
        const resultContainerClasses = {
            dark: this.theme == Theme.dark,
        };
        if (this.blank) {
            // an element to preserve the right-border
            return html `<div class=${classMap(blankElementClasses)}><slot></slot></div> `;
        }
        else {
            const body = this.isEditing
                ? html `<input .value=${this.value} @input=${this.onChange} @keydown=${MutableElement.onKeyDown} class=${classMap({
                    'z-[1] absolute top-0 bottom-0 right-0 left-0': true,
                    'bg-blue-50 dark:bg-blue-950 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700': true,
                    'px-cell-padding-x font-normal': true,
                })} @blur=${this.onBlur}></input>`
                : this.hasMenu
                    ? html `<astra-th-menu theme=${this.theme} .options=${options} @menu-selection=${this.onMenuSelection}
                        ><span class="font-normal">${this.value}</span></astra-th-menu
                    >`
                    : html `<span class="font-normal">${this.value}</span>`;
            return this.withResizer
                ? html `<span class=${classMap(resultContainerClasses)}
                      ><slot></slot>
                      ${body}
                      <column-resizer
                          .column=${this}
                          height="${ifDefined(this.tableHeight)}"
                          theme=${this.theme}
                          @resize-start=${() => {
                    // remove the suffix `px` from width and convert to a number
                    // JOHNNY probably revert to storing the number??
                    this._previousWidth = this.width ? +this.width.slice(0, -2) : 0;
                }}
                          @resize=${({ delta }) => {
                    this.width = `${this._previousWidth + delta}px`;
                }}
                      ></column-resizer
                  ></span>`
                : html `<div class=${classMap(resultContainerClasses)}><slot></slot>${body}</div>`;
        }
    }
};
__decorate([
    property({ attribute: 'table-height', type: Number })
], TH.prototype, "tableHeight", void 0);
__decorate([
    property({ attribute: 'with-resizer', type: Boolean })
], TH.prototype, "withResizer", void 0);
__decorate([
    property({ attribute: 'plugins', type: Array })
], TH.prototype, "plugins", void 0);
__decorate([
    property({ attribute: 'installed-plugins', type: Object })
], TH.prototype, "installedPlugins", void 0);
__decorate([
    property({ attribute: 'options', type: Array })
], TH.prototype, "options", void 0);
__decorate([
    property({ attribute: 'value', type: String })
], TH.prototype, "value", null);
__decorate([
    property({ attribute: 'original-value', type: String })
], TH.prototype, "originalValue", null);
__decorate([
    state()
], TH.prototype, "_previousWidth", void 0);
__decorate([
    state()
], TH.prototype, "_options", void 0);
__decorate([
    state()
], TH.prototype, "_pluginOptions", void 0);
TH = __decorate([
    customElement('astra-th')
], TH);
export { TH };
