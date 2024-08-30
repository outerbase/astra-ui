import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { CaretDown } from '../../../icons/caret-down.js'
import { Menu } from './experiment'

@customElement('astra-th-menu')
export class ColumnMenu extends Menu {
  public override render() {
    return html`
      <div class="flex items-center justify-between gap-2">
        <slot></slot>
        <div
          @click="${(event: MouseEvent) => {
            event.stopPropagation()
            this.toggleMenu()
          }}"
          class="border border-transparent active:border-neutral-200 dark:active:border-neutral-800 p-0.5 rounded-md ${classMap({
            // light
            'hover:bg-theme-menu-toggle-color-hover': this.theme !== 'dark',
            'active:bg-theme-menu-toggle-color-active': this.theme !== 'dark',

            // dark
            'hover:bg-theme-menu-toggle-color-hover-dark': this.theme === 'dark',
            'active:bg-theme-menu-toggle-color-active-dark': this.theme === 'dark',
          })}"
        >
          ${CaretDown(16)}
        </div>
      </div>

      ${super.render()}
    `
  }
}
