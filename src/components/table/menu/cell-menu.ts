import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Menu } from './experiment'

@customElement('astra-td-menu')
export class CellMenu extends Menu {
  public override render() {
    return html`
      <div class="whitespace-nowrap text-ellipsis overflow-hidden w-full focus:z-[1]">
        <slot></slot>
      </div>
      ${super.render()}
    `
  }
}
