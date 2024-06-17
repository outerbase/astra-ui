import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { map } from 'lit/directives/map.js'
import { ClassifiedElement } from '../classified-element.js'

@customElement('astra-composed-chart')
export default class AstraComposedChart extends ClassifiedElement {
  @property({ type: Array }) highlights?: Array<{ name: string }>
  @property({ type: String }) header?: string
  @property({ type: String }) subheader?: string

  render() {
    const headerSection =
      this.header || this.subheader
        ? html`<div id="header" class=" flex justify-between w-full">
            <div id="header-labels" class="flex flex-col gap-2">
              ${this.header ? html`<h1 class="text-xl font-semibold">${this.header}</h1>` : null}
              ${this.subheader ? html`<h2 class="text-md">${this.subheader}</h2>` : null}
            </div>

            <slot name="actions"></slot>
          </div>`
        : null

    const highlightSection = this.highlights
      ? html`<div id="quickies" class="flex gap-2">
          ${map(
            this.highlights,
            ({ name }) => html`<span class="bg-neutral-200 dark:bg-neutral-800 p-4 border rounded-md flex-1">${name}</span>`
          )}
        </div>`
      : null

    const chartSection = html`<div
      id="chart"
      class="bg-neutral-200 dark:bg-neutral-800 flex-1 p-2 flex items-center justify-center min-h-96 border-dashed border rounded-lg"
    >
      <slot></slot>
    </div>`

    return html`<div class="${classMap({ dark: this.theme === 'dark' })}">
      <div
        id="composed-chart"
        class="dark:text-neutral-50 text-neutral-950 flex flex-col p-4 gap-2 rounded-lg border bg-neutral-50 dark:bg-neutral-950 group"
      >
        ${headerSection} ${highlightSection} ${chartSection}
      </div>
    </div>`
  }
}
