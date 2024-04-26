import type { PropertyValueMap, PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import { isEqual } from 'lodash-es'

import { CellUpdateEvent } from '../lib/events.js'
import type { Position, Serializable } from '../lib/types.js'
import { ClassifiedElement } from './classified-element.js'

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
].map((s) => s.toLowerCase())
export const BOOLEAN_TYPES = ['Boolean', 'Bit'].map((s) => s.toLowerCase())
export const JSON_TYPES = ['JSON', 'JSONB', 'ARRAY'].map((s) => s.toLowerCase())

export class MutableElement extends ClassifiedElement {
    static moveFocusToNextRow(target: HTMLElement) {
        const parent = target?.parentElement
        const index = Array.from(parent?.children ?? []).indexOf(target) // Find the index of the current element among its siblings
        const parentSibling = parent ? parent.nextElementSibling : null // Get the parent's next sibling
        if (parentSibling && parentSibling.children.length > index) {
            var nthChild = parentSibling.children[index] as HTMLElement | undefined // Find the nth child of the parent's sibling
            if (nthChild) {
                nthChild.focus() // Set focus on the nth child
            }
        }
    }

    static moveFocusToPreviousRow(target: HTMLElement) {
        const parent = target?.parentElement
        const index = Array.from(parent?.children ?? []).indexOf(target) // Find the index of the current element among its siblings
        const parentSibling = parent ? parent.previousElementSibling : null // Get the parent's next sibling
        if (parentSibling && parentSibling.children.length > index) {
            var nthChild = parentSibling.children[index] as HTMLElement | undefined // Find the nth child of the parent's sibling
            if (nthChild) {
                nthChild.focus() // Set focus on the nth child
            }
        }
    }

    static onKeyDown(event: KeyboardEvent & { didCloseMenu?: boolean }) {
        const self = event.currentTarget as MutableElement

        // WARNING: the input's onBlur will NOT called
        if (event.code === 'Escape') {
            event.stopPropagation()
            event.preventDefault()

            // abort changes
            self.isEditing = false
            self.focus()
        }

        if (event.code === 'Enter' && self.isEditing && event.target instanceof HTMLElement) {
            const target = event.target

            // without this setTimeout, something sets `isEditing` back and re-renders immediately, negating the effect entirely
            setTimeout(() => {
                self.isEditing = false
                self.focus()

                // wait until the prev commands have processed
                setTimeout(() => {
                    MutableElement.moveFocusToNextRow(target)
                }, 0)
            })
        }

        if (event.code === 'Enter' && !self.isEditing && self.readonly) {
            // we're using `contenteditable` to hold the value (when isEditing=fale)
            // if this element receives `Enter`, it'll add them to the value, erroneously
            // so we prevent that scenario right HERE.
            event.preventDefault()
        }

        if (event.code === 'Enter' && !self.isEditing && !self.readonly) {
            if (event.target instanceof HTMLElement && !self.isEditing) {
                if (!event.didCloseMenu) self.isEditing = true
            }
        }
    }

    static convertToType(type: string | undefined, newValue: Serializable) {
        // convert strings to their proper value-types; json, boolean, number, and null

        if (type && typeof newValue === 'string') {
            if (NUMBER_TYPES.includes(type)) return parseInt(newValue, 10)
            if (JSON_TYPES.includes(type)) return JSON.parse(newValue)
            if (BOOLEAN_TYPES.includes(type)) return newValue.toLowerCase().trim() === 'true'
            if (newValue === '') return null
        }

        return newValue
    }

    protected override classMap() {
        return {
            'cursor-pointer': this.isInteractive && !this.readonly,
            ...super.classMap(),
        }
    }

    private _didSetInitialValue = false

    @property({ attribute: 'constrain-types', type: Boolean })
    public constrainTypes = false

    // current value
    protected _value?: Serializable
    @property({ attribute: 'value', type: String })
    get value(): Serializable {
        return this._value
    }

    set value(newValue: Serializable) {
        const oldValue = this._value

        if (oldValue !== newValue) {
            // convert strings to their proper value-types; json, boolean, number, and null
            if (this.constrainTypes) this._value = MutableElement.convertToType(this.type, newValue) ?? newValue
            else this._value = newValue

            this.requestUpdate('value', oldValue)

            // don't emit change event on initial setting
            if (this._didSetInitialValue) {
                // setTimeout(this.dispatchChangedEvent.bind(this), 0) // unnecessary with the initial conditional check?
                this.dispatchChangedEvent()
            }

            // allow change event on next change
            this._didSetInitialValue = true
        }
    }

    protected _originalValue?: Serializable
    @property({ attribute: 'original-value', type: String })
    get originalValue(): Serializable {
        return this._originalValue
    }

    set originalValue(newValue: Serializable) {
        const oldValue = this._originalValue
        // convert strings to their proper value-types; json, boolean, number, and null
        if (this.constrainTypes) this._originalValue = MutableElement.convertToType(this.type, newValue) ?? newValue
        else this._originalValue = newValue
        this.requestUpdate('originalValue', oldValue)
    }

    @property({ type: String })
    public get dirty() {
        return !isEqual(this.value, this.originalValue)
    }

    // the cell's row's uuid and column name
    @property({ type: Object, attribute: 'position' })
    public position: Position = { column: '', row: '' } // TODO let this be undefined?

    @property({ type: String })
    public label?: string

    @property({ attribute: 'read-only', type: Boolean })
    public readonly = false

    @property({ type: String, attribute: 'width' })
    public width?: string

    @property({ attribute: 'interactive', type: Boolean })
    public isInteractive = false

    @property({ attribute: 'outer-border', type: Boolean })
    public outerBorder = false

    // allows, for example, <outerbase-td separate-cells="true" />
    @property({ type: Boolean, attribute: 'separate-cells' })
    public separateCells: boolean = false

    @property({ type: Boolean, attribute: 'blank' })
    public blank = false

    private _type?: string
    @property({ attribute: 'type', type: String })
    public get type(): string | undefined {
        return this._type
    }
    public set type(newValue: string) {
        this._type = newValue?.toLowerCase()
    }

    @property({ attribute: 'is-editing', type: Boolean })
    public isEditing = false

    @property({ attribute: 'menu', type: Boolean })
    public hasMenu = false

    @property({ attribute: 'is-first-column', type: Boolean })
    public isFirstColumn = false

    @property({ attribute: 'is-last-column', type: Boolean })
    public isLastColumn = false

    public override updated(changedProps: PropertyValues<this>) {
        super.updated(changedProps)

        if (changedProps.has('isEditing') && this.isEditing) {
            // focus and select text
            const input = this.shadowRoot?.querySelector('input')
            if (input) {
                input.select()
            }
        }
    }

    public override willUpdate(changedProperties: PropertyValueMap<this>): void {
        super.willUpdate(changedProperties)

        if (this.constrainTypes && changedProperties.has('type')) {
            this.value = MutableElement.convertToType(this.type, this.value) ?? this._value
            this.originalValue = MutableElement.convertToType(this.type, this.originalValue) ?? this.originalValue
        }
    }

    protected dispatchChangedEvent() {
        const event = {
            position: this.position,
            previousValue: this.originalValue,
            value: this.value,
            label: this.label,
        }

        this.dispatchEvent(new CellUpdateEvent(event))
    }

    protected onBlur() {
        this.isEditing = false
    }

    protected onChange(event: Event) {
        const { value } = event.target as HTMLInputElement
        if (value === '') this.value = null
        else this.value = value
    }
}
