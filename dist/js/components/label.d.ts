import { LitElement } from 'lit';
declare enum LabelVariant {
    unspecified = "",
    label = "label",
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4"
}
export default class AstraLabel extends LitElement {
    static styles: import("lit").CSSResult[];
    variant: LabelVariant;
    render(): import("lit").TemplateResult<1>;
}
export {};
//# sourceMappingURL=label.d.ts.map