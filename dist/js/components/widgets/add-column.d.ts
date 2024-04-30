import { type TemplateResult } from 'lit';
import { ClassifiedElement } from '../classified-element.js';
import '../menu/input-menu.js';
export declare class AddColumnElement extends ClassifiedElement {
    protected classMap(): {
        dark: boolean;
        'inline-block p-3.5 w-40': boolean;
        'text-xs': boolean;
        'bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50': boolean;
        'rounded-lg border border-neutral-400 dark:border-neutral-600': boolean;
    };
    static labelClasses: {
        'font-medium': boolean;
    };
    static inputClasses: {
        'focus:ring-1 focus:ring-neutral-500 focus:outline-none ': boolean;
        'px-2 py-1.5': boolean;
        'bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50': boolean;
        'placeholder-neutral-600 dark:placeholder-neutral-400': boolean;
        'rounded-md border border-neutral-400 dark:border-neutral-600 focus:dark:border-neutral-300': boolean;
    };
    static buttonClasses: {
        'bg-neutral-950 dark:bg-neutral-50 hover:bg-neutral-800 hover:dark:bg-neutral-200': boolean;
        'text-neutral-50 dark:text-neutral-950': boolean;
        'px-5 py-1.5 rounded-md': boolean;
        'disabled:bg-neutral-400 disabled:dark:bg-neutral-600': boolean;
    };
    protected columnName: string;
    protected columnType: string;
    protected errorMessage: TemplateResult<1> | undefined;
    protected onChange(event: InputEvent): void;
    protected onSubmit(event: Event): void;
    render(): TemplateResult<1>;
}
export declare class AddColumnTriggerElement extends ClassifiedElement {
    protected classMap(): {
        dark: boolean;
        'p-0.5 rounded-md cursor-pointer': boolean;
        'dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900': boolean;
        'border border-transparent active:border-neutral-200 dark:active:border-neutral-800': boolean;
    };
    render(): TemplateResult<1>;
}
//# sourceMappingURL=add-column.d.ts.map