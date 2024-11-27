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
  // Background color for the chart.
  @property({ type: String }) backgroundColor?: string
  // Text color for the chart.
  @property({ type: String }) textColor?: string

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties)

    if (changedProperties.has('backgroundColor') || changedProperties.has('textColor')) {
      const composedChartElement = this.renderRoot.querySelector('#composed-chart') as HTMLElement

      if (composedChartElement) {
        if (this.backgroundColor) {
          composedChartElement.style.setProperty('background-color', this.backgroundColor, 'important')
        } else {
          composedChartElement.style.removeProperty('background-color')
        }

        if (this.textColor) {
          composedChartElement.style.setProperty('color', this.textColor, 'important')
        } else {
          composedChartElement.style.removeProperty('color')
        }
      }
    }
  }

  public render() {
    // include header when large
    const headerSection = html`
      <div id="header" class="flex justify-between w-full">
        ${this.header || this.subheader
          ? html`
              <div id="header-labels" class="flex flex-col">
                ${this.header
                  ? html`<h1 class="text-xl dark:text-neutral-200 text-neutral-800 font-medium line-clamp-1">${this.header}</h1>`
                  : null}
                ${this.subheader
                  ? html`<h2 class="text-md text-neutral-600 dark:text-neutral-400 line-clamp-1">${this.subheader}</h2>`
                  : null}
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
                      ${isNaN(highlightPercentChange) ? 0 : highlightPercentChange}%
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
      class=${`h-full w-full flex-1 ${layer?.type === 'table' ? 'border-t border-[#d4d4d4] dark:border-[#404040] z-0' : ''}`}
    >
      ${showNoDataLabel
        ? html`<svg
                  width="32"
                  height="32"
                  stroke=${this.theme === 'dark' ? '#e5e5e5' : '#262626'}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <g transform-origin="center">
                        <circle
                            cx="12"
                            cy="12"
                            r="9.5"
                            fill="none"
                            stroke-width="1.5"
                            stroke-linecap="round"
                        >
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 12 12"
                                to="360 12 12"
                                dur="2s"
                                repeatCount="indefinite"
                            />

                            <animate
                                attributeName="stroke-dasharray"
                                values="0 150;42 150;42 150"
                                keyTimes="0;0.5;1"
                                dur="1.5s"
                                repeatCount="indefinite"
                            />

                            <animate
                                attributeName="stroke-dashoffset"
                                values="0;-16;-59"
                                keyTimes="0;0.5;1"
                                dur="1.5s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </g>
                </svg>`: html`${chart }`}
    </div>`

    // render result
    return html`
      <div class="${classMap({ dark: this.theme === 'dark' })} h-full w-full">
        <div
          id="composed-chart"
          class=${`dark:text-neutral-100 text-neutral-950 h-full flex flex-col ${layer?.type === 'table' ? '' : 'p-5'} gap-4 rounded-lg bg-white dark:bg-black group/actions`}
        >
          ${layer?.type === 'single_value'
            ? // Single value charts show the highlights at the bottom of the card
              html`${headerSection} ${chartSection}` // ${highlightSection} - Until more meaningful highlights are available, disabling for single value
            : // All other charts show the highlights above the chart rendering
              html`<div class=${`${layer?.type === 'table' ? 'p-5' : ''}`}>${headerSection} ${highlightSection}</div>
                ${chartSection}`}
        </div>
      </div>
    `
  }
}
