import { type PropertyValueMap } from 'lit';
import { ClassifiedElement } from './classified-element.js';
import type { TH } from './table/th.js';
export declare class ColumnResizer extends ClassifiedElement {
    height?: number;
    column?: TH;
    private xPosition?;
    private width?;
    private onMouseDown;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=column-resizer-element.d.ts.map