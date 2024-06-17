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
