import * as echarts from 'echarts'
import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type {
  ChartTypeV3,
  DashboardV3Chart,
  DashboardV3ChartLabelDisplayX,
  DashboardV3ChartLabelDisplayY,
  DashboardV3ChartSortOrder,
  Row,
} from '../../types.js'
import { ClassifiedElement } from '../classified-element.js'

const iridiumValues = ['#87E9C0', '#B9D975', '#C9D69B']
const celestialValues = ['#D1FFFF', '#93FDFF', '#1A9EF5']
const cobaltValues = ['#5956E2', '#A99AFF', '#82DBFF']
const afterburnValues = ['#E75F98', '#FFA285', '#CCB8F2']
const mercuryValuesDark = ['#fafafa', '#525252', '#a3a3a3', '#e5e5e5', '#262626']
const mercuryValuesLight = ['#0a0a0a', '#a3a3a3', '#525252', '#262626', '#e5e5e5']

type ThemeColors = 'mercury' | 'iridium' | 'celestial' | 'cobalt' | 'afterburn'

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

    try {
      const response = await fetch(`https://app.outerbase.com/api/v1/chart/${chartId}`, {
        method: 'POST',
        headers: {
          'x-chart-api-key': apiKey,
          'content-type': 'application/json',
        },
      })
      return response.json()
    } catch (err) {
      console.error('Outerbase Chart Error: Could not retrieve chart information. ', err)
      throw err // Rethrow if you want the calling function to handle it
    }
  }

  @property({ type: String, attribute: 'api-key' }) apiKey?: string
  @property({ type: String, attribute: 'chart-id' }) chartId?: string
  @property({ type: Object }) data?: DashboardV3Chart
  @property({ type: String }) type?: ChartTypeV3

  // X-Axis
  @property({ type: String, attribute: 'key-x' }) keyX?: string
  @property({ type: String, attribute: 'axis-label-x' }) axisLabelX?: string
  @property({ type: String, attribute: 'axis-label-display-x' }) axisLabelDisplayX: DashboardV3ChartLabelDisplayX = 'auto'
  @property({ type: String, attribute: 'ticks-x' }) ticksX?: string
  @property({ type: Boolean, attribute: 'nice-x' }) niceX = false
  @property({ type: Boolean, attribute: 'grid-x' }) gridX?: boolean
  @property({ type: String, attribute: 'label-x' }) labelX: string | null = null

  // Y-Axis
  @property({ type: String, attribute: 'key-y' }) keyY?: string
  @property({ type: String, attribute: 'axis-label-y' }) axisLabelY?: string
  @property({ type: String, attribute: 'axis-label-display-y' }) axisLabelDisplay?: DashboardV3ChartLabelDisplayY = 'left'

  // Sorting & grouping
  @property({ type: String, attribute: 'sort-order' }) sortOrder?: DashboardV3ChartSortOrder
  @property({ type: String, attribute: 'group-by' }) groupBy?: string

  // new props for echarts
  @property({ type: Array }) colorValues: string[] = this.theme === 'dark' ? mercuryValuesDark : mercuryValuesLight
  @property({ type: Array }) columns: string[] = []
  @property({ type: String }) title = ''
  @property({ type: String }) xAxisLabel = ''
  @property({ type: String }) yAxisLabel = ''
  @property({ type: String }) colorTheme: ThemeColors = 'mercury'

  @query('#chart') private chartDiv!: HTMLDivElement

  private chartInstance?: echarts.ECharts
  private resizeObserver?: ResizeObserver

  override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    if (changedProperties.has('keyX') || changedProperties.has('keyY')) {
      this.columns = [this.keyX ?? '', this.keyY ?? '']
    }

    if (changedProperties.has('apiKey') || changedProperties.has('chartId')) {
      this.updateChartData()
    }

    if (changedProperties.has('data')) {
      this.updateDataOptions()
    }
  }

  override firstUpdated(_changedProperties: PropertyValueMap<this>) {
    super.firstUpdated(_changedProperties)

    this.initializeChart()
    this.setupResizeObserver()
  }

  override updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.updated(_changedProperties)

    if (
      _changedProperties.has('data') ||
      _changedProperties.has('type') ||
      _changedProperties.has('xAxisLabel') ||
      _changedProperties.has('yAxisLabel') ||
      _changedProperties.has('columns')
    ) {
      if (this.chartInstance) {
        this.chartInstance.setOption(this.getChartOptions(), true)
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
  }

  override render() {
    if (this.type === 'table') {
      return this.renderTable()
    }

    return html`<div id="chart"></div>`
  }

  private renderTable() {
    const firstRecord = this.data?.layers?.[0]?.result?.[0]
    const schema = firstRecord ? { columns: Object.keys(firstRecord).map((name) => ({ name })) } : undefined

    return html`<astra-table
      .schema=${JSON.stringify(schema)}
      .data=${JSON.stringify(this.data?.layers?.[0].result?.map(this.transformResult) ?? [])}
      .theme=${this.theme}
      blank-fill
      border-b
      read-only
    ></astra-table>`
  }

  private initializeChart() {
    if (!this.chartDiv) return

    if (this.chartInstance) {
      this.chartInstance.dispose()
    }

    this.chartInstance = echarts.init(this.chartDiv, undefined, { renderer: 'canvas' })
    this.chartInstance.setOption(this.getChartOptions())
  }

  private labelFormatter(value: unknown): string {
    if (typeof value === 'string') {
      if (!isNaN(Date.parse(value))) {
        return new Date(value).toLocaleDateString()
      } else if (value.length > 42) {
        return value.substring(0, 42) + '...'
      }
    }
    return String(value)
  }

  private getChartOptions(): echarts.EChartsOption {
    const colorValues = this.getColorValues()
    const datasetSource = this.data?.layers?.[0]?.result ?? []

    const formattedSource: Record<string, unknown>[] = datasetSource.map((item) =>
      this.columns.reduce(
        (acc, column) => {
          acc[column] = item[column]
          return acc
        },
        {} as Record<string, unknown>
      )
    )

    const options: echarts.EChartsOption = {
      backgroundColor: this.getBackgroundColor(),
      title: {
        text: this.title,
        textStyle: {
          color: this.getTextColor(),
        },
        left: 'center',
      },
      dataset: {
        dimensions: this.columns,
        source: formattedSource,
      },
      tooltip: {
        trigger: this.type === 'scatter' ? 'item' : 'axis',
      },
      legend: {
        data: this.columns.slice(1),
        textStyle: {
          color: this.getTextColor(),
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
        name: this.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: this.getTextColor(),
        },
        axisLine: {
          lineStyle: {
            color: this.getTextColor(),
          },
        },
        axisLabel: {
          formatter: (value) => this.labelFormatter(value),
          color: this.getTextColor(),
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
          color: this.getTextColor(),
        },
        axisLine: {
          lineStyle: {
            color: this.getTextColor(),
          },
        },
        axisLabel: {
          formatter: (value) => this.labelFormatter(value),
          color: this.getTextColor(),
        },
      },
      series: [],
      color: colorValues,
    }

    this.addSeries(options, formattedSource) // Pass the source dataset when adding series

    return options
  }

  private getColorValues(): string[] {
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

  private applyTheme() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.initializeChart()
    }
  }

  private updateChartData() {
    if (this.apiKey && this.chartId) {
      AstraChart.getChartData(this.apiKey, this.chartId).then((data) => {
        this.data = data
      })
    }
  }

  private updateDataOptions() {
    this.type = this.data?.layers?.[0]?.type
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize()
        this.chartInstance.setOption(this.getChartOptions())
      }
    })

    if (this.chartDiv) {
      this.resizeObserver.observe(this.chartDiv)
    }
  }

  private transformResult(r: Row) {
    return {
      id: Math.random(),
      values: r,
      originalValues: r,
      isNew: false,
      isDeleted: false,
    }
  }

  private getBackgroundColor(): string {
    return this.theme === 'dark' ? '#121212' : '#FFFFFF'
  }

  private getTextColor(): string {
    return this.theme === 'dark' ? '#FFFFFF' : '#000000'
  }

  private addSeries(options: echarts.EChartsOption, datasetSource: Record<string, unknown>[]) {
    switch (this.type) {
      case 'bar':
        options.series = this.constructSeries<echarts.BarSeriesOption>('bar', { animationDelay: (idx) => idx * 100 })
        break
      case 'line':
        options.series = this.constructSeries<echarts.LineSeriesOption>('line', {
          showSymbol: false,
          animationDuration: 1500,
          animationEasing: 'cubicOut',
        })
        break
      case 'scatter':
        options.series = this.constructSeries<echarts.ScatterSeriesOption>('scatter')
        break
      case 'area':
        options.series = this.constructSeries<echarts.LineSeriesOption>('line', {
          areaStyle: {},
          smooth: true,
        })
        break
      case 'column':
        options.series = this.constructSeries<echarts.BarSeriesOption>('bar', {
          animationDelay: (idx) => idx * 100,
          barWidth: '40%',
          coordinateSystem: 'cartesian2d',
        })
        options.xAxis = {
          type: 'value',
          name: this.yAxisLabel,
          nameTextStyle: {
            color: this.getTextColor(),
          },
          axisLine: {
            lineStyle: {
              color: this.getTextColor(),
            },
          },
          axisLabel: {
            formatter: (value) => this.labelFormatter(value),
            color: this.getTextColor(),
          },
        }
        options.yAxis = {
          type: 'category',
          name: this.xAxisLabel,
          nameTextStyle: {
            color: this.getTextColor(),
          },
          axisLine: {
            lineStyle: {
              color: this.getTextColor(),
            },
          },
          axisLabel: {
            formatter: (value) => this.labelFormatter(value),
            color: this.getTextColor(),
          },
          data: datasetSource.map((item: Record<string, unknown>) => item[this.columns[0]] as string),
        }
        break
      default:
        break
    }
  }

  private constructSeries<T extends echarts.SeriesOption>(
    seriesType: T['type'],
    additionalOptions: Partial<Omit<T, 'type' | 'data'>> = {}
  ): T[] {
    return this.columns.slice(1).map((col) => {
      const baseSeries = {
        name: col,
        type: seriesType,
        encode:
          this.type === 'column'
            ? { x: col, y: this.columns[0] } // For column charts
            : { x: this.columns[0], y: col }, // For other chart types
        ...additionalOptions,
      }

      if (this.isValidSeriesOption<T>(baseSeries)) {
        return baseSeries as unknown as T
      } else {
        throw new Error(`The series option is invalid for series type "${seriesType}".`)
      }
    })
  }

  private isValidSeriesOption<T extends echarts.SeriesOption>(series: any): series is T {
    return series && typeof series === 'object' && typeof series.name === 'string' && typeof series.type === 'string'
  }
}
