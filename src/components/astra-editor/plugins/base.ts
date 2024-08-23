import { LitElement } from 'lit'
import { AstraEditor } from '../index.js'

export class AstraEditorPlugin extends LitElement {
  editor!: AstraEditor

  connectedCallback() {
    super.connectedCallback()

    let ancestor = this.parentElement
    while (ancestor) {
      if (ancestor.tagName.toLowerCase() === 'astra-editor') {
        break
      }
      ancestor = ancestor.parentElement
    }

    if (!ancestor) throw new Error('Failed to find parent <astra-editor />')

    this.editor = ancestor as unknown as AstraEditor
  }
}
