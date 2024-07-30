import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import type { TextEditor } from '..'

export default class UniversePlugin extends LitElement {
  @property() editor?: TextEditor | null

  override connectedCallback(): void {
    super.connectedCallback()

    // find parent text-editor
    let ancestor = this.parentElement
    while (ancestor) {
      if (ancestor.tagName.toLowerCase() === 'text-editor') {
        console.debug('Found <text-editor> ancestor:', ancestor)
        break
      }
      ancestor = ancestor.parentElement
    }

    this.editor = ancestor as unknown as TextEditor
  }
}
