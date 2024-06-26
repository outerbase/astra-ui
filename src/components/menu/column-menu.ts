import { customElement } from 'lit/decorators.js'

import { Menu } from './index.js'

@customElement('astra-th-menu')
export class ColumnMenu extends Menu {
  protected override classMap() {
    return {
      ...super.classMap(),
      'flex items-center justify-between gap-2': true,
    }
  }

  protected override get menuPositionClasses() {
    const isRenderingInBrowser = typeof window !== 'undefined'
    if (!isRenderingInBrowser) return ''
    return 'right-0 top-8'
  }
}
