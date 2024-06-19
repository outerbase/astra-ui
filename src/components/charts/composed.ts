import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ClassifiedElement } from '../classified-element.js'

@customElement('astra-composed-chart')
export default class AstraComposedChart extends ClassifiedElement {
  @property({ type: String }) header?: string
  @property({ type: String }) subheader?: string
  // TODO add property that determines the layout desired (sm, md, lg)

  public render() {
    const headerSection = html`
      <div id="header" class="flex justify-between w-full">
        ${this.header || this.subheader
          ? html`
              <div id="header-labels" class="flex flex-col gap-2">
                ${this.header ? html`<h1 class="text-xl font-semibold">${this.header}</h1>` : null}
                ${this.subheader ? html`<h2 class="text-md">${this.subheader}</h2>` : null}
              </div>
            `
          : null}

        <div class="hidden group-hover/actions:block"><slot name="actions"></slot></div>
      </div>
    `

    const highlightSection = html`
      <div id="highlights" class="flex gap-2">
        <slot name="highlights" />
      </div>
    `

    const chartSection = html`<div id="chart" class="flex-1 p-2 flex items-center justify-center min-h-96 ">
      <slot></slot>
    </div>`

    return html`
      <div class="${classMap({ dark: this.theme === 'dark' })}">
        <div
          id="composed-chart"
          class="dark:text-neutral-50 text-neutral-950 flex flex-col p-4 gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 group/actions"
        >
          ${headerSection} ${highlightSection} ${chartSection}
        </div>
      </div>
    `
  }
}
