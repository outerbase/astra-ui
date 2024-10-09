import { areaY, barX, barY, dot, gridX, gridY, lineY, plot, axisY, axisX } from '@observablehq/plot'
import { max, min, timeDay, utcDay, utcMinute, utcMonth, utcWeek, utcYear } from 'd3'
import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import createGradient from '../../lib/create-gradient.js'
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

const gradients = [
  createGradient('mercury', [
    { offset: '0%', color: '#ffffff' },
    { offset: '100%', color: '#747474' },
  ]),

  createGradient('iridium', [
    { offset: '0%', color: '#87E9C0' },
    { offset: '75%', color: '#B9D975' },
    { offset: '100%', color: '#C9D69B' },
  ]),

  createGradient('cobalt', [
    { offset: '0%', color: '#5956E2' },
    { offset: '50%', color: '#A99AFF' },
    { offset: '100%', color: '#82DBFF' },
  ]),

  createGradient('afterburn', [
    { offset: '0%', color: '#E75F98' },
    { offset: '25%', color: '#FFA285' },
    { offset: '100%', color: '#CCB8F2' },
  ]),

  createGradient('celestial', [
    { offset: '0%', color: '#D1FFFF' },
    { offset: '75%', color: '#93FDFF' },
    { offset: '100%', color: '#1A9EF5' },
  ]),
]

const iridiumValues = ['#87E9C0', '#B9D975', '#C9D69B']
const celestialValues = ['#D1FFFF', '#93FDFF', '#1A9EF5']
const cobaltValues = ['#5956E2', '#A99AFF', '#82DBFF']
const afterburnValues = ['#E75F98', '#FFA285', '#CCB8F2']

const mercuryValuesDark = ['#fafafa', '#525252', '#a3a3a3', '#e5e5e5', '#262626']
const mercuryValuesLight = ['#0a0a0a', '#a3a3a3', '#525252', '#262626', '#e5e5e5']

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

  @property({ type: Array }) colorValues = this.theme === 'dark' ? mercuryValuesDark : mercuryValuesLight
  @property({ type: Number }) sizeX?: number
  @property({ type: Number }) sizeY?: number

  private convertDataIntoCastedData(data: DashboardV3Chart | undefined): DashboardV3Chart | undefined {
    let temp: any = JSON.parse(JSON.stringify(data))

    // For each temp.layers castData
    temp.layers?.forEach((layer: any) => {
      layer.result = this.castData(layer.result)
    })

    return temp
  }

  private castData(data: Row[]): Row[] {
    if (!data) return []

    if (this.data?.layers?.[0].type === 'table') {
      return data
    }

    // For each row in the data, cast each value as the correct type such as Number, Date, or string.
    return data.map((row: any) => {
      const newRow: Row = {}
      for (const key in row) {
        const value = row[key]

        if (!isNaN(value) && value !== '') {
          newRow[key] = Number(value)
        } else if (!isNaN(Date.parse(value))) {
          newRow[key] = new Date(value)
        } else {
          newRow[key] = String(value)
        }
      }
      return newRow
    })
  }

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

    if (changedProperties.has('theme')) {
      this.render()
    }

    if (changedProperties.has('data')) {
      // update chart type
      this.type = this.data?.layers?.[0]?.type // TODO don't assume 1 layer
      this.highlights = this.data?.highlights
      // this.apiKey = this.data?.apiKey // <-- this will switch from using passed-in data to making API requests

      this.data = this.convertDataIntoCastedData(this.data)

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

        this.render()
      }
    }
  }

  private determineInterval(dates: Date[]) {
    const minDate = dates.length > 0 ? dates[0] : new Date() //min(dates) ?? new Date()
    const maxDate = dates.length > 1 ? dates[1] : new Date() //max(dates) ?? new Date()
    const diffDays = timeDay.count(minDate, maxDate)

    if (diffDays < 1) {
      return utcMinute.every(1)
    } else if (diffDays <= 7) {
      return utcDay.every(1)
    } else if (diffDays <= 30) {
      return utcWeek.every(1)
    } else if (diffDays <= 365) {
      return utcMonth.every(1)
    } else {
      return utcYear.every(1)
    }
  }

  private getLatestPlot() {
    if (!this.height) return null

    const layer = this.data?.layers?.[0] // TODO don't assume 1 layer
    if (!layer) return null

    const d = layer.result
    if (!d) return null

    let showLegend = this.data?.options?.legend && this.data?.options?.legend !== 'none'
    const defaultGridStyle = { strokeDasharray: '2', strokeOpacity: 0.1, stroke: this.theme === 'light' ? 'black' : 'white' }

    let options: Record<string, any> = {
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
      color: {
        type: this.colorType,
        scheme: this.colorScheme,
      },

      // Marks option: https://observablehq.com/plot/features/plots#marks-option
      marks: [],
    }

    const tip = {
      fill: this.theme === 'dark' ? '#121212' : '#FFFFFF',
      stroke: this.theme === 'dark' ? '#303032' : '#e5e5e5',
      textPadding: 10,
      lineHeight: 1.5,
      color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
    }

    let sort = undefined

    // TYPE: BAR
    if (this.type === 'bar') {
      // Set the sort order rendering, if a sort order exists
      sort = this.createSortOrder('y', 'x', this.sortOrder)

      // Setup the bar chart
      options = this.constructBarChart(options, d, sort, tip)

      // Render the grid along the X-axis unless explicitly disabled
      if (this.gridX !== false) {
        options.marks.push(gridX(defaultGridStyle))
      }
    }

    // TYPE: COLUMN
    if (this.type === 'column') {
      // Set the sort order rendering, if a sort order exists
      sort = this.createSortOrder('x', 'y', this.sortOrder)

      // Setup the bar chart
      options = this.constructColumnChart(options, d, sort, tip)

      // Render the grid along the Y-axis unless explicitly disabled
      if (this.gridY !== false) {
        options.marks.push(gridY(defaultGridStyle))
      }
    }

    // TYPE: LINE
    if (this.type === 'line') {
      // Setup the line chart
      options = this.constructLineChart(options, d, sort, tip)

      // include grid along X-axis unless explicitly disabled
      if (this.gridX !== false) {
        options.marks.push(gridX(defaultGridStyle))
      }

      if (this.niceY !== false) this.niceY = true
    }

    if (this.type === 'scatter') {
      options = this.constructScatterChart(options, d, sort, tip)
    }

    if (this.type === 'area') {
      options = this.constructAreaChart(options, d, sort, tip)
    }

    let showXTicks = true
    let showYTicks = true
    let tickRotation = 0
    let yAxisDisplay = 'left'

    if (this.data?.options?.xAxisLabelDisplay === '45') {
      tickRotation = -45
    } else if (this.data?.options?.xAxisLabelDisplay === '90') {
      tickRotation = -90
    } else if (this.data?.options?.xAxisLabelDisplay === 'hidden') {
      showXTicks = false
    }

    if (this.data?.options?.yAxisLabelDisplay === 'right') {
      yAxisDisplay = 'right'
    } else if (this.data?.options?.yAxisLabelDisplay === 'hidden') {
      showYTicks = false
    }

    if (showLegend && options.color?.domain?.length && options.color?.range?.length) {
      options.color = {
        ...options.color,
        legend: true,
      }

      options.marginBottom = 60
    }

    // LABELS
    options.marks.push(
      axisX({
        ...options.x,
        label: this.axisLabelX ?? null,
        labelAnchor: 'center',
        marginBottom: 50,
        labelArrow: 'none',
        ticks: showYTicks ? this.ticksX : undefined,
        tickRotate: tickRotation,
        tickFormat: showXTicks ? undefined : () => '',
        tickSize: showXTicks ? 5 : 0,
        nice: this.niceX,

        lineWidth: 8,
        textOverflow: 'ellipsis',
      })
    )

    options.marks.push(
      axisY({
        ...options.y,
        tickSize: showYTicks ? 5 : 0,
        label: this.axisLabelY ?? null,
        nice: this.niceY,
        marginLeft: 50,
        tickFormat: 's',
        lineWidth: 4,
        textOverflow: 'ellipsis',
      })
    )

    try {
      return plot(options)
    } catch (error) {
      console.error('Error rendering chart:', error)
    }
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<this>) {
    super.firstUpdated(_changedProperties)

    const chart = this.shadowRoot?.querySelector('#chart')
    const { height } = chart?.getBoundingClientRect() ?? { height: 0 }
    this.height = height
  }

  protected updated(_changedProperties: PropertyValueMap<this>): void {
    const elements = this.shadowRoot!.querySelectorAll('rect')
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.animationDelay = `${i / 50}s`
    }

    const sizeXChanged = _changedProperties.has('sizeX') && _changedProperties.get('sizeX') !== undefined
    const sizeYChanged = _changedProperties.has('sizeY') && _changedProperties.get('sizeY') !== undefined
    if (sizeXChanged || sizeYChanged) {
      const chart = this.shadowRoot?.querySelector('#chart')
      const { height } = chart?.getBoundingClientRect() ?? { height: 0 }
      this.height = height
    }
  }

  public render() {
    let plot: any

    if (this.type === 'table') {
      const firstRecord = this.data?.layers?.[0].result?.[0]
      let schema
      if (firstRecord) {
        schema = { columns: Object.keys(firstRecord).map((k) => ({ name: k })) }
      }

      plot = html`<astra-table
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
    } else if (this.type === 'single_value') {
      const firstRecord = this.data?.layers?.[0].result?.[0]
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
      plot = html`<div
        style=${`font-family: Inter, sans-serif; ${style}`}
        class=${`${this.theme === 'dark' ? 'text-neutral-50' : 'text-neutral-950'} font-bold truncate`}
      >
        ${firstRecordValue}
      </div>`
    } else if (this.type === 'text') {
      let height = this.height ?? 0
      let lineClamp = Math.floor(height / 21)
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

      plot = html`<div
        variant=${variant}
        style=${`display: -webkit-box; -webkit-line-clamp: ${lineClamp}; -webkit-box-orient: vertical; overflow: hidden; font-family: Inter, sans-serif;`}
        class=${`text-neutral-900 dark:text-neutral-100`}
      >
        ${unsafeHTML(markdown)}
      </div>`
    } else plot = this.getLatestPlot()

    const decoratedPlot = html`<div class=${`flex-col h-full flex`}>${plot}</div>`

    const themedPlot = html`<div
      id="themed-plot"
      class="${classMap({ dark: this.theme === 'dark', '*:fade barY *:animate-fade w-full h-full relative': true })}"
    >
      ${decoratedPlot}
    </div>`

    return html`${gradients} ${themedPlot}`
  }

  createSortOrder(byAxis: 'x' | 'y', axisValue: string, order: 'asc' | 'desc' | string | undefined) {
    if (!order || (order !== 'asc' && order !== 'desc')) {
      return undefined
    }

    return {
      [byAxis]: axisValue,
      reverse: order === 'asc' ? false : true,
    }
  }

  normalizeData(_data: Row[], xAxis: string, yAxis: string): { data: Row[]; legend: { domain: any[]; range: any[] } } {
    const yAxisKeys = this.data?.options?.yAxisKeys ?? [this.keyY]
    const group = this.data?.options?.groupBy ?? this.groupBy
    const normalizedGroup = group === this.keyX ? 'x' : group === this.keyY ? 'y' : group
    const reshapedData: Row[] = []
    const legendProperties = this.constructLegendProperties()

    if (yAxisKeys.length > 1) {
      return this.normalizeSeriesData(_data, xAxis, legendProperties)
    }

    _data.forEach((row) => {
      let item: any = {
        x: row[xAxis],
        y: row[yAxis],
        g: normalizedGroup ? row[normalizedGroup] : undefined,
      }

      reshapedData.push(item)
    })

    return {
      data: reshapedData,
      legend: legendProperties,
    }
  }

  /**
   * When data is provided for a chart that has multiple series, the data needs to be reshaped
   * to fit the expected format for the barY function.
   *
   * @param data
   * @param xAxis
   * @param legendValues
   * @returns Row[]
   */
  normalizeSeriesData(
    data: Row[],
    xAxis: string,
    legendProperties?: { domain: any[]; range: any[] }
  ): { data: Row[]; legend: { domain: any[]; range: any[] } } {
    const reshapedData: Row[] = []
    legendProperties = legendProperties ?? this.constructLegendProperties()

    data.forEach((row) => {
      legendProperties.domain.forEach((userKey: string) => {
        reshapedData.push({
          x: row[xAxis],
          y: row[userKey],
          g: userKey,
        })
      })
    })

    return {
      data: reshapedData,
      legend: legendProperties,
    }
  }

  constructLegendProperties() {
    const yAxisKeys = this.data?.options?.yAxisKeys ?? [this.keyY]
    let legendColors: any[] = []
    let legendValues: any[] = []

    if (yAxisKeys.length > 1) {
      this.data?.options?.yAxisKeys?.forEach((key, index) => {
        const desiredColor = this.data?.options?.yAxisKeyColors?.[key] ?? this.colorValues[index % this.colorValues.length]
        legendColors.push(desiredColor)
        legendValues.push(key)
      })
    } else {
      const group = this.data?.options?.groupBy ?? this.groupBy
      const firstRecord = this.data?.layers?.[0].result?.[0]
      const firstRecordKey = firstRecord ? Object.keys(firstRecord)[0] : ''
      legendValues = group ? Array.from(new Set(this.data?.layers?.[0].result?.map((r) => r[group])) ?? []) : [firstRecordKey]
      legendColors = legendValues.map((_, i) => this.colorValues[i % this.colorValues.length])
    }

    // Filter undefineds out of legendValues
    legendValues = legendValues.filter((v) => v !== undefined)

    return {
      domain: legendValues,
      range: legendColors,
    }
  }

  isAxisKeyDate(data: Row[], key: string): { isDate: boolean; interval: any; tickValues: any } {
    const newArray: any[] | undefined = data.map((r: Record<string, any>) => {
      const value = r[key]

      // Check if the value is not a plain number and is a valid date
      if (typeof value !== 'number' && !isNaN(Date.parse(value))) {
        return new Date(value)
      }
      return undefined
    })

    const isDate = newArray.every((d) => d instanceof Date)
    const startDate = min(newArray)
    const endDate = max(newArray)
    let tickValues = undefined

    if (startDate && endDate) {
      tickValues = utcMonth.range(startDate, endDate)
    }

    return {
      isDate: isDate,
      interval: isDate ? this.determineInterval(newArray) : undefined,
      tickValues: isDate ? tickValues : undefined,
    }
  }

  constructBarChart(options: Record<string, any>, d: Row[], sort: any, tip: any): Record<string, any> {
    // Setup the bar chart
    const { data: reshapedData, legend } = this.normalizeData(d, this.keyX ?? '', this.keyY ?? '')
    const fill = reshapedData?.[0]?.g ? 'g' : this.colorValues[0]
    const { isDate: isYAxisKeyDate, interval, tickValues } = this.isAxisKeyDate(d, this.keyX ?? '')
    const isStacked = reshapedData?.[0]?.g

    if (isYAxisKeyDate) {
      options.y = {
        ...options.y,
        type: isStacked ? 'band' : undefined,
        interval: isStacked ? undefined : interval,
        tickValues: tickValues,
      }
    }

    options.color = {
      ...options.color,
      ...legend,
    }

    options.marks.push(
      barX(reshapedData, {
        x: 'y',
        y: 'x',
        fill: fill,
        tip,
        sort,
      })
    )

    return options
  }

  constructColumnChart(options: Record<string, any>, d: Row[], sort: any, tip: any): Record<string, any> {
    // Setup the column chart
    const { data: reshapedData, legend } = this.normalizeData(d, this.keyX ?? '', this.keyY ?? '')
    const fill = reshapedData?.[0]?.g ? 'g' : this.colorValues[0]
    const { isDate: isXAxisKeyDate, interval, tickValues } = this.isAxisKeyDate(d, this.keyX ?? '')
    const isStacked = reshapedData?.[0]?.g

    if (isXAxisKeyDate) {
      options.x = {
        ...options.x,
        type: isStacked ? 'band' : undefined,
        interval: isStacked ? undefined : interval,
        tickValues: tickValues,
      }
    }

    options.color = {
      ...options.color,
      ...legend,
    }

    options.marks.push(
      barY(reshapedData, {
        x: 'x',
        y: 'y',
        fill: fill,
        tip,
        sort,
      })
    )

    return options
  }

  constructLineChart(options: Record<string, any>, d: Row[], _sort: any, tip: any): Record<string, any> {
    // Setup the line chart
    const { data: reshapedData, legend } = this.normalizeData(d, this.keyX ?? '', this.keyY ?? '')
    const stroke = reshapedData?.[0]?.g ? 'g' : this.colorValues[0]
    const yAxisKeys = this.data?.options?.yAxisKeys ?? [this.keyY]
    const multipleLines = yAxisKeys.length > 1

    options.color = {
      ...options.color,
      ...legend,
    }

    if (multipleLines) {
      yAxisKeys.forEach((_key, _index) => {
        options.marks.push(
          lineY(reshapedData, {
            x: 'x',
            y: 'y',
            stroke: stroke,
            tip,
          })
        )
      })
    } else {
      options.marks.push(
        lineY(reshapedData, {
          x: 'x',
          y: 'y',
          stroke: stroke,
          tip,
        })
      )
    }

    return options
  }

  constructAreaChart(options: Record<string, any>, d: Row[], _sort: any, tip: any): Record<string, any> {
    // Setup the area chart
    const { data: reshapedData, legend } = this.normalizeData(d, this.keyX ?? '', this.keyY ?? '')
    const stroke = reshapedData?.[0]?.g ? 'g' : this.colorValues[0]
    const yAxisKeys = this.data?.options?.yAxisKeys ?? [this.keyY]
    const multipleLines = yAxisKeys.length > 1

    options.color = {
      ...options.color,
      ...legend,
    }

    if (multipleLines) {
      yAxisKeys.forEach((_key, _index) => {
        options.marks.push(
          areaY(reshapedData, {
            x: 'x',
            y2: 'y',
            fill: stroke,
            fillOpacity: 0.1,
            stroke: stroke,
            tip,
          })
        )
      })
    } else {
      options.marks.push(
        areaY(reshapedData, {
          x: 'x',
          y2: 'y',
          fill: stroke,
          fillOpacity: 0.1,
          stroke: stroke,
          tip,
        })
      )
    }

    return options
  }

  constructScatterChart(options: Record<string, any>, d: Row[], _sort: any, tip: any): Record<string, any> {
    // Setup the scatter chart
    const { data: reshapedData, legend } = this.normalizeData(d, this.keyX ?? '', this.keyY ?? '')
    const stroke = reshapedData?.[0]?.g ? 'g' : this.colorValues[0]
    const yAxisKeys = this.data?.options?.yAxisKeys ?? [this.keyY]
    const multipleLines = yAxisKeys.length > 1

    options.color = {
      ...options.color,
      ...legend,
    }

    if (multipleLines) {
      yAxisKeys.forEach((_key, _index) => {
        options.marks.push(
          dot(reshapedData, {
            x: 'x',
            y: 'y',
            stroke: stroke,
            tip,
          })
        )
      })
    } else {
      options.marks.push(
        dot(reshapedData, {
          x: 'x',
          y: 'y',
          stroke: stroke,
          tip,
        })
      )
    }

    return options
  }
}
