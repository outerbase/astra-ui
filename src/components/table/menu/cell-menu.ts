import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { Menu } from './index.js'

@customElement('astra-td-menu')
export class CellMenu extends Menu {
  anchored = false

  public override render() {
    return html`
      <div class="whitespace-nowrap text-ellipsis overflow-hidden w-full focus:z-[1]">
        <slot></slot>
      </div>
      ${super.render()}
    `
  }
}
