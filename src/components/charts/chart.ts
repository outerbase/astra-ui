import * as echarts from 'echarts'
import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type {
  ChartTypeV3,
  DashboardV3Chart,
  DashboardV3ChartLabelDisplayX,
  DashboardV3ChartLabelDisplayY,
  DashboardV3ChartLegend,
  DashboardV3ChartSortOrder,
  DashboardV3HighlightType,
  Row,
} from '../../types.js'
import { ClassifiedElement } from '../classified-element.js'

const iridiumValues = ['#87E9C0', '#B9D975', '#C9D69B']
const celestialValues = ['#D1FFFF', '#93FDFF', '#1A9EF5']
const cobaltValues = ['#5956E2', '#A99AFF', '#82DBFF']
const afterburnValues = ['#E75F98', '#FFA285', '#CCB8F2']
const mercuryValuesDark = ['#fafafa', '#525252', '#a3a3a3', '#e5e5e5', '#262626']
const mercuryValuesLight = ['#0a0a0a', '#a3a3a3', '#525252', '#262626', '#e5e5e5']

type SeriesData = { data: Row[]; legend: { domain: any[]; range: any[] } }

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

      g[aria-label='tip'] {
        g {
          path {
            filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.05));
          }
        }
      }

      svg {
        font-size: 12px;

        g[aria-label='line'] {
          opacity: 0;
          transition-property: stroke-width;
          transition: 0.3s ease;
          animation: 1.5s ease-out 0s drawLine forwards;
        }

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
  @property({ type: Object }) data?: DashboardV3Chart
  @property({ type: String }) type?: ChartTypeV3
  @property({ type: Array }) highlights?: Array<DashboardV3HighlightType>

  // X-Axis
  @property({ type: String, attribute: 'key-x' }) keyX?: string
  @property({ type: String, attribute: 'axis-label-x' }) axisLabelX?: string
  @property({ type: String, attribute: 'axis-label-display-x' }) axisLabelDisplayX: DashboardV3ChartLabelDisplayX = 'auto'
  @property({ type: String, attribute: 'ticks-x' }) ticksX?: string
  @property({ type: Boolean, attribute: 'nice-x' }) niceX = false // if true (or a tick count), extend the domain to nice round values
  @property({ type: Boolean, attribute: 'grid-x' }) gridX?: boolean
  @property({ type: String, attribute: 'label-x' }) labelX: string | null = null

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

  // new props for echarts
  @property({ type: Array }) colorValues = this.theme === 'dark' ? mercuryValuesDark : mercuryValuesLight
  @property({ type: Number }) sizeX?: number
  @property({ type: Number }) sizeY?: number
  @property({ type: Array }) columns: string[] = []
  @property({ type: String }) title: string = ''
  @property({ type: String }) xAxisLabel: string = ''
  @property({ type: String }) yAxisLabel: string = ''
  @property({ type: String }) colorTheme: string = 'mercury' // 'mercury', 'iridium', etc.

  @query('#chart') private chartDiv!: HTMLDivElement

  private chartInstance?: echarts.ECharts
  private resizeObserver?: ResizeObserver

  override willUpdate(changedProperties: PropertyValueMap<this>): void {
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
        this.axisLabelX = options.xAxisLabel
        this.axisLabelY = options.yAxisLabel
        this.keyX = options.xAxisKey
        this.keyY = options.yAxisKeys?.[0] // TODO don't assume 1
        this.sortOrder = options.sortOrder
        this.groupBy = options.groupBy

        if (options.xAxisLabelDisplay) {
          this.axisLabelDisplayX = options.xAxisLabelDisplay
        }

        if (options.yAxisLabelDisplay) {
          this.axisLabelDisplay = options.yAxisLabelDisplay
        }

        if (options?.theme === 'iridium') {
          this.colorValues = this.theme === 'dark' ? iridiumValues : iridiumValues
        } else if (options?.theme === 'celestial') {
          this.colorValues = this.theme === 'dark' ? celestialValues : celestialValues
        } else if (options?.theme === 'cobalt') {
          this.colorValues = this.theme === 'dark' ? cobaltValues : cobaltValues
        } else if (options?.theme === 'afterburn') {
          this.colorValues = this.theme === 'dark' ? afterburnValues : afterburnValues
        } else {
          this.colorValues = this.theme === 'dark' ? mercuryValuesDark : mercuryValuesLight
        }
      }
    }
  }

  override firstUpdated(_changedProperties: PropertyValueMap<this>) {
    super.firstUpdated(_changedProperties)
    this.initializeChart()

    // Observe size changes
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize()
        // Update chart options to adjust labels and ticks
        const options = this.getChartOptions()
        this.chartInstance.setOption(options)
      }
    })
    if (this.chartDiv) {
      this.resizeObserver.observe(this.chartDiv)
    }
  }

  override updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.updated(_changedProperties)

    if (
      _changedProperties.has('data') ||
      _changedProperties.has('type') ||
      _changedProperties.has('columns') ||
      _changedProperties.has('xAxisLabel') ||
      _changedProperties.has('yAxisLabel')
    ) {
      if (this.chartInstance) {
        const options = this.getChartOptions()
        this.chartInstance.setOption(options, true)
      }
    }

    if (_changedProperties.has('theme') || _changedProperties.has('colorTheme')) {
      this.applyTheme()
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback()

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    super.disconnectedCallback()
  }

  override render() {
    let plot: any

    if (this.type === 'table') {
      const firstRecord = this.data?.layers?.[0].result?.[0]
      let schema
      if (firstRecord) {
        schema = { columns: Object.keys(firstRecord).map((k) => ({ name: k })) }
      }

      return html`<astra-table
        schema=${JSON.stringify(schema)}
        data="${JSON.stringify(
          this.data?.layers?.[0].result?.map((r) => {
            return {
              id: Math.random(),
              values: r,
              originalValues: r,
              isNew: false,
              isDeleted: false,
            }
          }) ?? []
        )}"
        theme=${this.theme}
        blank-fill
        border-b
        read-only
      ></astra-table>`
    }

    return html`<div id="chart"></div>`
  }

  private initializeChart() {
    if (!this.chartDiv) return

    if (this.chartInstance) {
      this.chartInstance.dispose()
    }

    this.chartInstance = echarts.init(this.chartDiv, undefined, { renderer: 'canvas' })

    const options = this.getChartOptions()

    this.chartInstance.setOption(options)
  }

  private labelFormatter(value: any) {
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      // The value is an ISO 8601 date string
      const date = new Date(value)
      // Format the date as desired, for example, using toLocaleDateString
      return date.toLocaleDateString() // Customize this to your preferred format
    } else if (typeof value === 'string' && value.length > 42) {
      return value.substring(0, 42) + '...' // Truncate long string labels
    }
    return value // Return the value as-is if it's not a long string or date string
  }

  private getChartOptions() {
    const colorValues = this.getColorValues()
    const options: echarts.EChartsOption = {
      backgroundColor: this.theme === 'dark' ? '#121212' : '#FFFFFF',
      title: {
        text: this.title,
        textStyle: {
          color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
        },
        left: 'center',
      },
      tooltip: {
        trigger: this.type === 'scatter' ? 'item' : 'axis',
      },
      legend: {
        data: this.columns.slice(1),
        textStyle: {
          color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
        },
        top: '10%',
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.data?.layers?.[0]?.result
          ?.map((item) => {
            const value = item[this.columns[0]]
            // Convert the value to a string, as string categories are well-supported
            if (value !== null && value !== undefined) {
              if (typeof value === 'object' && value instanceof Date) {
                return value.toISOString() // Convert Dates to ISO strings
              }
              if (typeof value === 'object') {
                return JSON.stringify(value) // Convert complex objects to strings if needed
              }
              return String(value)
            }

            return undefined // Returning undefined allows it to be filtered out
          })
          .filter((item) => item !== undefined), // Filter out undefined values
        name: this.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
        },
        axisLine: {
          lineStyle: {
            color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
          },
        },
        axisLabel: {
          formatter: this.labelFormatter,
          color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
          hideOverlap: true,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        name: this.yAxisLabel,
        nameTextStyle: {
          color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
        },
        axisLine: {
          lineStyle: {
            color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
          },
        },
        axisLabel: {
          formatter: this.labelFormatter,
          color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
        },
      },
      series: [],
      color: colorValues,
    }

    switch (this.type) {
      case 'bar':
        options.series = this.constructBarSeries()
        break
      case 'line':
        options.series = this.constructLineSeries()
        break
      case 'scatter':
        options.series = this.constructScatterSeries()
        break
      case 'area':
        options.series = this.constructAreaSeries()
        break
      default:
        break
    }

    return options
  }

  private getColorValues() {
    switch (this.colorTheme) {
      case 'iridium':
        return iridiumValues
      case 'celestial':
        return celestialValues
      case 'cobalt':
        return cobaltValues
      case 'afterburn':
        return afterburnValues
      default:
        return this.theme === 'dark' ? mercuryValuesDark : mercuryValuesLight
    }
  }

  private constructBarSeries(): echarts.BarSeriesOption[] {
    return createSeries<echarts.BarSeriesOption>('bar', this.data?.layers?.[0]?.result ?? [], this.columns, {
      animationDelay: (idx: number) => idx * 100,
    })
  }

  private constructLineSeries(): echarts.LineSeriesOption[] {
    return createSeries<echarts.LineSeriesOption>('line', this.data?.layers?.[0]?.result ?? [], this.columns, {
      showSymbol: false,
      animationDuration: 1500,
      animationEasing: 'cubicOut',
    })
  }

  private constructScatterSeries(): echarts.ScatterSeriesOption[] {
    return createSeries<echarts.ScatterSeriesOption>('scatter', this.data?.layers?.[0]?.result ?? [], this.columns)
  }

  private constructAreaSeries(): echarts.LineSeriesOption[] {
    return createSeries<echarts.LineSeriesOption>('line', this.data?.layers?.[0]?.result ?? [], this.columns, {
      areaStyle: {},
      smooth: true,
    })
  }

  private applyTheme() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.initializeChart()
    }
  }
}

// Generic utility function to create series with specific type
function createSeries<T extends echarts.SeriesOption>(
  seriesType: T['type'],
  data: Row[],
  columns: string[],
  additionalOptions: Omit<T, 'type' | 'data'> = {} as Omit<T, 'type' | 'data'>
): T[] {
  const baseData = data.map((item) => safelyConvertToNumber(item[columns[0]])).filter((value) => value !== undefined) as number[]

  return columns.slice(1).map((col) => ({
    name: col,
    type: seriesType,
    data: data.map((item) => ({
      value: item[col],
      name: item[columns[0]], // Assuming columns[0] is the category/label name
    })),
    ...additionalOptions,
  })) as T[]
}
