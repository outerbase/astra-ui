import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import type { DashboardV3ChartQuery } from '../../types.js'
import { ClassifiedElement } from '../classified-element.js'
import AstraChart from './chart.js'

@customElement('astra-composed-chart')
export default class AstraComposedChart extends AstraChart {
  static override styles = [
    ...ClassifiedElement.styles,
    css`
      * {
        --astra-table-background-color: #f5f5f5;
        --astra-table-border-color: #d4d4d4;
        --astra-table-column-header-background-color: #f5f5f5;
        --astra-table-row-even-background-color: #f5f5f5;
      }

      * .dark {
        --astra-table-background-color: #121212;
        --astra-table-border-color: #404040;
        --astra-table-column-header-background-color-dark: #121212;
        --astra-table-row-even-background-color-dark: #121212;
      }

      .space-mono-regular {
        font-family: 'Space Mono', monospace;
        font-weight: 400;
        font-style: normal;
      }
    `,
  ]

  // A header to display above the chart.
  @property({ type: String }) header?: string
  // A subheader to display below the header.
  @property({ type: String }) subheader?: string
  // Whether to show the highlights section of the chart. Defaults to true.
  @property({ type: Boolean }) showHighlights = true
  // When presented in a grid layout, indicates how many spaces on the X axis the chart consumes. Between 1 and 4.
  @property({ type: Number }) sizeX?: number
  // When presented in a grid layout, indicates how many spaces on the Y axis the chart consumes. Between 1 and 2.
  @property({ type: Number }) sizeY?: number

  public render() {
    // include header when large
    const headerSection = html`
      <div id="header" class="flex justify-between w-full">
        ${this.header || this.subheader
          ? html`
              <div id="header-labels" class="flex flex-col">
                ${this.header ? html`<h1 class="text-xl dark:text-neutral-200 text-neutral-800 font-medium">${this.header}</h1>` : null}
                ${this.subheader ? html`<h2 class="text-md text-neutral-600 dark:text-neutral-400">${this.subheader}</h2>` : null}
              </div>
            `
          : null}

        <div class="hidden group-hover/actions:block"><slot name="actions"></slot></div>
      </div>
    `

    // For the Highlights section, calculate the various potential values
    // that can be displayed. This includes the total, average, and percent change.
    const layer: DashboardV3ChartQuery | undefined = this.data?.layers?.[0]
    let highlightTotal = 0
    let highlightAverage = 0
    let highlightPercentChange = 0

    if (layer && layer?.result) {
      layer?.result?.forEach((row) => {
        // Assume the first yAxisKey is the total and casted as a Number
        const yAxisKey = this.data?.options?.yAxisKeys?.[0] ?? ''
        const rowValue = row[yAxisKey]
        const total = Number(rowValue ?? 0)
        highlightTotal += total
      })

      highlightAverage = highlightTotal / (layer?.result?.length ?? 0)
    }

    // Calculate the percent change based on the first and last values
    // in the result set. This is a placeholder value until we have a
    // better way to calculate this.
    if (layer && layer?.result) {
      const firstValue = Number(layer?.result?.[0]?.[this.data?.options?.yAxisKeys?.[0] ?? ''] ?? 0)
      const lastValue = Number(layer?.result?.[layer?.result?.length - 1]?.[this.data?.options?.yAxisKeys?.[0] ?? ''] ?? 0)
      highlightPercentChange = ((lastValue - firstValue) / firstValue) * 100

      // Round to two decimal places
      highlightPercentChange = Math.round(highlightPercentChange * 100) / 100
    }

    // For small size charts, only show the first two highlights. Show a maximum of 4 highlights for other sizes.
    const highlightsDisplayed = this.data?.highlights?.slice(0, this.sizeY === 1 && this.sizeX !== 4 ? 2 : 4)
    let highlightSection = null

    // When the sizeX value is 1 or 2, show the highlights in a grid layout.
    if (this.showHighlights && highlightsDisplayed?.length) {
      const classList =
        this.sizeX === 1 || this.sizeX === 2
          ? `grid grid-cols-2 gap-8 w-full ${layer?.type === 'single_value' ? '' : 'mb-2 mt-4'}`
          : `flex w-full items-center justify-between gap-8 ${layer?.type === 'single_value' ? '' : 'mb-2 mt-4'}`
      const styleList = this.sizeX === 1 || this.sizeX === 2 ? `grid-template: auto / auto auto;` : ''

      highlightSection = html`
        <div id="highlights" class=${classList} style=${styleList}>
          ${highlightsDisplayed?.map(
            (callout) => html`
              <div class="flex flex-auto flex-col text-xl dark:text-neutral-100 text-neutral-900">
                <div class="dark:text-neutral-400 text-neutral-600 capitalize" style="font-size: 14px; line-height: 20px;">
                  ${callout.replace('_', ' ')}
                </div>
                ${callout === 'total'
                  ? html`<div class="space-mono-regular" style="font-size: 20px; line-height: 28px; margin-top: 4px;">
                      ${highlightTotal.toLocaleString('en', { useGrouping: true })}
                    </div>`
                  : null}
                ${callout === 'average'
                  ? html`<div class="space-mono-regular" style="font-size: 20px; line-height: 28px; margin-top: 4px;">
                      ${highlightAverage.toFixed(2)}
                    </div>`
                  : null}
                ${callout === 'percent_change'
                  ? html`<div class="space-mono-regular" style="font-size: 20px; line-height: 28px; margin-top: 4px;">
                      ${highlightPercentChange}%
                    </div>`
                  : null}
              </div>
            `
          )}
        </div>
      `
    }

    // render chart
    const showNoDataLabel = layer?.result?.length === 0 && layer?.type !== 'text'
    const chart = super.render()
    const chartSection = html`<div
      id="chart"
      class=${`flex-1 flex items-center justify-center overflow-hidden ${layer?.type === 'table' ? 'border-t border-[#d4d4d4] dark:border-[#404040]' : ''}`}
    >
      ${showNoDataLabel
        ? html`<div class="flex flex-col gap-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill=${this.theme === 'dark' ? '#e5e5e5' : '#262626'}
              viewBox="0 0 256 256"
              class="mx-auto"
            >
              <path
                d="M192.76,62.72l18.2-20A4,4,0,0,0,205,37.31l-18.2,20a92,92,0,0,0-123.6,136l-18.2,20A4,4,0,1,0,51,218.69l18.2-20A92,92,0,0,0,192.76,62.72ZM44,128A84,84,0,0,1,181.46,63.25L68.63,187.36A83.72,83.72,0,0,1,44,128Zm84,84a83.64,83.64,0,0,1-53.46-19.25L187.37,68.64A84,84,0,0,1,128,212Z"
              ></path>
            </svg>
            <div class="text-neutral-800 dark:text-neutral-200 font-semibold text-xl">No results found.</div>
          </div>`
        : html`${chart}`}
    </div>`

    // const isDarkTheme = this.theme === 'dark'
    // const isTableLayer = layer?.type === 'table'
    // const isSingleValueLayer = layer?.type === 'single_value'

    // // Define the classes that do not depend on conditional logic
    // const staticChartClasses = 'text-neutral-950 h-full flex flex-col gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-925 group/actions'

    // // Use classMap for the dynamic dark mode class and combine it with the static classes
    // const chartClasses = classMap({ dark: isDarkTheme }) + ' ' + staticChartClasses + (isTableLayer ? '' : ' p-5')
    // const headerContainerClasses = isTableLayer ? 'p-5' : ''

    // return html`
    //   <div class="h-full ${classMap({ dark: isDarkTheme })}">
    //     <div id="composed-chart" class="${chartClasses}">
    //       ${isSingleValueLayer
    //         ? html`${headerSection} ${chartSection} ${highlightSection}`
    //         : html`
    //             <div class="${headerContainerClasses}">${headerSection} ${highlightSection}</div>
    //             ${chartSection}
    //           `}
    //     </div>
    //   </div>
    // `

    // render result
    return html`
      <div class="${classMap({ dark: this.theme === 'dark' })} h-full">
        <div
          id="composed-chart"
          class=${`dark:text-neutral-100 text-neutral-950 h-full flex flex-col ${layer?.type === 'table' ? '' : 'p-5'} gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-925 group/actions`}
        >
          ${layer?.type === 'single_value'
            ? // Single value charts show the highlights at the bottom of the card
              html`${headerSection} ${chartSection} ${highlightSection}`
            : // All other charts show the highlights above the chart rendering
              html`<div class=${`${layer?.type === 'table' ? 'p-5' : ''}`}>${headerSection} ${highlightSection}</div>
                ${chartSection}`}
        </div>
      </div>
    `
  }
}
