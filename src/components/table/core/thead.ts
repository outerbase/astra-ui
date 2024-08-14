import { customElement } from 'lit/decorators.js'

import { ClassifiedElement } from '../../classified-element.js'

// tl;dr <thead/>, table-header-group
@customElement('astra-thead')
export class THead extends ClassifiedElement {
  protected override classMap() {
    return {
      'table-header-group ': true,
      sticky: true,
      'z-[2]': true,
      'top-0': true,
      'backdrop-blur-astra-table': true,
      ...super.classMap(),
    }
  }
}
