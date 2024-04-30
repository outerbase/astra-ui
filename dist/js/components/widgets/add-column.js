// https://www.figma.com/file/9jKTBFtr4oSWHsTNTEydcC/Action-Bar-Update?type=design&node-id=17-93528&mode=design&t=7DdNRVMi5wZmqPxS-4
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AddColumnElement_1;
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Plus } from '../../icons/plus.js';
import { ColumnAddedEvent } from '../../lib/events.js';
import { ClassifiedElement } from '../classified-element.js';
import '../menu/input-menu.js';
let AddColumnElement = AddColumnElement_1 = class AddColumnElement extends ClassifiedElement {
    constructor() {
        super(...arguments);
        this.columnName = '';
        this.columnType = '';
    }
    classMap() {
        return {
            'inline-block p-3.5 w-40': true,
            'text-xs': true,
            'bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50': true,
            'rounded-lg border border-neutral-400 dark:border-neutral-600': true,
            ...super.classMap(),
        };
    }
    onChange(event) {
        const { value } = event.target;
        this.columnName = value;
    }
    onSubmit(event) {
        event.preventDefault();
        // this.errorMessage = html` <div class="flex items-center gap-1 text-[8px] leading-[9.6px] text-wrap">
        //     <span class="text-neutral-950">${WarningOctagon(12)}</span>
        //     <span>Name cannot contain special&nbsp;characters</span>
        // </div>`
        if (!this.columnName)
            throw new Error('Missing column name');
        this.dispatchEvent(new ColumnAddedEvent({ name: this.columnName, data: { type: this.columnType } }));
    }
    render() {
        return html `<form @submit=${this.onSubmit} class="flex flex-col gap-3.5 text-xs">
      <div class="flex flex-col gap-1">
        <label for="column-name" class=${classMap(AddColumnElement_1.labelClasses)}>Column Name</label>
        <input
          required
          type="text"
          name="column-name"
          id="column-name"
          class=${classMap(AddColumnElement_1.inputClasses)}
          placeholder="Enter name"
          autocomplete="off"
          .value=${this.columnName}
          @input=${this.onChange}
        />
        ${this.errorMessage}
      </div>

      <div class="flex flex-col gap-1">
        <label for="data-type" class=${classMap(AddColumnElement_1.labelClasses)}>Select Type</label>

        <astra-input-menu
          ._classMap=${AddColumnElement_1.inputClasses}
          .options=${[
            { label: 'Text', value: 'Text' },
            { label: 'Integer', value: 'Integer' },
            { label: 'Date and time', value: 'Date and time' },
            { label: 'Boolean', value: 'Boolean' },
            { label: 'Image', value: 'Image' },
            { label: 'etc.', value: 'etc.' },
        ]}
          @change=${(event) => {
            event.stopPropagation();
            this.columnType = event.value;
        }}
          @menu-selection=${(event) => {
            event.stopPropagation();
        }}
        ></astra-input-menu>
      </div>

      <button ?disabled="${this.columnName.length === 0}" class=${classMap(AddColumnElement_1.buttonClasses)} type="submit">
        Create Column
      </button>
    </form>`;
    }
};
AddColumnElement.labelClasses = {
    'font-medium': true,
};
AddColumnElement.inputClasses = {
    'focus:ring-1 focus:ring-neutral-500 focus:outline-none ': true,
    'px-2 py-1.5': true,
    'bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50': true,
    'placeholder-neutral-600 dark:placeholder-neutral-400': true,
    'rounded-md border border-neutral-400 dark:border-neutral-600 focus:dark:border-neutral-300': true,
};
AddColumnElement.buttonClasses = {
    'bg-neutral-950 dark:bg-neutral-50 hover:bg-neutral-800 hover:dark:bg-neutral-200': true,
    'text-neutral-50 dark:text-neutral-950': true,
    'px-5 py-1.5 rounded-md': true,
    'disabled:bg-neutral-400 disabled:dark:bg-neutral-600': true,
};
__decorate([
    state()
], AddColumnElement.prototype, "columnName", void 0);
__decorate([
    state()
], AddColumnElement.prototype, "columnType", void 0);
__decorate([
    state()
], AddColumnElement.prototype, "errorMessage", void 0);
AddColumnElement = AddColumnElement_1 = __decorate([
    customElement('astra-add-column')
], AddColumnElement);
export { AddColumnElement };
let AddColumnTriggerElement = class AddColumnTriggerElement extends ClassifiedElement {
    classMap() {
        return {
            'p-0.5 rounded-md cursor-pointer': true,
            'dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900': true,
            'border border-transparent active:border-neutral-200 dark:active:border-neutral-800': true,
            ...super.classMap(),
        };
    }
    render() {
        return html `${Plus(16)}`;
    }
};
AddColumnTriggerElement = __decorate([
    customElement('astra-add-column-trigger')
], AddColumnTriggerElement);
export { AddColumnTriggerElement };
