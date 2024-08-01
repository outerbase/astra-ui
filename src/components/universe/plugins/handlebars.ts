import { html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ClassifiedElement } from '../../classified-element'
import UniversePlugin from './base'

@customElement('universe-handlebars-plugin')
export class HandlebarsPlugin extends UniversePlugin {
  static styles = ClassifiedElement.styles // tailwindcss

  @state() isDisplayed = false

  connectedCallback(): void {
    super.connectedCallback()

    const editor = this.editor
    if (!editor) {
      throw new Error('Failed to find parent <text-editor />')
    }

    editor.addEventListener('keydown', (event) => {
      const hasCtrlKey = event.ctrlKey

      // toggle the menu on Control + Space
      const isSpaceKey = event.code === 'Space'
      if (hasCtrlKey && isSpaceKey) {
        event.preventDefault()
        this.isDisplayed = !this.isDisplayed
      }

      // hide the menu if the user presses escape
      const isEscapeKey = event.code === 'Escape'
      if (this.isDisplayed && isEscapeKey) {
        event.preventDefault()
        this.isDisplayed = false
      }
    })

    editor.addEventListener('blur', (_event) => {
      this.isDisplayed = false
    })
  }

  render() {
    return this.isDisplayed
      ? html`<div
          class="border border-zinc-500 bg-zinc-200/60 backdrop-blur-sm rounded flex flex-col items-start overflow-clip text-sm text-zinc-600 w-[120px]"
        >
          <span class="text-center w-full py-2 text-xl border-b border-zinc-500">😮</span>
          <span class="cursor-pointer bg-white/40 hover:bg-white flex-auto w-full p-2 hover:text-black border-b border-zinc-500"
            >Context</span
          >
          <span class="cursor-pointer bg-white/40 hover:bg-white flex-auto w-full p-2 hover:text-black border-b border-zinc-500">Menu</span>
          <span class="cursor-pointer bg-white/40 hover:bg-white flex-auto w-full p-2 hover:text-black">Items</span>
        </div>`
      : nothing
  }
}
