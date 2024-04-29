var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TableData_1;
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { eventTargetIsPlugin, eventTargetIsPluginEditor } from '../../lib/event-target-is-plugin.js';
import { PluginEvent, Theme } from '../../types.js';
import { JSON_TYPES, MutableElement } from '../mutable-element.js';
import '../menu/cell-menu.js'; // <astra-td-menu />
const isAlphanumericOrSpecial = (key) => {
    // Regular expression to match alphanumeric characters and specified special characters
    return /^[a-zA-Z0-9 \.,]+$/.test(key);
};
const RW_OPTIONS = [
    { label: 'Edit', value: 'edit' },
    { label: 'Copy', value: 'copy' },
    { label: 'Paste', value: 'paste' },
    { label: 'Clear', value: 'clear' },
];
const R_OPTIONS = [{ label: 'Copy', value: 'copy' }];
// tl;dr <td/>, table-cell
let TableData = TableData_1 = class TableData extends MutableElement {
    static onClick(event) {
        const el = event.currentTarget; //as HTMLElement
        if (el instanceof TableData_1 && !el.isDisplayingPluginEditor) {
            // only focus on click when NOT displaying a plugin's editor
            el.focus();
        }
    }
    static onContextMenu(event) {
        const isPluginEditor = eventTargetIsPluginEditor(event);
        if (isPluginEditor)
            return;
        const menu = event.currentTarget.shadowRoot?.querySelector('astra-td-menu');
        if (menu) {
            event.preventDefault();
            menu.focus();
            menu.open = true;
        }
    }
    static onContentEditableKeyDown(event) {
        // our goal here is to prevent the user from engaging with the `contenteditable` component
        const didNotOriginateInsidePluginEditor = event.composedPath().every((v) => {
            return v instanceof HTMLElement && v.id !== 'plugin-editor';
        });
        if (didNotOriginateInsidePluginEditor)
            event.preventDefault();
    }
    static onDragOver(event) {
        event.preventDefault();
    }
    static onDrop(event) {
        event.preventDefault();
    }
    static onDoubleClick(event) {
        const self = event.currentTarget;
        if (self.isEditing)
            return; // allow double-clicking to select text while editing
        if (!eventTargetIsPlugin(event)) {
            self.isEditing = true;
            setTimeout(() => {
                const input = self.shadowRoot?.querySelector('input');
                if (input) {
                    input.focus();
                    // set cursor to end if writable
                    if (!self.readonly)
                        input.setSelectionRange(input.value.length, input.value.length);
                }
            }, 0);
        }
    }
    static copyValueToClipboard(value) {
        if (value === null || value === undefined)
            return navigator.clipboard.writeText('');
        else if (typeof value === 'object')
            return navigator.clipboard.writeText(JSON.stringify(value));
        else
            return navigator.clipboard.writeText(value.toString());
    }
    static async onKeyDown(event) {
        // ignore events being fired from a Plugin
        if (eventTargetIsPlugin(event))
            return;
        const self = event.currentTarget;
        // don't interfere with menu behavior
        const menu = self.shadowRoot?.querySelector('astra-td-menu');
        if (menu?.open) {
            return;
        }
        if (self.plugin && event.code === 'Enter' && event.target instanceof HTMLElement) {
            MutableElement.moveFocusToNextRow(event.target);
            return;
        }
        MutableElement.onKeyDown(event);
        // ignore events fired while editing
        if (self.isEditing)
            return;
        const { code } = event;
        let target = event.target;
        if (!(target instanceof HTMLElement))
            return;
        // handle events from a <check-box />
        if (target.tagName.toLowerCase() === 'check-box') {
            const parent = target.parentElement?.parentElement?.parentElement;
            if (code === 'ArrowDown') {
                event.preventDefault();
                parent?.nextElementSibling?.querySelector('check-box')?.focus();
            }
            else if (code === 'ArrowUp') {
                event.preventDefault();
                parent?.previousElementSibling?.querySelector('check-box')?.focus();
            }
            else if (code === 'ArrowRight') {
                event.preventDefault();
                target.parentElement?.parentElement?.nextElementSibling?.focus();
            }
            return;
        }
        // begin editing if keys are ASCII-ish
        const isInputTriggering = event.key.length === 1 && isAlphanumericOrSpecial(event.key);
        const noMetaKeys = !(event.metaKey || event.shiftKey);
        const typeIsNotJSON = !(self.type && JSON_TYPES.includes(self.type));
        if (isInputTriggering && noMetaKeys && typeIsNotJSON) {
            event.preventDefault();
            // toggle editing mode
            self.isEditing = true;
            // append this character
            if (self.value === undefined || self.value === null)
                self.value = event.key;
            else
                self.value += event.key;
            // set the cursor input to the end
            setTimeout(() => {
                const input = self.shadowRoot?.querySelector('input');
                input?.focus();
                input?.setSelectionRange(input.value.length, input.value.length);
            }, 0);
        }
        // navigating around the table
        if (code === 'ArrowRight') {
            event.preventDefault();
            target?.nextElementSibling?.focus();
            return;
        }
        else if (code === 'ArrowLeft') {
            event.preventDefault();
            const checkbox = target?.previousElementSibling?.querySelector('check-box');
            if (checkbox)
                checkbox.focus();
            else
                target?.previousElementSibling?.focus();
            return;
        }
        else if (code === 'ArrowDown') {
            event.preventDefault();
            if (event.target instanceof HTMLElement && !self.isEditing) {
                MutableElement.moveFocusToNextRow(event.target);
                return;
            }
        }
        else if (code === 'ArrowUp') {
            event.preventDefault();
            if (event.target instanceof HTMLElement && !self.isEditing) {
                MutableElement.moveFocusToPreviousRow(event.target);
                return;
            }
        }
        // copy focused cells
        if (event.metaKey && code === 'KeyC') {
            event.preventDefault();
            return TableData_1.copyValueToClipboard(self.value);
        }
        if (!self.readonly && (code === 'Backspace' || code === 'Delete')) {
            event.preventDefault();
            self.value = null;
            return;
        }
    }
    static onPaste(event) {
        const td = event.composedPath().find((t) => {
            const el = t;
            if (el.tagName?.toLowerCase() === 'astra-td')
                return true;
        });
        if (td) {
            event.preventDefault();
            td.value = event.clipboardData?.getData('text');
        }
    }
    classMap() {
        return {
            ...super.classMap(),
            'table-cell relative focus:z-[1]': true,
            'px-cell-padding-x py-cell-padding-y ': !this.plugin && !this.blank,
            'px-5': this.blank,
            'border-theme-border dark:border-theme-border-dark': true,
            'bg-theme-cell dark:bg-theme-cell-dark text-theme-cell-text dark:text-theme-cell-text-dark': true,
            'bg-theme-cell-dirty dark:bg-theme-cell-dirty-dark': this.dirty && !this.hideDirt, // dirty cells
            'group-hover:bg-theme-row-hover dark:group-hover:bg-theme-row-hover-dark': !this.dirty || this.hideDirt,
            'focus:shadow-ringlet dark:focus:shadow-ringlet-dark focus:rounded-[4px] focus:ring-1 focus:ring-black dark:focus:ring-neutral-300 focus:outline-none': !this.isEditing && this.isInteractive,
            'border-r': this.isInteractive ||
                (this._drawRightBorder && this.separateCells && this.isLastColumn && this.outerBorder) || // include last column when outerBorder
                (this._drawRightBorder && this.separateCells && !this.isLastColumn), // internal cell walls
            'first:border-l': this.separateCells && this.outerBorder, // left/right borders when the `separate-cells` attribute is set
            'border-b': this.withBottomBorder, // bottom border when the `with-bottom-border` attribute is set
        };
    }
    constructor() {
        super();
        this.pluginAttributes = '';
        // allows, for example, <astra-td bottom-border="true" />
        this.withBottomBorder = false;
        this._drawRightBorder = false;
        this.isRowSelector = false;
        this.row = undefined;
        this.column = undefined;
        this.hideDirt = false;
        this.isDisplayingPluginEditor = false;
        this.isFirstRow = false;
        // @property({ attribute: 'is-last-row', type: Boolean })
        // public isLastRow = false
        this.options = RW_OPTIONS;
        this.onDisplayEditor = this.onDisplayEditor.bind(this);
        this.onPluginChangeEvent = this.onPluginChangeEvent.bind(this);
        this.onMenuSelection = this.onMenuSelection.bind(this);
        this.focus = this.focus.bind(this);
    }
    onDisplayEditor(event) {
        const path = event.composedPath();
        const didClickInsidePluginEditor = path.some((v) => {
            return v instanceof HTMLElement && v.id === 'plugin-editor';
        });
        if (!didClickInsidePluginEditor) {
            this.isDisplayingPluginEditor = false;
        }
    }
    onPluginChangeEvent({ detail: { action, value } }) {
        // TODO not `.toLowerCase()`? update the enum to match what is emitted?
        const eventName = action.toLowerCase();
        if (eventName === PluginEvent.onEdit) {
            this.isDisplayingPluginEditor = true;
        }
        else if (eventName === PluginEvent.onStopEdit) {
            this.isDisplayingPluginEditor = false;
            // TODO update our value to match the one from the editor
        }
        else if (eventName === PluginEvent.onCancelEdit) {
            this.isDisplayingPluginEditor = false;
        }
        else if (eventName === PluginEvent.updateCell) {
            this._interstitialValue = value;
        }
    }
    async onMenuSelection(event) {
        switch (event.value) {
            case 'edit':
                return (this.isEditing = true);
            case 'copy':
                return TableData_1.copyValueToClipboard(this.value);
            case 'paste':
                this.value = await navigator.clipboard.readText();
                this.dispatchChangedEvent();
                return;
            case 'clear':
                this.value = null;
                this.dispatchChangedEvent();
                return;
            case 'reset':
                this.value = this.originalValue;
                this.dispatchChangedEvent();
                return;
        }
    }
    focus() {
        this.shadowRoot?.querySelector('[contenteditable]')?.focus();
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('contextmenu', TableData_1.onContextMenu);
        this.addEventListener('keydown', TableData_1.onKeyDown);
        this.addEventListener('click', TableData_1.onClick);
        // @ts-ignore insists on `Event` instead of `PluginActionEvent`
        this.addEventListener('custom-change', this.onPluginChangeEvent); // deprecated?
        // @ts-ignore insists on `Event` instead of `PluginActionEvent`
        this.addEventListener('plugin-change', this.onPluginChangeEvent);
        if (this.isInteractive && !this.plugin) {
            this.addEventListener('dblclick', TableData_1.onDoubleClick);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('contextmenu', TableData_1.onContextMenu);
        this.removeEventListener('keydown', TableData_1.onKeyDown);
        this.removeEventListener('click', TableData_1.onClick);
        this.removeEventListener('dblclick', TableData_1.onDoubleClick);
        // @ts-ignore insists on `Event` instead of `PluginActionEvent`
        this.removeEventListener('plugin-change', this.onPluginChangeEvent);
        // @ts-ignore insists on `Event` instead of `PluginActionEvent`
        this.removeEventListener('custom-change', this.onPluginChangeEvent); // deprecated?
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('isDisplayingPluginEditor')) {
            if (typeof document === 'undefined')
                return;
            if (this.isDisplayingPluginEditor) {
                // setTimeout is necessary or else it receives the current click event (?!)
                setTimeout(() => {
                    document.addEventListener('click', this.onDisplayEditor);
                }, 0);
            }
            else {
                document.removeEventListener('click', this.onDisplayEditor);
            }
        }
        if (!changedProperties.has('isDisplayingPluginEditor') && this.isDisplayingPluginEditor) {
            // when a plugin editor IS displayed and it is NOT being removed
            return;
        }
        else if (changedProperties.has('isDisplayingPluginEditor') && !this.isDisplayingPluginEditor && this._interstitialValue) {
            // when a plugin editor WAS displaying and set an intersititial value
            // we "commit" it to our `value` when the editor is dismissed
            this.value = this._interstitialValue;
            delete this._interstitialValue;
        }
        if (changedProperties.has('readonly')) {
            if (this.readonly) {
                this.options = R_OPTIONS;
            }
            else {
                this.options = RW_OPTIONS;
            }
        }
        // set id=first-cell on the first row, first column
        if (changedProperties.has('isFirstRow') || changedProperties.has('isFirstColumn')) {
            if (this.isFirstColumn && this.isFirstRow) {
                this.setAttribute('first-cell', 'true');
            }
            else {
                this.removeAttribute('first-cell');
            }
        }
    }
    render() {
        const value = this.value === null ? null : typeof this.value === 'object' ? JSON.stringify(this.value) : this.value;
        const editorValue = this.value === null ? null : typeof this.value === 'object' ? JSON.stringify(this.value, null, 2) : this.value;
        const contentWrapperClass = classMap({ 'font-normal': true, dark: this.theme == Theme.dark });
        let cellContents;
        let cellEditorContents;
        if (this.plugin) {
            const { config, tagName } = this.plugin;
            const pluginAsString = unsafeHTML(`<${tagName} cellvalue='${value}' configuration='${config}' ${this.pluginAttributes}></${tagName}>`);
            cellContents = html `${pluginAsString}`;
            if (this.isDisplayingPluginEditor) {
                cellEditorContents = unsafeHTML(`<${tagName.replace('astra-plugin-cell', 'astra-plugin-editor')} cellvalue='${editorValue}' configuration='${config}' ${this.pluginAttributes}></${tagName}>`);
            }
        }
        else {
            cellContents = html `${html `<span class="nbsp">${value}</span>` ??
                html `<span class="italic text-neutral-400 dark:text-neutral-500">NULL</span>`}`;
        }
        const inputEl = this.isEditing // &nbsp; prevents the row from collapsing (in height) when there is only 1 column
            ? html `<span class=${contentWrapperClass}>&nbsp;<input .value=${value ?? ''}
                ?readonly=${this.readonly}
                @input=${this.onChange}
                class=${classMap({
                'z-[2] absolute top-0 bottom-0 right-0 left-0': true,
                'bg-blue-50 dark:bg-blue-950 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700': true,
                'px-3 font-normal focus:rounded-[4px]': true,
            })} @blur=${this.onBlur}></input></span>`
            : html ``;
        const emptySlot = this.blank ? html `<slot></slot>` : html ``;
        const menuOptions = this.dirty
            ? [
                ...this.options,
                {
                    label: typeof this.originalValue === 'object'
                        ? 'Revert'
                        : html `Revert to
                    <span class="pointer-events-none italic whitespace-nowrap"
                      >${this.originalValue !== null || this.originalValue !== undefined ? this.originalValue : 'NULL'}</span
                    >`,
                    value: 'reset',
                },
            ]
            : this.options;
        // note: contenteditable is all so we can get the `paste` event that an arbitrary htmleelement does not otherwise receive
        const menuEl = !this.isEditing && !this.blank
            ? html `<span
            class="outline-none caret-transparent"
            contenteditable="true"
            spellcheck="false"
            autocorrect="off"
            @paste=${TableData_1.onPaste}
            @keydown=${TableData_1.onContentEditableKeyDown}
            @dragover=${TableData_1.onDragOver}
            @drop=${TableData_1.onDrop}
            ><astra-td-menu
              theme=${this.theme}
              .options=${menuOptions}
              ?without-padding=${!!this.plugin}
              ?selectable-text=${!this.isInteractive}
              @menu-selection=${this.onMenuSelection}
              ><span class=${contentWrapperClass}>${cellContents}</span
              ><span id="plugin-editor" class="absolute top-8 caret-current cursor-auto">${cellEditorContents}</span></astra-td-menu
            ></span
          >`
            : html ``;
        return this.isEditing ? inputEl : this.blank ? emptySlot : menuEl;
    }
};
TableData.styles = [
    ...MutableElement.styles,
    css `
      .nbsp::after {
        content: '.'; /* Non-breaking space */
        visibility: hidden;
      }
    `,
];
__decorate([
    property({ attribute: 'plugin-attributes', type: String })
], TableData.prototype, "pluginAttributes", void 0);
__decorate([
    property({ type: Boolean, attribute: 'bottom-border' })
], TableData.prototype, "withBottomBorder", void 0);
__decorate([
    property({ type: Boolean, attribute: 'odd' })
], TableData.prototype, "isOdd", void 0);
__decorate([
    property({ type: Boolean, attribute: 'draw-right-border' })
], TableData.prototype, "_drawRightBorder", void 0);
__decorate([
    property({ type: Boolean, attribute: 'row-selector' })
], TableData.prototype, "isRowSelector", void 0);
__decorate([
    property({ attribute: 'row', type: Number })
], TableData.prototype, "row", void 0);
__decorate([
    property({ attribute: 'column', type: Number })
], TableData.prototype, "column", void 0);
__decorate([
    property({ attribute: 'hide-dirt', type: Boolean })
], TableData.prototype, "hideDirt", void 0);
__decorate([
    property({ attribute: 'plugin', type: String })
], TableData.prototype, "plugin", void 0);
__decorate([
    property({ attribute: 'is-displaying-plugin-editor', type: Boolean })
], TableData.prototype, "isDisplayingPluginEditor", void 0);
__decorate([
    property({ attribute: 'is-first-row', type: Boolean })
], TableData.prototype, "isFirstRow", void 0);
__decorate([
    state()
], TableData.prototype, "options", void 0);
TableData = TableData_1 = __decorate([
    customElement('astra-td')
], TableData);
export { TableData };
