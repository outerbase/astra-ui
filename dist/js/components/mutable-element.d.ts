import type { PropertyValueMap, PropertyValues } from 'lit';
import type { Position, Serializable } from '../types.js';
import { ClassifiedElement } from './classified-element.js';
export declare const NUMBER_TYPES: string[];
export declare const BOOLEAN_TYPES: string[];
export declare const JSON_TYPES: string[];
export declare class MutableElement extends ClassifiedElement {
    static moveFocusToNextRow(target: HTMLElement): void;
    static moveFocusToPreviousRow(target: HTMLElement): void;
    static onKeyDown(event: KeyboardEvent & {
        didCloseMenu?: boolean;
    }): void;
    static convertToType(type: string | undefined, newValue: Serializable): any;
    protected classMap(): {
        dark: boolean;
        'cursor-pointer': boolean;
    };
    private _didSetInitialValue;
    constrainTypes: boolean;
    protected _value?: Serializable;
    get value(): Serializable;
    set value(newValue: Serializable);
    protected _originalValue?: Serializable;
    get originalValue(): Serializable;
    set originalValue(newValue: Serializable);
    get dirty(): boolean;
    position: Position;
    label?: string;
    readonly: boolean;
    width?: string;
    isInteractive: boolean;
    outerBorder: boolean;
    separateCells: boolean;
    blank: boolean;
    private _type?;
    get type(): string | undefined;
    set type(newValue: string);
    isEditing: boolean;
    hasMenu: boolean;
    isFirstColumn: boolean;
    isLastColumn: boolean;
    updated(changedProps: PropertyValues<this>): void;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
    protected dispatchChangedEvent(): void;
    protected onBlur(): void;
    protected onChange(event: Event): void;
}
//# sourceMappingURL=mutable-element.d.ts.map