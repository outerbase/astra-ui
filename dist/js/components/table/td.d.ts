import { type PropertyValueMap, type TemplateResult } from 'lit';
import { type MenuSelectedEvent } from '../../lib/events.js';
import { PluginEvent, type ColumnPlugin, type Serializable } from '../../types.js';
import { MutableElement } from '../mutable-element.js';
import '../menu/cell-menu.js';
type PluginActionEvent = CustomEvent<{
    action: PluginEvent.onEdit | PluginEvent.onStopEdit | PluginEvent.onCancelEdit;
    value: any;
}>;
export declare class TableData extends MutableElement {
    static styles: import("lit").CSSResult[];
    static onClick(event: MouseEvent): void;
    static onContextMenu(event: MouseEvent): void;
    static onContentEditableKeyDown(event: KeyboardEvent): void;
    static onDragOver(event: DragEvent): void;
    static onDrop(event: DragEvent): void;
    static onDoubleClick(event: MouseEvent): void;
    static copyValueToClipboard(value: Serializable): Promise<void>;
    static onKeyDown(event: KeyboardEvent): Promise<void>;
    static onPaste(event: ClipboardEvent): void;
    protected classMap(): {
        'table-cell relative focus:z-[1]': boolean;
        'px-cell-padding-x py-cell-padding-y ': boolean;
        'px-5': boolean;
        'border-theme-border dark:border-theme-border-dark': boolean;
        'bg-theme-cell dark:bg-theme-cell-dark text-theme-cell-text dark:text-theme-cell-text-dark': boolean;
        'bg-theme-cell-dirty dark:bg-theme-cell-dirty-dark': boolean;
        'group-hover:bg-theme-row-hover dark:group-hover:bg-theme-row-hover-dark': boolean;
        'focus:shadow-ringlet dark:focus:shadow-ringlet-dark focus:rounded-[4px] focus:ring-1 focus:ring-black dark:focus:ring-neutral-300 focus:outline-none': boolean;
        'border-r': boolean;
        'first:border-l': boolean;
        'border-b': boolean;
        dark: boolean;
        'cursor-pointer': boolean;
    };
    pluginAttributes: String;
    withBottomBorder: boolean;
    isOdd?: boolean;
    _drawRightBorder: boolean;
    isRowSelector: boolean;
    row: undefined;
    column: undefined;
    hideDirt: boolean;
    plugin?: ColumnPlugin;
    isDisplayingPluginEditor: boolean;
    isFirstRow: boolean;
    protected options: {
        label: string;
        value: string;
    }[];
    private _interstitialValue;
    constructor();
    protected onDisplayEditor(event: MouseEvent): void;
    protected onPluginChangeEvent({ detail: { action, value } }: PluginActionEvent): void;
    protected onMenuSelection(event: MenuSelectedEvent): Promise<true | void>;
    focus(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
    render(): TemplateResult<1>;
}
export {};
//# sourceMappingURL=td.d.ts.map