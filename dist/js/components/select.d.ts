import { LitElement } from 'lit';
export default class AstraSelect extends LitElement {
    static styles: import("lit").CSSResult[];
    ariaExpanded: string;
    placeholder: string;
    value: string;
    options: Array<{
        label: any;
        value: any;
    }>;
    disabled: boolean;
    protected isOpen: boolean;
    protected optionsListElement: HTMLElement;
    protected shouldDisplayOptions(isOpen: boolean): void;
    protected onClickOutside(event: MouseEvent): void;
    protected onClickInside(_event?: MouseEvent): void;
    onKeyDown(event: KeyboardEvent): void;
    protected renderOption(text: string, value: string): import("lit").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    constructor();
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=select.d.ts.map