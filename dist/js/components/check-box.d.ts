import { LitElement } from 'lit';
import { Theme } from '../types.js';
export declare class CustomCheckbox extends LitElement {
    static styles: import("lit").CSSResult;
    static checkedTemplate: import("lit").TemplateResult<1>;
    static uncheckedTemplate: import("lit").TemplateResult<1>;
    checked: boolean;
    theme: Theme;
    toggleCheckbox(event: Event): void;
    tabIndex: number;
    onKeyDown(event: KeyboardEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _class: string;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=check-box.d.ts.map