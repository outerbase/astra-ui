import type { PropertyValueMap } from 'lit';
import { ClassifiedElement } from '../classified-element.js';
export declare class TableRow extends ClassifiedElement {
    protected classMap(): {
        dark: boolean;
        'table-row group': boolean;
        'text-theme-column-text dark:text-theme-column-text-dark': boolean;
        'bg-theme-row-new dark:bg-theme-row-new-dark': boolean;
        'odd:bg-theme-row-odd dark:odd:bg-theme-row-odd-dark even:bg-theme-row-even dark:even:bg-theme-row-even-dark': boolean;
        'bg-theme-row-selected dark:bg-theme-row-selected-dark hover:bg-theme-row-selected-hover dark:hover:bg-theme-row-selected-hover-dark': boolean;
    };
    selected: boolean;
    isHeaderRow: boolean;
    new: boolean;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
}
//# sourceMappingURL=tr.d.ts.map