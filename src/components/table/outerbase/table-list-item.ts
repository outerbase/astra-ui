import { html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ClassifiedElement } from '../../classified-element'

import { CaretDown } from '../../../icons/caret-down.js'
import { CaretRight } from '../../../icons/caret-right.js'
import { FolderClosed } from '../../../icons/folder-closed.js'
import { FolderOpen } from '../../../icons/folder-open.js'

@customElement('outerbase-table-list-item')
export default class ToggleableElement extends ClassifiedElement {
  @property() label = ''
  @property({ type: Boolean, attribute: 'open' }) isOpen = false

  render() {
    return html`<div
        class="select-none cursor-pointer py-2 px-2 gap-2 flex items-center text-theme-sidebar-subheader-content dark:text-theme-sidebar-subheader-content-dark"
        @click=${() => (this.isOpen = !this.isOpen)}
      >
        <span>${this.isOpen ? CaretDown(12) : CaretRight(12)}</span>
        <span>${this.isOpen ? FolderOpen(12) : FolderClosed(12)}</span>
        <span>${this.label}</span>
      </div>
      ${this.isOpen ? html`<slot></slot>` : nothing}`
  }
}
