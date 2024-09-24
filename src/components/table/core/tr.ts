import type { PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { ClassifiedElement } from '../../classified-element.js'

// tl;dr <tr/>, table-row
@customElement('astra-tr')
export class TableRow extends ClassifiedElement {
  protected override classMap() {
    return {
      'flex group': true,
      // 'h-9': true,
      // 'hover:bg-theme-table-row-hover dark:hover:bg-theme-table-row-hover-dark': true,

      // when a header
      'text-theme-table-column-text dark:text-theme-table-column-text-dark': this.isHeaderRow,

      // when new, not selected
      'bg-theme-table-row-new dark:bg-theme-table-row-new-dark': this.new && !this.selected,

      // not selected, not new, not a header
      'odd:bg-theme-table-row-odd dark:odd:bg-theme-table-row-odd-dark even:bg-theme-table-row-even dark:even:bg-theme-table-row-even-dark':
        !this.new && !this.isHeaderRow && !this.selected,

      // when selected
      'bg-theme-table-row-selected dark:bg-theme-table-row-selected-dark hover:bg-theme-table-row-selected-hover dark:hover:bg-theme-row-selected-hover-dark':
        this.selected && !this.isHeaderRow,

      ...super.classMap(),
    }
  }

  @property({ type: Boolean, attribute: 'selected' })
  public selected: boolean = false

  @property({ type: Boolean, attribute: 'header', reflect: true })
  public isHeaderRow: boolean = false

  @property({ type: Boolean, attribute: 'new' })
  public new = false

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    // dispatch event when row is selected/unselected
    if (changedProperties.has('selected') && changedProperties.get('selected') !== undefined) this.dispatchEvent(new Event('on-selection'))
  }
}
