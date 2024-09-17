import { javascript } from '@codemirror/lang-javascript'
import type { PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { AstraEditorPlugin } from './base.js'

const PLUGIN_NAME = 'js-plugin'

@customElement('astra-editor-javascript')
export class AstraEditorJavascriptPlugin extends AstraEditorPlugin {
  @property({ type: Boolean, attribute: 'typescript' }) typescript: boolean = false

  protected updated(properties: PropertyValues): void {
    super.updated(properties)

    if (properties.has('typescript')) {
      this.updateExtension()
    }
  }

  protected updateExtension() {
    if (this.editor) {
      this.editor.updateExtension(PLUGIN_NAME, [
        javascript({
          typescript: this.typescript,
        }),
      ])
    }
  }

  firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties)
    this.updateExtension()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.editor.removeExtension(PLUGIN_NAME)
  }
}
