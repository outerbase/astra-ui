import { LitElement } from 'lit';
declare enum Size {
    base = "base",
    small = "small",
    compact = "compact"
}
export default class AstraCard extends LitElement {
    static styles: import("lit").CSSResult[];
    size: Size;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=card.d.ts.map