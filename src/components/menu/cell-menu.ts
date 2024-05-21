import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

import { Theme } from '../../types.js'
import { Menu } from './index.js'

@customElement('astra-td-menu')
export class CellMenu extends Menu {
  protected override get menuPositionClasses() {
    const isRenderingInBrowser = typeof window !== 'undefined'
    if (!isRenderingInBrowser) return ''

    return 'right-0 left-0 top-9'
  }

  public override render() {
    const darkClass = classMap({ dark: this.theme == Theme.dark })

    // @click shows/hides the menu
    // @dblclick prevents parent's dblclick
    // @keydown navigates the menu

    // TODO @johnny add `tabindex` to #trigger to restore keyboard nav to the cell menu
    // it needs to be conditional whether the menu is open or not or else double tabbing occurs on the table
    return html`
      <span
        class=${classMap({
          'whitespace-nowrap text-ellipsis pointer-events-none': true,
          'overflow-hidden w-full focus:z-[1] ': true,
        })}
        ><slot></slot
      ></span>
      <span
        id="trigger"
        aria-haspopup="menu"
        class=${darkClass}
        @click=${this.onTrigger}
        @dblclick=${(e: MouseEvent) => e.stopPropagation()}
        @keydown=${this.onKeyDown}
      >
        ${this.listElement}</span
      >
    `
  }
}
