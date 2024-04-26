import { customElement } from 'lit/decorators.js'

import { Menu } from './index.js'

@customElement('outerbase-th-menu')
export class ColumnMenu extends Menu {
    protected override get menuPositionClasses() {
        const isRenderingInBrowser = typeof window !== 'undefined'
        if (!isRenderingInBrowser) return ''
        return 'right-0 top-8'
    }
}
