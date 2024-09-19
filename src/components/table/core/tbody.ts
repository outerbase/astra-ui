import { customElement, property } from 'lit/decorators.js'

import { ClassifiedElement } from '../../classified-element.js'

// tl;dr <tbody/>, table-row-group
@customElement('astra-rowgroup')
export class TBody extends ClassifiedElement {
  @property({ attribute: 'sticky', type: Boolean }) isSticky = false
  @property({ attribute: 'shadow', type: Boolean }) hasShadow = true

  protected override classMap() {
    return {
      ...super.classMap(),
      'table-row-group': true,
      sticky: this.isSticky,
      'top-[39px]': this.isSticky,
      'z-10': this.isSticky,
      'shadow-[10px_0_5px_-5px_#84cc16]': this.hasShadow,
      'border-r': true,
    }
  }
}

// <div class="table-row-group sticky top-[39px] z-10" />
