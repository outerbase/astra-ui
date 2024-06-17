import { barX, barY, lineY, plot } from '@observablehq/plot'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import type {
  ChartTypeV3,
  DashboardV3ChartLabelDisplayX,
  DashboardV3ChartLabelDisplayY,
  DashboardV3ChartLegend,
  DashboardV3ChartSortOrder,
  Dataset,
} from '../../types.js'
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

@customElement('astra-chart')
export default class AstraChart extends ClassifiedElement {
  @property({ type: Array }) data: Dataset[] = []
  @property({ type: String }) type?: ChartTypeV3 = 'bar'
  @property({ type: String }) legend?: DashboardV3ChartLegend = 'top'
  @property({ type: Boolean }) percentage? = false
  @property({ type: String, attribute: 'x-key' }) xKey?: string
  @property({ type: String, attribute: 'x-axis-label' }) xAxisLabel?: string
  @property({ type: String, attribute: 'x-axis-label-display' }) xAxisLabelDisplay?: DashboardV3ChartLabelDisplayX = 'auto'
  @property({ type: String, attribute: 'y-key' }) yKey?: string
  @property({ type: String, attribute: 'y-axis-label' }) yAxisLabel?: string
  @property({ type: String, attribute: 'x-axis-label-display' }) yAxisLabelDisplay?: DashboardV3ChartLabelDisplayY = 'left'
  @property({ type: String, attribute: 'sort-order' }) sortOrder?: DashboardV3ChartSortOrder = 'default'
  @property({ type: String, attribute: 'group-by' }) groupBy?: string
  @property({ type: Boolean, attribute: 'gridX' }) gridX = false
  @property({ type: Boolean, attribute: 'gridY' }) gridY = false

  // TODO add property that determines the size/style -- e.g. the smallest form would omit the header, subheader, etc while the largest would show the most

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
    if (this.type === 'bar') {
      this.data.forEach(({ data, color }) => {
        options.marks.push(barX(data, { x: this.xKey, y: this.yKey, fill: color ?? getRandomContrastColor('#fff') }))
      })
    }

    if (this.type === 'column') {
      this.data.forEach(({ data, color }) => {
        options.marks.push(barY(data, { x: this.xKey, y: this.yKey, fill: color ?? getRandomContrastColor('#fff') }))
      })
    }

    // TODO implement marks for other chart `type`s

    // draw grid on bar charts
    if (this.type === 'bar') {
      options.x = { grid: true, percentage: this.percentage }
    }

    // draw grid on column charts

    if (this.type === 'column') {
      options.y = { grid: true, percentage: this.percentage }
    }

    // lines
    if (this.type === 'line') {
      this.data.forEach(({ data, color }) => {
        options.marks.push(lineY(data, { x: this.xKey, y: this.yKey, stroke: color ?? getRandomContrastColor('#fff') }))
      })
    }

    if (this.xAxisLabel) {
      options.x = { ...options.x, label: this.xAxisLabel }
    }

    if (this.yAxisLabel) {
      options.y = { ...options.y, label: this.yAxisLabel }
    }

    // grids
    options.x = { ...options.x, grid: this.gridX }
    options.y = { ...options.y, grid: this.gridY }

    const _plot = plot(options)
    const chartElement = this.shadowRoot?.getElementById('chart')
    if (chartElement) {
      chartElement.innerHTML = ''
      chartElement.appendChild(_plot)
    }
  }

  render() {
    return html`<slot name="actions"></slot>
      <div id="chart" class="${classMap({ dark: this.theme === 'dark' })}">1</div> `
  }
}
