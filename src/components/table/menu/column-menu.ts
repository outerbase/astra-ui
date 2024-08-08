import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { CaretDown } from '../../../icons/caret-down.js'
import { Menu } from './index.js'

@customElement('astra-th-menu')
export class ColumnMenu extends Menu {
  public override render() {
    return html`
      <div class="flex items-center justify-between gap-2">
        <slot></slot>
        <div
          class="border border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 active:border-neutral-200 dark:active:border-neutral-800 p-0.5 rounded-md"
          @click=${this.onTrigger}
        >
          ${CaretDown(16)}
        </div>
      </div>

      ${super.render()}
    `
  }
}
