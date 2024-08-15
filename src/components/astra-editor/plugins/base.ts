import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { AstraEditor } from '..'

export class AstraEditorPlugin extends LitElement {
  @property() editor!: AstraEditor

  connectedCallback() {
    super.connectedCallback()

    let ancestor = this.parentElement
    while (ancestor) {
      if (ancestor.tagName.toLowerCase() === 'code-mirror') {
        break
      }
      ancestor = ancestor.parentElement
    }

    if (!ancestor) throw new Error('Failed to find parent <code-mirror />')

    this.editor = ancestor as unknown as AstraEditor
  }
}
