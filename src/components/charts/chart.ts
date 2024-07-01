import { areaY, barX, barY, crosshairX, dot, gridX, gridY, lineY, plot } from '@observablehq/plot'
import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import createGradient from '../../lib/create-gradient.js'
import type {
  ChartTypeV3,
  DashboardV3Chart,
  DashboardV3ChartLabelDisplayX,
  DashboardV3ChartLabelDisplayY,
  DashboardV3ChartLegend,
  DashboardV3ChartSortOrder,
  DashboardV3HighlightType,
} from '../../types.js'
import { ClassifiedElement } from '../classified-element.js'

const gradients = [
  createGradient('teal', [
    { offset: '15%', color: '#08595A' },
    { offset: '75%', color: '#08595A80' },
  ]),
  createGradient('mist', [
    { offset: '15%', color: '#707BFF' },
    { offset: '75%', color: '#D8E8FF' },
  ]),
  createGradient('mistGradient', [
    { offset: '15%', color: '#707BFF' },
    { offset: '75%', color: '#707BFF00' },
  ]),
  createGradient('bar', [
    { offset: '15%', color: '#e4e4e7' },
    { offset: '75%', color: '#d4d4d8' },
  ]),
]

@customElement('astra-chart')
export default class AstraChart extends ClassifiedElement {
  static override styles = [
    ...ClassifiedElement.styles,
    css`
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .fade {
        opacity: 0;

        @media (prefers-reduced-motion) {
          opacity: 1;
          animation: none;
        }
      }

      .gridDots {
        background-image: radial-gradient(RGBA(255, 255, 255, 0.2) 1px, transparent 0);
        background-size: 24px 24px;
        background-position: 0px 0px;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 0.5;
        }
      }

      @keyframes drawLine {
        from {
          opacity: 0;
          stroke-dashoffset: 3600;
        }
        to {
          opacity: 1;
          stroke-dashoffset: 0;
        }
      }

      figure {
        div {
          span {
            svg {
              border-radius: 24px;
              width: 20px;
              overflow: hidden;
            }
          }
        }
      }

      svg {
        font-size: 12px;

        g[aria-label='line'] {
          opacity: 0;
          // stroke-dasharray: 4000; // not working as intended; this is needed for the fancy loading animation tho
          transition-property: stroke-width;
          transition: 0.3s ease;
          animation: 1.5s ease-out 0s drawLine forwards;
        }

        // g[aria-label='area'] {
        //   opacity: 0;
        //   transition: 0.4s ease-out;
        // }

        [aria-label='y-axis tick label'],
        [aria-label='y-axis tick'],
        [aria-label='x-axis tick label'],
        [aria-label='x-axis tick'] {
          transition: 0.5s ease;
        }

        g[aria-label='crosshair rule'] {
          stroke-opacity: 0.3;
        }

        &:hover {
          /* [aria-label='line'] {
            stroke-width: 4;
          } */

          [aria-label='area'] {
            opacity: 0.5;
          }

          [aria-label='y-axis tick label'],
          [aria-label='y-axis tick'],
          [aria-label='x-axis tick label'],
          [aria-label='x-axis tick'] {
            opacity: 0.5;
          }
        }

        [aria-label='line']:hover {
          stroke-width: 4;
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scaleY(0.6) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scaleY(1) translateY(0px);
        }
      }

      .barY {
        g[aria-label='bar'] {
          rect {
            transform-origin: bottom;
            transform: scaleY(0.6) translateY(-20px);
            opacity: 0;
            animation: scaleIn 0.4s cubic-bezier(0.5, 0, 0, 1.1) forwards;
          }
        }
      }
    `,
  ]

  protected static async getChartData(apiKey: string, chartId: string): Promise<DashboardV3Chart> {
    if (!apiKey) throw new Error('Missing API key')
    if (!chartId) throw new Error('Missing chart ID')

    return fetch(`https://app.outerbase.com/api/v1/chart/${chartId}`, {
      method: 'POST',
      headers: {
        'x-chart-api-key': apiKey,
        'content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .catch((err) => {
        console.error('Outerbase Chart Error: Could not retrieve chart information. ', err)
      })
  }

  @property({ type: String, attribute: 'api-key' }) apiKey: string | undefined
  @property({ type: String, attribute: 'chart-id' }) chartId: string | undefined
  @property({ type: Array }) data?: DashboardV3Chart
  @property({ type: String }) type?: ChartTypeV3
  @property({ type: String }) highlights?: Array<DashboardV3HighlightType>

  // X-Axis
  @property({ type: String, attribute: 'key-x' }) keyX?: string
  @property({ type: String, attribute: 'axis-label-x' }) axisLabelX?: string
  @property({ type: String, attribute: 'axis-label-display-x' }) axisLabelDisplayX: DashboardV3ChartLabelDisplayX = 'auto'
  @property({ type: String, attribute: 'ticks-x' }) ticksX?: string
  @property({ type: Boolean, attribute: 'nice-x' }) niceX = false // if true (or a tick count), extend the domain to nice round values
  @property({ type: Boolean, attribute: 'grid-x' }) gridX?: boolean

  // Y-Axis
  @property({ type: String, attribute: 'key-y' }) keyY?: string
  @property({ type: String, attribute: 'axis-label-y' }) axisLabelY?: string
  @property({ type: String, attribute: 'axis-label-display-y' }) axisLabelDisplay?: DashboardV3ChartLabelDisplayY = 'left'
  @property({ type: String, attribute: 'ticks-y' }) ticksY?: string
  @property({ type: Boolean, attribute: 'nice-y' }) niceY?: boolean // if true (or a tick count), extend the domain to nice round values
  @property({ type: Boolean, attribute: 'grid-y' }) gridY?: boolean

  // Sorting & grouping
  @property({ type: String, attribute: 'sort-order' }) sortOrder?: DashboardV3ChartSortOrder
  @property({ type: String, attribute: 'group-by' }) groupBy?: string

  // Layout options: https://observablehq.com/plot/features/plots#layout-options
  // > The layout options determine the overall size of the plot; all are specified as numbers in pixels
  @property({ type: Number }) width?: number
  @property({ type: Number }) height?: number
  @property({ type: Number }) margin?: number
  @property({ type: Number, attribute: 'margin-top' }) marginTop?: number
  @property({ type: Number, attribute: 'margin-right' }) marginRight?: number
  @property({ type: Number, attribute: 'margin-bottom' }) marginBottom?: number
  @property({ type: Number, attribute: 'margin-left' }) marginLeft?: number

  // Color scales: https://observablehq.com/plot/features/scales#color-scales
  // > The default quantitative color scale type is linear, and the default scheme is turbo.
  @property({ type: String, attribute: 'color-type' }) colorType?: string
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: string

  // Position scale options: https://observablehq.com/plot/features/scales#position-scale-options
  // > The inset scale options can provide “breathing room” to separate marks from axes or the plot’s edge.
  @property({ type: Boolean }) round?: boolean // round the output value to the nearest integer (whole pixel)
  @property({ type: Number }) inset?: number // inset the default range by the specified amount in pixels
  @property({ type: Number, attribute: 'inset-top' }) insetTop?: number //  insets the top of the default range by the specified number of pixels
  @property({ type: Number, attribute: 'inset-right' }) insetRight?: number // insets the end of the default range by the specified number of pixels
  @property({ type: Number, attribute: 'inset-bottom' }) insetBottom?: number //  insets the bottom of the default range by the specified number of pixels
  @property({ type: Number, attribute: 'inset-left' }) insetLeft?: number // insets the start of the default range by the specified number of pixels

  // Other options: https://observablehq.com/plot/features/plots#other-options
  // > If the plot includes a title, subtitle, legend, or caption, plot wraps the SVG element with an HTML figure element.
  @property({ type: String, attribute: 'title' }) mainTitle?: string // `mainTitle` because `title` is a core HTML/JS attribute
  @property({ type: String }) subtitle?: string
  @property({ type: String }) caption?: string
  @property({ type: String }) legend?: DashboardV3ChartLegend

  // Quantitative scales
  @property({ type: Boolean }) clamp?: boolean // if true, clamp input values to the scale’s domain
  @property({ type: Boolean }) zero?: boolean // if true, extend the domain to include zero if needed
  @property({ type: Boolean }) percent?: boolean // if true, transform proportions in [0, 1] to percents in [0, 100]
  // TODO does percent apply to `x` or `y`?

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    // when apiKey or chartId change
    if (changedProperties.has('apiKey') || changedProperties.has('chartId')) {
      // when both values are present
      ;(async () => {
        if (this.apiKey && this.chartId) {
          this.data = await AstraChart.getChartData(this.apiKey, this.chartId)
        }
      })()
    }

    if (changedProperties.has('data')) {
      // update chart type
      this.type = this.data?.layers?.[0]?.type // TODO don't assume 1 layer
      this.highlights = this.data?.highlights
      // this.apiKey = this.data?.apiKey // <-- this will switch from using passed-in data to making API requests

      const options = this.data?.options
      if (options) {
        this.legend = options.legend
        this.axisLabelX = options.xAxisLabel
        this.axisLabelY = options.yAxisLabel
        this.keyX = options.xAxisKey
        this.keyY = options.yAxisKeys?.[0] // TODO don't assume 1
        this.sortOrder = options.sortOrder
        this.percent = options.percentage
        // TODO xAxisLabelDisplay, yAxisLabelDisplay, groupBy
      }
    }
  }

  private getLatestPlot() {
    const layer = this.data?.layers?.[0] // TODO don't assume 1 layer
    if (!layer) return null

    const d = layer.result
    if (!d) return null

    const defaultGridStyle = { strokeDasharray: '2', strokeOpacity: 0.2, stroke: this.theme === 'light' ? 'black' : 'white' }

    const options: Record<string, any> = {
      // Layout options: https://observablehq.com/plot/features/plots#layout-options
      width: this.width,
      height: this.height,
      margin: this.margin,
      marginTop: this.marginTop,
      marginRight: this.marginRight,
      marginBottom: this.marginBottom,
      marginLeft: this.marginLeft,

      round: this.round,

      // Other options: https://observablehq.com/plot/features/plots#other-options
      title: this.mainTitle,
      subtitle: this.subtitle,
      caption: this.caption,

      // Scale options
      inset: this.inset,
      color: { type: this.colorType, scheme: this.colorScheme, legend: this.legend },
      symbol: { legend: this.legend },

      // Marks option: https://observablehq.com/plot/features/plots#marks-option
      marks: [],
    }

    const tip = {
      fill: this.theme === 'dark' ? 'RGBA(24,24,27,1)' : 'RGBA(231,231,228,1)',
      stroke: 'RGBA(255,255,255,0.1)',
      textPadding: 10,
      lineHeight: 1.5,
    }

    // TYPE: BAR
    if (this.type === 'bar') {
      // include grid along X-axis unless explicitly disabled
      if (this.gridX !== false) {
        options.marks.push(gridX(defaultGridStyle))
      }

      options.marks.push(
        barX(d, {
          x: this.keyX,
          y: this.keyY,
          // stroke: this.keyX,
          // fill: 'url(#teal)',
          tip,
        })
      )
    }

    // TYPE: COLUMN
    if (this.type === 'column') {
      // include grid along Y-axis unless explicitly disabled
      if (this.gridY !== false) {
        options.marks.push(gridY(defaultGridStyle))
      }

      options.marks.push(
        barY(d, {
          x: this.keyX,
          y: this.keyY,
          // stroke: this.keyY,
          fill: 'url(#bar)',
          inset: 0.5,
          tip,
        })
      )
    }

    // TYPE: LINE
    if (this.type === 'line') {
      // include grid along X-axis unless explicitly disabled
      if (this.gridX !== false) {
        options.marks.push(gridX(defaultGridStyle))
      }

      options.marks.push(
        crosshairX(d, {
          x: this.keyX,
          // y: this.keyY, // omitted in Ficus
          color: this.theme === 'dark' ? '#ffffff' : '#000000',
          textStrokeOpacity: 0,
          textFill: '#e4e4e7',
        }),

        // areaY(d, {
        //   x: this.keyX,
        //   y: this.keyY,
        //   fill: 'url(#mistGradient)',
        //   fillOpacity: 0.2,
        // }),

        lineY(d, { x: this.keyX, y: this.keyY, stroke: 'url(#mist)', tip })
      )

      // default to `nice` less explicitly set to false
      if (this.niceY !== false) this.niceY = true

      options.color.legend = true
      options.color.scheme = 'purples'
    }

    if (this.type === 'scatter') {
      options.marks.push(
        dot(d, {
          x: this.keyX,
          y: this.keyY,
        })
      )
    }

    if (this.type === 'area') {
      options.marks.push(
        areaY(d, {
          x: this.keyX,
          y: this.keyY,
          fill: 'url(#mistGradient)',
          // fillOpacity: 0.2,
        })
      )
    }

    // LABELS
    options.x = { ...options.x, label: this.axisLabelX ?? null, ticks: this.ticksX, nice: this.niceX, padding: 0.3 }
    options.y = { ...options.y, label: this.axisLabelY ?? null, ticks: this.ticksY, nice: this.niceY }

    // render and append the plot
    return plot(options)
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    const elements = this.shadowRoot!.querySelectorAll('rect')
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.animationDelay = `${i / 50}s`
    }
  }

  public render() {
    let plot: any

    if (this.type === 'table') {
      const firstRecord = this.data?.layers?.[0].result?.[0]?.originalValues
      let schema
      if (firstRecord) {
        schema = { columns: Object.keys(firstRecord).map((k) => ({ name: k })) }
      }

      plot = html`<astra-table
        schema=${JSON.stringify(schema)}
        data="${JSON.stringify(this.data?.layers?.[0].result)}"
        theme="light"
        keyboard-shortcuts
        selectable-rows
        outer-border
        blank-fill
      ></astra-table>`
    } else if (this.type === 'single_value') {
      plot = html`<astra-text variant="h1">single_value</astra-text>`
    } else if (this.type === 'text') {
      plot = html`<astra-text variant="h1">text</astra-text>`
    } else plot = this.getLatestPlot()

    const decoratedPlot = html`<div class="bg-zinc-50 selection:bg-violet-500/20 dark:bg-zinc-950 text-zinc-400 dark:text-zinc-600">
      ${plot}
    </div>`
    const themedPlot = html`<div class="${classMap({ dark: this.theme === 'dark', '*:fade barY *:animate-fade': true })}">
      ${decoratedPlot}
    </div>`

    return html`${gradients} ${themedPlot}`
  }
}
