import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { CaretDown } from '../../../icons/caret-down.js'
import { Menu } from './index.js'

@customElement('astra-th-menu')
export class ColumnMenu extends Menu {
  onClick(event: MouseEvent) {
    // prevent the click from surfacing and triggering column sorting
    event.stopPropagation()
  }

  constructor() {
    super()
    this.onClick = this.onClick.bind(this)
  }

  public connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  public override render() {
    return html`
      <div class="flex items-center justify-between gap-2">
        <slot></slot>
        <div
          class="border border-transparent active:border-neutral-200 dark:active:border-neutral-800 p-0.5 rounded-md ${classMap({
            // light
            'hover:bg-theme-menu-toggle-color-hover': this.theme !== 'dark',
            'active:bg-theme-menu-toggle-color-active': this.theme !== 'dark',

            // dark
            'hover:bg-theme-menu-toggle-color-hover-dark': this.theme === 'dark',
            'active:bg-theme-menu-toggle-color-active-dark': this.theme === 'dark',
          })}"
          @click=${this.onTrigger}
        >
          ${CaretDown(16)}
        </div>
      </div>

      ${super.render()}
    `
  }
}
