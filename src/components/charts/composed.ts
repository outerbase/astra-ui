import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ClassifiedElement } from '../classified-element.js'
import AstraChart from './chart.js'

@customElement('astra-composed-chart')
export default class AstraComposedChart extends AstraChart {
  static override styles = [
    ...ClassifiedElement.styles,
    css`
      /* #composed-chart-title {
        font-size: 20px;
        line-height: 28px;
      } */

      .space-mono-regular {
        font-family: 'Space Mono', monospace;
        font-weight: 400;
        font-style: normal;
      }
    `,
  ]

  @property({ type: String }) header?: string
  @property({ type: String }) subheader?: string
  //   @property({ type: String }) size: 'small' | 'medium' | 'large' = 'large'
  @property({ type: Boolean }) showHighlights = true
  @property({ type: Number }) refresh?: number

  // When `refresh` has changed re render
  //   public updated(changedProperties: PropertyValueMap<this>): void {
  //     super.updated(changedProperties)

  //     console.log('Changed Props: ', changedProperties)

  //     if (changedProperties.has('refresh')) {
  //       this.requestUpdate()
  //     }
  //   }

  //   public willUpdate(changedProperties: PropertyValueMap<this>): void {
  //     super.willUpdate(changedProperties)

  //     if (changedProperties.has('data')) {
  //       this.header = this.data?.name
  //       this.subheader = this.data?.description
  //     }
  //   }

  public render() {
    // include header when large
    const headerSection = html`
      <div id="header" class="flex justify-between w-full">
        ${this.header || this.subheader
          ? html`
              <div id="header-labels" class="flex flex-col">
                ${this.header ? html`<h1 class="text-xl font-medium">${this.header}</h1>` : null}
                ${this.subheader ? html`<h2 class="text-md text-neutral-600 dark:text-neutral-400">${this.subheader}</h2>` : null}
              </div>
            `
          : null}

        <div class="hidden group-hover/actions:block"><slot name="actions"></slot></div>
      </div>
    `

    let highlightTotal = 0
    let highlightAverage = 0

    if (this.data?.layers?.length && this.data?.layers?.[0].result) {
      this.data?.layers?.[0].result?.forEach((row) => {
        // Assume the first yAxisKey is the total and casted as a Number
        const yAxisKey = this.data?.options?.yAxisKeys?.[0] ?? ''
        const rowValue = row[yAxisKey]
        const total = Number(rowValue ?? 0)
        highlightTotal += total
      })

      highlightAverage = highlightTotal / (this.data?.layers?.[0].result?.length ?? 0)
    }

    const highlightSection =
      this.showHighlights && this.data?.highlights?.length
        ? html`
            <div id="highlights" class="flex w-full items-center justify-between gap-8 mb-4">
              ${this.data?.highlights?.map(
                (callout) => html`
                  <div class="flex flex-auto flex-col text-xl text-black dark:text-white">
                    <div class="dark:text-neutral-400 text-neutral-600 capitalize" style="font-size: 14px; line-height: 21px;">
                      ${callout.replace('_', ' ')}
                    </div>
                    ${callout === 'total'
                      ? html`<div class="space-mono-regular" style="font-size: 30px; margin-top: 6px;">
                          ${highlightTotal.toLocaleString('en', { useGrouping: true })}
                        </div>`
                      : null}
                    ${callout === 'average'
                      ? html`<div class="space-mono-regular" style="font-size: 30px; margin-top: 6px;">${highlightAverage.toFixed(2)}</div>`
                      : null}
                    ${callout === 'percent_change'
                      ? html`<div class="space-mono-regular" style="font-size: 30px; margin-top: 6px;">${'??'}%</div>`
                      : null}
                  </div>
                `
              )}
            </div>
          `
        : null

    // render chart
    const chart = super.render()
    const chartSection = html`<div id="chart" class="flex-1 flex items-center justify-center overflow-hidden">${chart}</div>`

    // render result
    return html`
      <div class="${classMap({ dark: this.theme === 'dark' })} h-full">
        <div
          id="composed-chart"
          class="dark:text-neutral-50 text-neutral-950 h-full flex flex-col p-6 gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-925 group/actions"
        >
          ${headerSection} ${highlightSection} ${chartSection}
        </div>
      </div>
    `
  }
}
