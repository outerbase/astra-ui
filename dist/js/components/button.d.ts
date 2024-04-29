import { LitElement } from 'lit';
declare enum Variant {
    primary = "primary",
    secondary = "secondary",
    transparent = "transparent"
}
declare enum Size {
    base = "base",
    small = "small",
    compact = "compact"
}
declare enum Shape {
    default = "default",
    square = "square",
    circle = "circle"
}
export default class AstraButton extends LitElement {
    static styles: import("lit").CSSResult[];
    disabled: boolean;
    size: Size;
    shape: Shape;
    variant: Variant;
    constructor();
    onKeyDown(event: KeyboardEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=button.d.ts.map