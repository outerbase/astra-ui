import type { UniverseEditor } from '../../src/components/universe'

export default class UniversePlugin {
  editor: UniverseEditor

  constructor(editor: UniverseEditor) {
    this.editor = editor
  }
}
