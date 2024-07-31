import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import type { TextEditor } from '..'

export default class UniversePlugin extends LitElement {
  @property() editor!: TextEditor // we may insist this is set since our `connectedCallback` will throw if not found

  override connectedCallback(): void {
    super.connectedCallback()

    // find parent text-editor
    let ancestor = this.parentElement
    while (ancestor) {
      if (ancestor.tagName.toLowerCase() === 'text-editor') {
        break
      }
      ancestor = ancestor.parentElement
    }

    if (!ancestor) throw new Error('Failed to find parent <text-editor />')

    this.editor = ancestor as unknown as TextEditor
  }
}
