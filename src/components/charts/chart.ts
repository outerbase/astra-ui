// src/components/astra-chart.ts

import * as echarts from 'echarts'
import { css, html, LitElement, type PropertyValueMap } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

// Color themes
const iridiumValues = ['#87E9C0', '#B9D975', '#C9D69B']
const celestialValues = ['#D1FFFF', '#93FDFF', '#1A9EF5']
const cobaltValues = ['#5956E2', '#A99AFF', '#82DBFF']
const afterburnValues = ['#E75F98', '#FFA285', '#CCB8F2']
const mercuryValuesDark = ['#fafafa', '#525252', '#a3a3a3', '#e5e5e5', '#262626']
const mercuryValuesLight = ['#0a0a0a', '#a3a3a3', '#525252', '#262626', '#e5e5e5']

@customElement('astra-chart')
export class AstraChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    #chart {
      width: 100%;
      height: 100%;
    }
  `

  @property({ type: String }) type: string = 'bar'
  @property({ type: Array }) data: any[] = []
  @property({ type: Array }) columns: string[] = []
  @property({ type: String }) title: string = ''
  @property({ type: String }) xAxisLabel: string = ''
  @property({ type: String }) yAxisLabel: string = ''
  @property({ type: String }) theme: string = 'light' // 'light' or 'dark'
  @property({ type: String }) colorTheme: string = 'mercury' // 'mercury', 'iridium', etc.

  @query('#chart')
  private chartDiv!: HTMLDivElement

  private chartInstance?: echarts.ECharts
  private resizeObserver?: ResizeObserver

  protected firstUpdated(_changedProperties: PropertyValueMap<any>): void {
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

  protected updated(_changedProperties: PropertyValueMap<any>): void {
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

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    super.disconnectedCallback()
  }

  private initializeChart() {
    if (!this.chartDiv) return

    if (this.chartInstance) {
      this.chartInstance.dispose()
    }

    this.chartInstance = echarts.init(this.chartDiv, undefined, { renderer: 'svg' })

    const options = this.getChartOptions()

    this.chartInstance.setOption(options)
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
        data: this.data.map((item) => item[this.columns[0]]),
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
          color: this.theme === 'dark' ? '#FFFFFF' : '#000000',
          interval: this.calculateLabelInterval(),
          formatter: (value: string) => {
            return this.formatAxisLabel(value)
          },
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

  private constructBarSeries() {
    return this.columns.slice(1).map((col) => ({
      name: col,
      type: 'bar',
      data: this.data.map((item) => item[col]),
      animationDelay: (idx: number) => idx * 100,
    }))
  }

  private constructLineSeries() {
    return this.columns.slice(1).map((col) => ({
      name: col,
      type: 'line',
      showSymbol: false,
      data: this.data.map((item) => item[col]),
      animationDuration: 1500,
      animationEasing: 'cubicOut',
    }))
  }

  private constructScatterSeries() {
    return this.columns.slice(1).map((col) => ({
      name: col,
      type: 'scatter',
      data: this.data.map((item) => [item[this.columns[0]], item[col]]),
    }))
  }

  private constructAreaSeries() {
    return this.columns.slice(1).map((col) => ({
      name: col,
      type: 'line',
      areaStyle: {},
      data: this.data.map((item) => item[col]),
      smooth: true,
    }))
  }

  private applyTheme() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.initializeChart()
    }
  }

  private calculateLabelRotation(): number {
    const width = this.chartDiv.clientWidth
    if (width < 400) {
      return 45
    } else if (width < 600) {
      return 30
    } else {
      return 0
    }
  }

  private formatAxisLabel(value: string): string {
    const width = this.chartDiv.clientWidth
    if (width < 400) {
      // Truncate labels for small widths
      return value.length > 5 ? value.substring(0, 5) + '…' : value
    }
    return value
  }

  private calculateLabelInterval(): number | 'auto' {
    const width = this.chartDiv.clientWidth
    const dataCount = this.data.length

    if (width < 400) {
      // For very small widths, show fewer labels
      return Math.ceil(dataCount / 2) // Show every Nth label
    } else if (width < 600) {
      // For medium widths
      return Math.ceil(dataCount / 4)
    } else {
      // For larger widths, adjust based on data count
      if (dataCount > 30) {
        return Math.ceil(dataCount / 10)
      } else {
        return 0 // Show all labels
      }
    }
  }

  render() {
    return html`<div id="chart"></div>`
  }
}

export default AstraChart
