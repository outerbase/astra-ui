import { customElement } from 'lit/decorators.js'
import UniversePlugin from './base'

@customElement('universe-keyboard-shortcuts-plugin')
export class KeyboardShortcutsPlugin extends UniversePlugin {
  connectedCallback(): void {
    super.connectedCallback()
    const editor = this.editor

    if (!editor) {
      throw new Error('Failed to find parent <text-editor />')
    }

    editor.addEventListener('keydown', (event) => {
      const hasMetaKey = event.metaKey
      const isSlashKey = event.code === 'Slash'
      if (hasMetaKey && isSlashKey) {
        editor.toggleLineComments()
      }
    })
  }
}
