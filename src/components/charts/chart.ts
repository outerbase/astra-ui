import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { THEMES, type ChartTypeV3, type DashboardV3Chart, type DashboardV3ChartSortOrder, type Row, type ThemeColors } from '../../types.js'
import { ClassifiedElement } from '../classified-element.js'

// import * as echarts from 'echarts'
import { BarChart, FunnelChart, HeatmapChart, LineChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts'
import { DatasetComponent, LegendComponent, TitleComponent, TooltipComponent, TransformComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type {
  BarSeriesOption,
  EChartsOption,
  FunnelSeriesOption,
  LineSeriesOption,
  ScatterSeriesOption,
  SeriesOption,
  PieSeriesOption,
  XAXisOption,
} from 'echarts/types/dist/shared'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { isDate } from '../../lib/format-date.js'

// Register the required components
echarts.use([
  CanvasRenderer,
  BarChart,
  HeatmapChart,
  LineChart,
  ScatterChart,
  DatasetComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
  PieChart,
  RadarChart,
  FunnelChart,
])

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
  @property({ type: String, attribute: 'key-x' }) keyX?: string
  @property({ type: String, attribute: 'key-y' }) keyY?: string | string[]

  // Sorting & grouping
  @property({ type: String, attribute: 'sort-order' }) sortOrder?: DashboardV3ChartSortOrder
  @property({ type: String, attribute: 'group-by' }) groupBy?: string

  // new props for echarts
  @property({ type: Array }) columns: string[] = []
  @property({ type: String }) title = ''
  @property({ type: String }) xAxisLabel = ''
  @property({ type: String }) yAxisLabel = ''
  @property({ type: Number }) xAxisLabelDisplay = 0
  @property({ type: String, attribute: 'y-axis-label-display' }) yAxisLabelDisplay: 'hidden' | 'left' | 'right' = 'left'
  @property({ type: Boolean, attribute: 'hide-x-axis-label' }) hideXAxisLabel = false
  @property({ type: String, attribute: 'color' }) colorTheme: ThemeColors = 'mercury'
  @property({ type: Object, attribute: 'y-axis-colors' }) yAxisColors?: Record<string, string | undefined> = {}
  @property({ type: Boolean, attribute: 'omit-legend' }) omitLegend = false

  // grid sizing
  @property({ type: Number }) sizeX?: number
  @property({ type: Number }) sizeY?: number
  @property({ type: Number }) chartWidth?: number
  @property({ type: Number }) chartHeight?: number

  @property({ type: Number, attribute: 'min-y' }) minY?: number
  @property({ type: Number, attribute: 'max-y' }) maxY?: number
  @property({ type: Number, attribute: 'min-x' }) minX?: number
  @property({ type: Number, attribute: 'max-x' }) maxX?: number

  @query('#chart') private chartDiv!: HTMLDivElement

  private chartInstance?: echarts.ECharts
  private resizeObserver?: ResizeObserver

  override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    if (changedProperties.has('keyX') || changedProperties.has('keyY')) {
      const _y = typeof this.keyY === 'string' ? [this.keyY] : (this.keyY ?? [''])
      this.columns = [this.keyX ?? '', ..._y]
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

    if (this.type === 'single_value') {
      return this.renderAsSingleValue()
    }

    if (this.type === 'text') return this.renderAsText()

    return html`<div id="chart" class="h-full w-full"></div>`
  }

  private renderTable() {
    const firstRecord = this.data?.layers?.[0]?.result?.[0]
    const schema = firstRecord ? { columns: Object.keys(firstRecord).map((name) => ({ name })) } : undefined

    return html`<div class="flex-1 self-start relative h-full w-full z-0">
      <astra-table
        .schema=${schema}
        .data=${this.data?.layers?.[0]?.result?.map(this.transformResult) ?? []}
        .theme=${this.theme}
        blank-fill
        border-b
        read-only
      ></astra-table>
    </div>`
  }

  private initializeChart() {
    if (!this.chartDiv) return

    if (this.chartInstance) {
      this.chartInstance.dispose()
    }

    this.chartInstance = echarts.init(this.chartDiv, undefined, { renderer: 'canvas' })
    this.chartInstance.setOption(this.getChartOptions())
  }

  // private labelFormatter(value: unknown): string {
  //   if (typeof value !== 'string') return String(value)
  //   return value.length > 32 ? value.substring(0, 32) + '...' : value
  // }

  private getChartOptions(): EChartsOption {
    const colorValues = this.getColorValues()
    const datasetSource = this.data?.layers?.[0]?.result ?? []

    // Transform the datasetSource into a format suitable for eCharts by mapping over each item
    // and reducing columns to a record with column names as keys and corresponding item values.
    const formattedSource: Record<string, unknown>[] = datasetSource.map((item) =>
      this.columns.reduce(
        (acc, column) => {
          acc[column] = item[column]
          return acc
        },
        {} as Record<string, unknown>
      )
    )
    const isTall = (this.chartHeight ?? 0) > 150
    const gridLineColors = this.theme === 'dark' ? '#FFFFFF08' : '#00000010'
    const axisLineColors = this.theme === 'dark' ? '#FFFFFF15' : '#00000020'

    // Determine if the X axis data is a date
    const isXAxisDate = !!(this.columns[0] && formattedSource.some((item) => isDate(item[this.columns[0]] as string)))
    const isYAxisDate = !!(this.columns[1] && formattedSource.some((item) => isDate(item[this.columns[1]] as string)))

    if (this.type === 'radar') {
      return {
        radar: {
          shape: 'polygon',
          indicator: this.columns.map((name) => ({ name })),
        },
        series: [
          {
            // name: '',
            type: 'radar',
            data:
              // e.g. data
              // {
              //   value: [5000, 14000, 28000, 26000, 42000, 21000],
              //   name: 'Actual Spending',
              // },
              //
              //
              // Extract real data for radar chart
              // Each object corresponds to a column and contains an array of flattened values
              this.columns.map((col) => ({
                value: formattedSource.map((item) => Number(item[col])),
                name: col,
              })),
          },
        ],
      }
    }

    const options: EChartsOption = {
      // backgroundColor: this.getBackgroundColor(),
      dataset: {
        dimensions: this.columns,
        source: formattedSource,
      },
      tooltip: {
        trigger: this.type === 'scatter' ? 'item' : 'axis',
        borderColor: gridLineColors, // fix issue where 'item' tooltips were a different color than the rest (maybe it matched the series color)
      },
      legend: {
        show: !this.omitLegend && isTall,
        data: this.columns.slice(1),
        textStyle: {
          color: this.getTextColor(),
        },
        top: 8,
        orient: 'horizontal',
        type: 'scroll', // Enable scrolling if too many items
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: isTall ? '15%' : '15%',
        top: isTall ? '20%' : '20%', // Increased from 15% to 20%
        containLabel: true,
      },
      xAxis: {
        show: !this.hideXAxisLabel,
        type: this.type === 'bar' ? 'value' : isXAxisDate ? 'time' : 'category',
        // type: 'category',
        name: isTall ? this.xAxisLabel : '',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: this.getTextColor(),
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: axisLineColors,
          },
        },
        axisLabel: {
          // formatter: (value) => this.labelFormatter(value),
          color: this.getTextColor(),
          hideOverlap: true,
          rotate: this.xAxisLabelDisplay,
          align: 'center',
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: gridLineColors,
          },
        },
        min: this.minX,
        max: this.maxX,
      },
      yAxis: {
        type: this.type === 'bar' ? (isXAxisDate ? 'time' : 'category') : isYAxisDate ? 'time' : 'value',
        name: isTall ? this.yAxisLabel : '',
        show: this.yAxisLabelDisplay !== 'hidden',
        position: (this.yAxisLabelDisplay !== 'hidden' && this.yAxisLabelDisplay) || undefined, // exclude `hidden`, pass left/right
        nameTextStyle: {
          color: this.getTextColor(),
          align: 'left',
          padding: [0, 0, 0, 0],
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: axisLineColors,
          },
        },
        axisLabel: {
          // formatter: (value) => this.labelFormatter(value),
          color: this.getTextColor(),
          align: 'right',
          inside: false,
        },
        axisTick: {
          inside: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: gridLineColors,
          },
        },
        min: this.minY,
        max: this.maxY,
      },
      color: colorValues,
    }

    return this.addSeries(options) // Pass the source dataset when adding series
  }

  private getColorValues(): string[] {
    return this.theme === 'dark' ? THEMES[this.colorTheme].colors.dark : THEMES[this.colorTheme].colors.light
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
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.chartDiv) {
          const { width, height } = entry.contentRect
          this.chartWidth = width
          this.chartHeight = height

          if (this.chartInstance) {
            this.chartInstance.resize()
            this.chartInstance.setOption(this.getChartOptions())
          }
        }
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

  // private getBackgroundColor(): string {
  //   return THEMES[this.colorTheme].background
  // }

  private getTextColor(): string {
    return this.theme === 'dark' ? '#FFFFFF' : '#000000'
  }

  private addSeries(_options: EChartsOption) {
    const options = { ..._options }

    switch (this.type) {
      case 'column':
        options.series = this.constructSeries<BarSeriesOption>('bar', { animationDelay: (idx) => idx * 10 })
        break
      case 'line':
        options.series = this.constructSeries<LineSeriesOption>('line', {
          showSymbol: false,
          animationDuration: 1000,
          animationEasing: 'cubicOut',
        })
        break
      case 'scatter':
        options.series = this.constructSeries<ScatterSeriesOption>('scatter', {
          symbolSize: 8,
          itemStyle: {
            borderWidth: 2,
            borderColor: this.getTextColor(),
            color: 'transparent', // Make the fill transparent
          },
        })
        break
      case 'area':
        options.series = this.constructSeries<LineSeriesOption>('line', {
          areaStyle: {},
          smooth: true,
        })
        break
      case 'bar':
        options.series = this.constructSeries<BarSeriesOption>('bar', {
          animationDelay: (idx) => idx * 10,
          barWidth: '40%',
          coordinateSystem: 'cartesian2d',
        })
        options.xAxis = {
          ...options.xAxis,

          // Add split line style here for x-axis
          splitLine: {
            ...(options.xAxis as XAXisOption).splitLine,
            show: true,
          },
        }
        break
      case 'funnel':
        options.series = this.constructSeries<FunnelSeriesOption>('funnel', {
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}: {c}',
            color: '#fff', // label color
          },
          gap: 2,
          itemStyle: {
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1,
          },
          data: this.data?.layers?.[0]?.result?.map((item) => ({
            name: item[this.columns[0]] as string,
            value: item[this.columns[1]] as number,
          })),
        })
        break
      case 'pie':
        options.series = this.constructSeries<PieSeriesOption>('pie', {
          data:
            this.data?.layers?.[0]?.result?.map((item) => ({
              name: item[this.columns[0]] as string,
              value: item[this.columns[1]] as number,
            })) ?? [],
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            color: this.theme === 'dark' ? '#fff' : '#000', // Set label text color to white
            textBorderColor: 'transparent', // Remove text border
          },
        })

        break
      default:
        break
    }

    return options
  }

  private constructSeries<T extends SeriesOption>(seriesType: T['type'], additionalOptions: Partial<Omit<T, 'type'>> = {}): T[] {
    return this.columns.slice(1).map((col) => {
      const baseSeries = {
        name: col,
        type: seriesType,
        encode:
          this.type === 'bar'
            ? { x: col, y: this.columns[0] } // For bar charts
            : { x: this.columns[0], y: col }, // For other chart types
        itemStyle: {
          color: this.type !== 'pie' ? this.yAxisColors?.[col] : undefined, // Use color from yAxisColors if present -- except on pie
        },
        symbol: 'circle',
        ...additionalOptions,
      }

      if (this.isValidSeriesOption<T>(baseSeries)) {
        return baseSeries as unknown as T
      } else {
        throw new Error(`The series option is invalid for series type "${seriesType}".`)
      }
    })
  }

  private isValidSeriesOption<T extends SeriesOption>(series: any): series is T {
    return series && typeof series === 'object' && typeof series.name === 'string' && typeof series.type === 'string'
  }

  private renderAsText() {
    let variant = 'p'

    let markdown = this.data?.options?.text ?? ''

    // Bold (**text** or __text__)
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    markdown = markdown.replace(/__(.*?)__/g, '<b>$1</b>')

    // Italic (*text* or _text_)
    markdown = markdown.replace(/\*(.*?)\*/g, '<i>$1</i>')
    markdown = markdown.replace(/_(.*?)_/g, '<i>$1</i>')

    // Underline (__text__)
    markdown = markdown.replace(/~~(.*?)~~/g, '<u>$1</u>')

    // Line break (double space followed by a newline)
    markdown = markdown.replace(/  \n/g, '<br>')

    return html`<div
      variant=${variant}
      style=${`display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; font-family: Inter, sans-serif;`}
      class="flex-1 self-start text-neutral-900 dark:text-neutral-100"
    >
      ${unsafeHTML(markdown)}
    </div>`
  }

  private renderAsSingleValue() {
    const firstRecord = this.data?.layers?.[0]?.result?.[0]
    let firstRecordValue = firstRecord ? firstRecord[this.keyX ?? ''] : ''
    const formattedValue = this.data?.options?.format

    if (formattedValue === 'percent') {
      const number = parseFloat(`${firstRecordValue}`)
      firstRecordValue = `${number.toFixed(2)}%`
    } else if (formattedValue === 'number') {
      const number = parseFloat(`${firstRecordValue}`)
      const rounded = Math.round(number)
      firstRecordValue = `${rounded.toLocaleString('en-US')}`
    } else if (formattedValue === 'decimal') {
      const number = parseFloat(`${firstRecordValue}`)
      firstRecordValue = `${number.toFixed(2)}`
    } else if (formattedValue === 'date') {
      const stringDate = `${firstRecordValue}`

      // Convert to a Date object to validate the input
      const date = new Date(stringDate)

      if (!isNaN(date.getTime())) {
        // Check if the date is valid
        // Extract the date components
        const year = date.getUTCFullYear()
        const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are 0-based
        const day = String(date.getUTCDate()).padStart(2, '0')

        // Manually construct the formatted date string
        const formattedDate = `${month}/${day}/${year}`

        firstRecordValue = formattedDate
      }
    } else if (formattedValue === 'time') {
      const date = new Date(`${firstRecordValue}`)
      firstRecordValue = date.toLocaleTimeString('en-US')
    } else if (formattedValue === 'dollar') {
      const number = parseFloat(`${firstRecordValue}`)
      firstRecordValue = `$${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else if (formattedValue === 'euro') {
      const number = parseFloat(`${firstRecordValue}`)
      firstRecordValue = `€${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else if (formattedValue === 'pound') {
      const number = parseFloat(`${firstRecordValue}`)
      firstRecordValue = `£${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else if (formattedValue === 'yen') {
      const number = parseFloat(`${firstRecordValue}`)
      firstRecordValue = `¥${number.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }

    const style = this.sizeX === 1 && this.sizeY === 1 ? 'font-size: 30px; line-height: 36px;' : 'font-size: 60px; line-height: 68px;'
    return html`<div class="flex-1 self-start">
      <div
        style=${`font-family: Inter, sans-serif; ${style}`}
        class=${`${this.theme === 'dark' ? 'text-neutral-50' : 'text-neutral-950'} font-bold truncate`}
      >
        ${firstRecordValue}
      </div>
    </div>`
  }
}
