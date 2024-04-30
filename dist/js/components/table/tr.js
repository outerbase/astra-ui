var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from 'lit/decorators.js';
import { ClassifiedElement } from '../classified-element.js';
// tl;dr <tr/>, table-row
let TableRow = class TableRow extends ClassifiedElement {
    constructor() {
        super(...arguments);
        this.selected = false;
        this.isHeaderRow = false;
        this.new = false;
    }
    classMap() {
        return {
            'table-row group': true,
            // 'hover:bg-theme-row-hover dark:hover:bg-theme-row-hover-dark': true,
            // when a header
            'text-theme-column-text dark:text-theme-column-text-dark': this.isHeaderRow,
            // when new, not selected
            'bg-theme-row-new dark:bg-theme-row-new-dark': this.new && !this.selected,
            // not selected, not new, not a header
            'odd:bg-theme-row-odd dark:odd:bg-theme-row-odd-dark even:bg-theme-row-even dark:even:bg-theme-row-even-dark': !this.new && !this.isHeaderRow && !this.selected,
            // when selected
            'bg-theme-row-selected dark:bg-theme-row-selected-dark hover:bg-theme-row-selected-hover dark:hover:bg-theme-row-selected-hover-dark': this.selected && !this.isHeaderRow,
            ...super.classMap(),
        };
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        // dispatch event when row is selected/unselected
        if (changedProperties.has('selected') && changedProperties.get('selected') !== undefined)
            this.dispatchEvent(new Event('on-selection'));
    }
};
__decorate([
    property({ type: Boolean, attribute: 'selected' })
], TableRow.prototype, "selected", void 0);
__decorate([
    property({ type: Boolean, attribute: 'header', reflect: true })
], TableRow.prototype, "isHeaderRow", void 0);
__decorate([
    property({ type: Boolean, attribute: 'new' })
], TableRow.prototype, "new", void 0);
TableRow = __decorate([
    customElement('astra-tr')
], TableRow);
export { TableRow };
