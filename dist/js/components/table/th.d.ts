import { type PropertyValueMap } from 'lit';
import { MenuSelectedEvent } from '../../lib/events.js';
import type { ColumnPlugin, HeaderMenuOptions, PluginWorkspaceInstallationId } from '../../types.js';
import '../column-resizer-element.js';
import '../menu/column-menu.js';
import { MutableElement } from '../mutable-element.js';
export declare class TH extends MutableElement {
    protected classMap(): {
        'table-cell relative whitespace-nowrap h-[38px]': boolean;
        'cursor-pointer': boolean;
        'border-b border-theme-border dark:border-theme-border-dark': boolean;
        'first:border-l border-t': boolean;
        'px-cell-padding-x py-cell-padding-y': boolean;
        'bg-theme-column dark:bg-theme-column-dark': boolean;
        'bg-theme-cell-dirty dark:bg-theme-cell-dirty-dark': boolean;
        'select-none': boolean;
        'border-r': boolean;
        dark: boolean;
    };
    readonly: boolean;
    tableHeight?: number;
    withResizer: boolean;
    plugins?: Array<ColumnPlugin>;
    installedPlugins: Record<string, PluginWorkspaceInstallationId | undefined>;
    options: HeaderMenuOptions;
    get value(): string | undefined;
    set value(newValue: string);
    get originalValue(): string | undefined;
    set originalValue(newValue: string);
    private _previousWidth;
    protected _options: HeaderMenuOptions;
    protected _pluginOptions: HeaderMenuOptions;
    protected dispatchChangedEvent(): void;
    protected onMenuSelection(event: MenuSelectedEvent): string | boolean | void;
    protected onContextMenu(event: MouseEvent): void;
    protected onClick(event: MouseEvent): void;
    removeColumn(): void;
    hideColumn(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(_changedProperties: PropertyValueMap<this>): void;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=th.d.ts.map