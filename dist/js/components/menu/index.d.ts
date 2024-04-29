import { type PropertyValueMap } from 'lit';
import { type HeaderMenuOptions } from '../../types.js';
import { ClassifiedElement } from '../classified-element.js';
export declare class Menu extends ClassifiedElement {
    protected classMap(): {
        dark: boolean;
        'flex items-center justify-between gap-2': boolean;
        'font-medium select-none whitespace-nowrap': boolean;
    };
    open: boolean;
    selection?: string;
    options: HeaderMenuOptions;
    withoutPadding: boolean;
    protected activeOptions: HeaderMenuOptions;
    protected historyStack: Array<HeaderMenuOptions>;
    protected focused?: string;
    protected get menuPositionClasses(): string;
    private outsideClicker;
    private activeEvent;
    private close;
    protected get listElement(): import("lit").TemplateResult<1> | null;
    protected onTrigger(event: Event): void;
    protected onItemClick(event: MouseEvent): void;
    protected onSelection(event: Event, value: string): void;
    protected onKeyDown(event: KeyboardEvent & {
        didCloseMenu: boolean;
    }): void;
    focus(): void;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
    updated(changedProperties: PropertyValueMap<this>): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=index.d.ts.map