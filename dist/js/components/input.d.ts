import { LitElement } from 'lit';
export default class AstraInput extends LitElement {
    static styles: import("lit").CSSResult[];
    placeholder: string;
    value: string;
    label?: string;
    onInput(event: Event): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=input.d.ts.map