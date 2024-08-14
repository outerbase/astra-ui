import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { CodeMirror } from '..'

export class CodeMirrorPlugin extends LitElement {
  @property() editor!: CodeMirror

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

    this.editor = ancestor as unknown as CodeMirror
  }
}
