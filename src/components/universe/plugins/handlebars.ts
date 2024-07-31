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
    const lineheight = this.editor!.computeLineHeight() * 2
    console.log('lineheight', lineheight)

    // const textarea = this.editor!.textareaRef.value!

    // function getCurrentLine() {
    //   const text = textarea.value.substr(0, textarea.selectionStart)
    //   return text.split('\n').length - 1
    // }

    // const lines = textarea.value.split('\n')
    // const { scrollTop, clientHeight } = textarea
    // const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight)
    // const startIndex = Math.floor(scrollTop / lineHeight)
    // const endIndex = Math.floor((scrollTop + clientHeight) / lineHeight)

    // const currentLine = getCurrentLine()
    // console.log(`Current line: ${currentLine + 1}. ` + (currentLine < startIndex || currentLine > endIndex ? 'Off-screen' : 'Visible'))

    // style="margin-top: ${lineheight}px;"
    return this.isDisplayed ? html`<div class="border border-zinc-500 bg-zinc-300/50 backdrop-blur-sm rounded">😮</div>` : nothing
  }
}
