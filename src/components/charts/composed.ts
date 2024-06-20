import { html, type PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import AstraChart from './chart.js'

@customElement('astra-composed-chart')
export default class AstraComposedChart extends AstraChart {
  @property({ type: String }) header?: string
  @property({ type: String }) subheader?: string
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'large'

  public willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    if (changedProperties.has('data')) {
      this.header = this.data?.name
      this.subheader = this.data?.description
    }
  }

  public render() {
    // include header when large
    const headerSection = html`
      <div id="header" class="flex justify-between w-full">
        ${this.header || this.subheader
          ? html`
              <div id="header-labels" class="flex flex-col gap-2">
                ${this.header ? html`<h1 class="text-xl font-semibold">${this.header}</h1>` : null}
                ${this.subheader && this.size === 'large' ? html`<h2 class="text-md">${this.subheader}</h2>` : null}
              </div>
            `
          : null}

        <div class="hidden group-hover/actions:block"><slot name="actions"></slot></div>
      </div>
    `

    // include highlights when lg or md
    const highlightSection =
      this.size === 'large' || this.size === 'medium'
        ? html`
            <div id="highlights" class="flex w-full items-center justify-between gap-8">
              <div
                class="flex flex-auto items-center justify-center rounded bg-neutral-100 py-3 text-xl text-black dark:bg-neutral-900 dark:text-white"
              >
                27%
              </div>

              <div
                class="flex flex-auto items-center  justify-center rounded bg-neutral-100 py-3 text-xl text-black dark:bg-neutral-900 dark:text-white"
              >
                17 hours
              </div>

              <div
                class="flex flex-auto items-center  justify-center rounded bg-neutral-100 py-3 text-xl text-black dark:bg-neutral-900 dark:text-white"
              >
                🏎️
              </div>
            </div>
          `
        : null

    // render chart
    const chart = super.render()
    const chartSection = html`<div id="chart" class="flex-1 p-2 flex items-center justify-center min-h-96 ">${chart}</div>`

    // render result
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
