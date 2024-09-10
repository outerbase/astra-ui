import { customElement, property } from 'lit/decorators.js'

import { ClassifiedElement } from '../../classified-element.js'

// tl;dr <tbody/>, table-row-group
@customElement('astra-rowgroup')
export class TBody extends ClassifiedElement {
  @property({ attribute: 'sticky', type: Boolean }) isSticky = false

  protected override classMap() {
    return { ...super.classMap(), 'table-row-group': true, sticky: this.isSticky, 'top-[39px]': this.isSticky, 'z-10': this.isSticky }
  }
}
