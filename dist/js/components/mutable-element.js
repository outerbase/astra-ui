var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from 'lit/decorators.js';
import { isEqual } from 'lodash-es';
import { CellUpdateEvent } from '../lib/events.js';
import { ClassifiedElement } from './classified-element.js';
export const NUMBER_TYPES = [
    'Int',
    'Integer',
    'SmallInt',
    'BigInt',
    'Decimal',
    // 'Numeric', // API appears to deliver these as strings
    'Float',
    'Real',
    'Double Precision',
    'TinyInt',
    'MediumInt',
    'Serial',
    'BigSerial',
].map((s) => s.toLowerCase());
export const BOOLEAN_TYPES = ['Boolean', 'Bit'].map((s) => s.toLowerCase());
export const JSON_TYPES = ['JSON', 'JSONB', 'ARRAY'].map((s) => s.toLowerCase());
export class MutableElement extends ClassifiedElement {
    constructor() {
        super(...arguments);
        this._didSetInitialValue = false;
        this.constrainTypes = false;
        // the cell's row's uuid and column name
        this.position = { column: '', row: '' }; // TODO let this be undefined?
        this.readonly = false;
        this.isInteractive = false;
        this.outerBorder = false;
        // allows, for example, <astra-td separate-cells="true" />
        this.separateCells = false;
        this.blank = false;
        this.isEditing = false;
        this.hasMenu = false;
        this.isFirstColumn = false;
        this.isLastColumn = false;
    }
    static moveFocusToNextRow(target) {
        const parent = target?.parentElement;
        const index = Array.from(parent?.children ?? []).indexOf(target); // Find the index of the current element among its siblings
        const parentSibling = parent ? parent.nextElementSibling : null; // Get the parent's next sibling
        if (parentSibling && parentSibling.children.length > index) {
            var nthChild = parentSibling.children[index]; // Find the nth child of the parent's sibling
            if (nthChild) {
                nthChild.focus(); // Set focus on the nth child
            }
        }
    }
    static moveFocusToPreviousRow(target) {
        const parent = target?.parentElement;
        const index = Array.from(parent?.children ?? []).indexOf(target); // Find the index of the current element among its siblings
        const parentSibling = parent ? parent.previousElementSibling : null; // Get the parent's next sibling
        if (parentSibling && parentSibling.children.length > index) {
            var nthChild = parentSibling.children[index]; // Find the nth child of the parent's sibling
            if (nthChild) {
                nthChild.focus(); // Set focus on the nth child
            }
        }
    }
    static onKeyDown(event) {
        const self = event.currentTarget;
        // WARNING: the input's onBlur will NOT called
        if (event.code === 'Escape') {
            event.stopPropagation();
            event.preventDefault();
            // abort changes
            self.isEditing = false;
            self.focus();
        }
        if (event.code === 'Enter' && self.isEditing && event.target instanceof HTMLElement) {
            const target = event.target;
            // without this setTimeout, something sets `isEditing` back and re-renders immediately, negating the effect entirely
            setTimeout(() => {
                self.isEditing = false;
                self.focus();
                // wait until the prev commands have processed
                setTimeout(() => {
                    MutableElement.moveFocusToNextRow(target);
                }, 0);
            });
        }
        if (event.code === 'Enter' && !self.isEditing && self.readonly) {
            // we're using `contenteditable` to hold the value (when isEditing=fale)
            // if this element receives `Enter`, it'll add them to the value, erroneously
            // so we prevent that scenario right HERE.
            event.preventDefault();
        }
        if (event.code === 'Enter' && !self.isEditing && !self.readonly) {
            if (event.target instanceof HTMLElement && !self.isEditing) {
                if (!event.didCloseMenu)
                    self.isEditing = true;
            }
        }
    }
    static convertToType(type, newValue) {
        // convert strings to their proper value-types; json, boolean, number, and null
        if (type && typeof newValue === 'string') {
            if (NUMBER_TYPES.includes(type))
                return parseInt(newValue, 10);
            if (JSON_TYPES.includes(type))
                return JSON.parse(newValue);
            if (BOOLEAN_TYPES.includes(type))
                return newValue.toLowerCase().trim() === 'true';
            if (newValue === '')
                return null;
        }
        return newValue;
    }
    classMap() {
        return {
            'cursor-pointer': this.isInteractive && !this.readonly,
            ...super.classMap(),
        };
    }
    get value() {
        return this._value;
    }
    set value(newValue) {
        const oldValue = this._value;
        if (oldValue !== newValue) {
            // convert strings to their proper value-types; json, boolean, number, and null
            if (this.constrainTypes)
                this._value = MutableElement.convertToType(this.type, newValue) ?? newValue;
            else
                this._value = newValue;
            this.requestUpdate('value', oldValue);
            // don't emit change event on initial setting
            if (this._didSetInitialValue) {
                // setTimeout(this.dispatchChangedEvent.bind(this), 0) // unnecessary with the initial conditional check?
                this.dispatchChangedEvent();
            }
            // allow change event on next change
            this._didSetInitialValue = true;
        }
    }
    get originalValue() {
        return this._originalValue;
    }
    set originalValue(newValue) {
        const oldValue = this._originalValue;
        // convert strings to their proper value-types; json, boolean, number, and null
        if (this.constrainTypes)
            this._originalValue = MutableElement.convertToType(this.type, newValue) ?? newValue;
        else
            this._originalValue = newValue;
        this.requestUpdate('originalValue', oldValue);
    }
    get dirty() {
        return !isEqual(this.value, this.originalValue);
    }
    get type() {
        return this._type;
    }
    set type(newValue) {
        this._type = newValue?.toLowerCase();
    }
    updated(changedProps) {
        super.updated(changedProps);
        if (changedProps.has('isEditing') && this.isEditing) {
            // focus and select text
            const input = this.shadowRoot?.querySelector('input');
            if (input) {
                input.select();
            }
        }
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (this.constrainTypes && changedProperties.has('type')) {
            this.value = MutableElement.convertToType(this.type, this.value) ?? this._value;
            this.originalValue = MutableElement.convertToType(this.type, this.originalValue) ?? this.originalValue;
        }
    }
    dispatchChangedEvent() {
        const event = {
            position: this.position,
            previousValue: this.originalValue,
            value: this.value,
            label: this.label,
        };
        this.dispatchEvent(new CellUpdateEvent(event));
    }
    onBlur() {
        this.isEditing = false;
    }
    onChange(event) {
        const { value } = event.target;
        if (value === '')
            this.value = null;
        else
            this.value = value;
    }
}
__decorate([
    property({ attribute: 'constrain-types', type: Boolean })
], MutableElement.prototype, "constrainTypes", void 0);
__decorate([
    property({ attribute: 'value', type: String })
], MutableElement.prototype, "value", null);
__decorate([
    property({ attribute: 'original-value', type: String })
], MutableElement.prototype, "originalValue", null);
__decorate([
    property({ type: String })
], MutableElement.prototype, "dirty", null);
__decorate([
    property({ type: Object, attribute: 'position' })
], MutableElement.prototype, "position", void 0);
__decorate([
    property({ type: String })
], MutableElement.prototype, "label", void 0);
__decorate([
    property({ attribute: 'read-only', type: Boolean })
], MutableElement.prototype, "readonly", void 0);
__decorate([
    property({ type: String, attribute: 'width' })
], MutableElement.prototype, "width", void 0);
__decorate([
    property({ attribute: 'interactive', type: Boolean })
], MutableElement.prototype, "isInteractive", void 0);
__decorate([
    property({ attribute: 'outer-border', type: Boolean })
], MutableElement.prototype, "outerBorder", void 0);
__decorate([
    property({ type: Boolean, attribute: 'separate-cells' })
], MutableElement.prototype, "separateCells", void 0);
__decorate([
    property({ type: Boolean, attribute: 'blank' })
], MutableElement.prototype, "blank", void 0);
__decorate([
    property({ attribute: 'type', type: String })
], MutableElement.prototype, "type", null);
__decorate([
    property({ attribute: 'is-editing', type: Boolean })
], MutableElement.prototype, "isEditing", void 0);
__decorate([
    property({ attribute: 'menu', type: Boolean })
], MutableElement.prototype, "hasMenu", void 0);
__decorate([
    property({ attribute: 'is-first-column', type: Boolean })
], MutableElement.prototype, "isFirstColumn", void 0);
__decorate([
    property({ attribute: 'is-last-column', type: Boolean })
], MutableElement.prototype, "isLastColumn", void 0);
