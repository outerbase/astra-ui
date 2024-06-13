import { barX, barY, lineY, plot } from '@observablehq/plot'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ClassifiedElement } from '../classified-element.js'

function getRandomContrastColor(bgColor: string): string {
  const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
  const contrastThreshold = 128 // Threshold for determining light/dark background
  const contrastFactor = 0.5 // Factor for adjusting contrast

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.substring(1), 16)
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    }
  }

  const rgbToHex = (r: number, g: number, b: number) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  const bgRgb = hexToRgb(bgColor)
  const bgLum = lum(bgRgb.r, bgRgb.g, bgRgb.b)
  const isDark = bgLum < contrastThreshold

  let newColor
  let lumDiff
  do {
    newColor =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0') // Generate random color
    const newRgb = hexToRgb(newColor)
    const newLum = lum(newRgb.r, newRgb.g, newRgb.b)
    lumDiff = Math.abs(newLum - bgLum)
    const contrast = Math.abs(newLum - bgLum) / Math.max(newLum, bgLum)
    const contrastAdjustment = contrast * contrastFactor
    if ((isDark && newLum > bgLum) || (!isDark && newLum < bgLum)) {
      newColor = rgbToHex(
        Math.round(newRgb.r + contrastAdjustment * (newRgb.r > bgRgb.r ? -1 : 1)),
        Math.round(newRgb.g + contrastAdjustment * (newRgb.g > bgRgb.g ? -1 : 1)),
        Math.round(newRgb.b + contrastAdjustment * (newRgb.b > bgRgb.b ? -1 : 1))
      )
    }
  } while (Math.abs(lum(hexToRgb(newColor).r, hexToRgb(newColor).g, hexToRgb(newColor).b) - bgLum) < lumDiff)

  return newColor
}

type ChartType = 'bar-horizontal' | 'bar-vertical' | 'line'

type Dataset = {
  data: { label: string; value: number }[]
  color?: string // hex
}

@customElement('astra-chart')
export default class AstraChart extends ClassifiedElement {
  @property({ type: Array }) data: Dataset[] = []
  @property({ type: String, attribute: 'x-key' }) xKey?: string
  @property({ type: String, attribute: 'y-key' }) yKey?: string
  @property({ type: Boolean }) percentage = false
  @property({ type: Boolean, attribute: 'legend' }) showLegend = false
  @property({ type: String }) type: ChartType = 'bar-vertical'

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('data')) {
      this.updateChart()
    }
  }

  private updateChart() {
    const options: Record<string, any> = {
      marks: [],
    }

    // add bars to bar charts
    if (this.type === 'bar-horizontal' || this.type === 'bar-vertical') {
      const bar = this.type === 'bar-horizontal' ? barX : barY
      this.data.forEach(({ data, color }) => {
        options.marks.push(bar(data, { x: this.xKey, y: this.yKey, fill: color ?? getRandomContrastColor('#fff') }))
      })
    }

    // horizontal grid
    if (this.type === 'bar-horizontal') {
      options.x = { grid: true, percentage: this.percentage }
    }

    // vertical grid
    if (this.type === 'bar-vertical') {
      options.y = { grid: true, percentage: this.percentage }
    }

    // lines
    if (this.type === 'line') {
      this.data.forEach(({ data, color }) => {
        options.marks.push(lineY(data, { x: this.xKey, y: this.yKey, stroke: color ?? getRandomContrastColor('#fff') }))
      })
    }

    // legend
    if (this.showLegend) {
      options.color = { ...options.color, legend: true }
    }

    const _plot = plot(options)
    const chartElement = this.shadowRoot?.getElementById('chart')
    if (chartElement) {
      chartElement.innerHTML = ''
      chartElement.appendChild(_plot)
    }
  }

  render() {
    return html`<div id="chart" class="${classMap({ dark: this.theme === 'dark' })}">1</div>`
  }
}

export enum ChartTypeV3 {
  column = 'column',
  bar = 'bar',
  pie = 'pie',
  donut = 'donut',
  line = 'line',
  area = 'area',
  singleValue = 'single_value',
  table = 'table',
  scatter = 'scatter',
  heatmap = 'heatmap',
  text = 'text',
}

export type Row = {
  column: string
  sampleData: any
  columnName: string
  type: string
  include: boolean
}

export type DashboardV3ChartQuery = {
  // SQL query to fetch the data for the chart
  sql?: string
  // If the source of the SQL is from an attached saved query, this is the ID of the saved query
  queryId?: string
  // The type of chart to render
  type: ChartTypeV3
  // The data result of the query being executed
  result: Row[] | null | undefined
  // Indicates if this queries results should be hidden from the user
  hidden?: boolean
}

export type DashboardV3ChartOptions = {
  // The location of the legend on the chart
  legend?: 'none' | 'top' | 'bottom' | 'left' | 'right'
  // The X axis label for the chart
  xAxisLabel?: string
  // The Y axis label for the chart
  yAxisLabel?: string
  // The X axis column key for the chart
  xAxisKey?: string
  // The Y axis column keys for the chart series
  yAxisKeys?: string[]
  // The display, or hidden, and angle degree of the X axis labels
  xAxisLabelDisplay?: 'auto' | '0' | '45' | '90' | 'hidden'
  // The position of the Y axis, or hidden
  yAxisLabelDisplay?: 'left' | 'right' | 'hidden'
  // Order the data in a specific order
  sortOrder?: 'default' | 'asc' | 'desc'
  // The column to group the data by
  groupBy?: string
}

export type DashboardV3Callout = {
  type: 'total' | 'average' | 'percent_change'
}

export type DashboardV3Chart = {
  // The unique identifier for the chart
  id?: string
  // The name of the chart as provided by the user
  name: string
  // An API key value that is used to fetch details of the chart
  apiKey: string
  // Array of queries that are used to render various charts on the widget
  layers: Array<DashboardV3ChartQuery>
  // callouts
  callouts?: Array<DashboardV3Callout>
  // Chart options
  options: DashboardV3ChartOptions
}

export enum DashboardFilterType {
  enum = 'enum',
  sql = 'sql',
  search = 'search',
}

export type DashboardV3Filters = {
  type: DashboardFilterType
  name: string
  value: string
  sql?: string
  options?: Array<string>
}

export type DashboardV3 = {
  id: string
  name: string
  // Specify a version of the chart to allow for backwards compatibility
  version?: number
  charts: Array<DashboardV3Chart>
  chart_ids: Array<string>
  layout: Array<{
    // Unique identifier of the item in this layout position
    i: string
    // The X value where the item starts in the layout grid
    x: number
    // The Y value where the item starts in the layout grid
    y: number
    // The width of the item in the layout grid
    w: number
    // The height of the item in the layout grid
    h: number
    // The maximum height of the item in the layout grid
    maxH: number
    // The maximum width of the item in the layout grid
    maxW: number
  }>
  filters?: Array<DashboardV3Filters>
}
