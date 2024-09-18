import { html, type TemplateResult } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

import { Plus } from '../../icons/plus.js'
import { ChangeEvent, ColumnAddedEvent, MenuSelectedEvent } from '../../lib/events.js'
import { ClassifiedElement } from '../classified-element.js'
import '../table/menu/input-menu.js'

@customElement('astra-add-column')
export class AddColumnElement extends ClassifiedElement {
  protected classMap() {
    return {
      'inline-block p-3.5 w-40': true,
      'text-xs': true,
      'bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50': true,
      'rounded-lg border border-neutral-400 dark:border-neutral-600': true,
      ...super.classMap(),
    }
  }

  static labelClasses = {
    'font-medium': true,
  }

  static inputClasses = {
    'focus:ring-1 focus:ring-neutral-500 focus:outline-none ': true,
    'px-2 py-1.5': true,
    'bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50': true,
    'placeholder-neutral-600 dark:placeholder-neutral-400': true,
    'rounded-md border border-neutral-400 dark:border-neutral-600 focus:dark:border-neutral-300': true,
  }

  static buttonClasses = {
    'bg-neutral-950 dark:bg-neutral-50 hover:bg-neutral-800 hover:dark:bg-neutral-200': true,
    'text-neutral-50 dark:text-neutral-950': true,
    'px-5 py-1.5 rounded-md': true,
    'disabled:bg-neutral-400 disabled:dark:bg-neutral-600': true,
  }

  @state() protected columnName = ''
  @state() protected columnType = ''
  @state() protected errorMessage: TemplateResult<1> | undefined

  protected onChange(event: InputEvent) {
    const { value } = event.target as HTMLInputElement
    this.columnName = value
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    // this.errorMessage = html` <div class="flex items-center gap-1 text-[8px] leading-[9.6px] text-wrap">
    //     <span class="text-neutral-950">${WarningOctagon(12)}</span>
    //     <span>Name cannot contain special&nbsp;characters</span>
    // </div>`

    if (!this.columnName) throw new Error('Missing column name')

    this.dispatchEvent(new ColumnAddedEvent({ name: this.columnName, data: { type: this.columnType } }))
  }

  public override render() {
    return html`<form @submit=${this.onSubmit} class="flex flex-col gap-3.5 text-xs">
      <div class="flex flex-col gap-1">
        <label for="column-name" class=${classMap(AddColumnElement.labelClasses)}>Column Name</label>
        <input
          required
          type="text"
          name="column-name"
          id="column-name"
          class=${classMap(AddColumnElement.inputClasses)}
          placeholder="Enter name"
          autocomplete="off"
          .value=${this.columnName}
          @input=${this.onChange}
        ></input>
        ${this.errorMessage}
      </div>

      <div class="flex flex-col gap-1">
        <label for="data-type" class=${classMap(AddColumnElement.labelClasses)}>Select Type</label>

        <astra-input-menu
          ._classMap=${AddColumnElement.inputClasses}
          .options=${[
            { label: 'Text', value: 'Text' },
            { label: 'Integer', value: 'Integer' },
            { label: 'Date and time', value: 'Date and time' },
            { label: 'Boolean', value: 'Boolean' },
            { label: 'Image', value: 'Image' },
            { label: 'etc.', value: 'etc.' },
          ]}
          @change=${(event: ChangeEvent) => {
            event.stopPropagation()
            this.columnType = event.value
          }}
          @menu-selection=${(event: MenuSelectedEvent) => {
            event.stopPropagation()
          }}
        ></astra-input-menu>
      </div>

      <button ?disabled="${this.columnName.length === 0}" class=${classMap(AddColumnElement.buttonClasses)} type="submit">
        Create Column
      </button>
    </form>`
  }
}

@customElement('astra-add-column-trigger')
export class AddColumnTriggerElement extends ClassifiedElement {
  protected classMap() {
    return {
      'p-0.5 rounded-md cursor-pointer': true,
      'dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900': true,
      'border border-transparent active:border-neutral-200 dark:active:border-neutral-800': true,
      ...super.classMap(),
    }
  }

  public override render() {
    return html`${Plus(16)}`
  }
}
