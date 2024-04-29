import { LitElement, type PropertyValueMap } from 'lit';
import { Theme } from '../types.js';
export declare class ClassifiedElement extends LitElement {
    static styles: import("lit").CSSResult[];
    protected classMap(): {
        dark: boolean;
    };
    theme: Theme;
    _class: string;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=classified-element.d.ts.map