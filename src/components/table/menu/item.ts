import '../../hans-wormhole.js'

import { html, type PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ClassifiedElement } from '../../classified-element.js'

@customElement('astra-menu-item')
export class MenuItem extends ClassifiedElement {
  @property({ type: Boolean }) protected focused: boolean = false
  @property({ type: Boolean }) protected selected: boolean = false
  @property() protected class?: string

  public override updated(changedProperties: PropertyValueMap<this>): void {
    super.updated(changedProperties)
  }

  public override render() {
    // console.log('this.class', this.class)
    console.log('this.focused', this.focused)
    // console.log('this.selected', this.selected)
    return html`<div
      class="group text-ellipsis rounded-md p-2.5 cursor-pointer hover:bg-theme-menu-background-color-active hover:text-theme-menu-content-color-active dark:hover:bg-theme-menu-background-color-active-dark dark:hover:text-theme-menu-content-color-active-dark ${classMap(
        {
          [this.class ?? '']: !!this.class,
          // active states
          'text-theme-menu-content-color-active': this.focused,
          'bg-theme-menu-background-color-active': this.focused,
          'dark:text-theme-menu-content-color-active-dark': this.focused,
          'dark:bg-theme-menu-background-color-active-dark': this.focused,
        }
      )}"
    >
      <slot></slot>
      <div class="absolute hidden group-hover:flex left-[100%] z-[1000] w-32 top-0 bg-green-400">oh hai</div>
    </div>`
  }
}
