import { barX, barY, gridX, gridY, lineY, plot } from '@observablehq/plot'
import { html, type PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import createGradient from '../../lib/create-gradient.js'
import { getRandomContrastingColor } from '../../lib/random-contrasting-color.js'
import type {
  ChartTypeV3,
  DashboardV3ChartLabelDisplayX,
  DashboardV3ChartLabelDisplayY,
  DashboardV3ChartSortOrder,
  Dataset,
} from '../../types.js'
import { ClassifiedElement } from '../classified-element.js'

const defaultGridStyle = { strokeDasharray: '2', strokeOpacity: 0.2 }

@customElement('astra-chart')
export default class AstraChart extends ClassifiedElement {
  @property({ type: Array }) data: Dataset[] = [] // TODO change to expect API response data
  @property({ type: String }) type?: ChartTypeV3 = 'bar'

  // X-Axis
  @property({ type: String, attribute: 'x-key' }) xKey?: string
  @property({ type: String, attribute: 'x-axis-label' }) xAxisLabel?: string
  @property({ type: String, attribute: 'x-axis-label-display' }) xAxisLabelDisplay: DashboardV3ChartLabelDisplayX = 'auto'

  // Y-Axis
  @property({ type: String, attribute: 'y-key' }) yKey?: string
  @property({ type: String, attribute: 'y-axis-label' }) yAxisLabel?: string
  @property({ type: String, attribute: 'y-axis-label-display' }) yAxisLabelDisplay: DashboardV3ChartLabelDisplayY = 'left'

  // Sorting & grouping
  @property({ type: String, attribute: 'sort-order' }) sortOrder: DashboardV3ChartSortOrder = 'default'
  @property({ type: String, attribute: 'group-by' }) groupBy?: string

  // Grids
  @property({ type: Boolean, attribute: 'grid-x' }) gridX = false
  @property({ type: Boolean, attribute: 'grid-y' }) gridY = false

  // Layout options: https://observablehq.com/plot/features/plots#layout-options
  // > The layout options determine the overall size of the plot; all are specified as numbers in pixels
  @property({ type: Number }) width = 820
  @property({ type: Number }) height = 440
  @property({ type: Number }) margin = 0
  @property({ type: Number, attribute: 'margin-top' }) marginTop = 0
  @property({ type: Number, attribute: 'margin-right' }) marginRight = 0
  @property({ type: Number, attribute: 'margin-bottom' }) marginBottom = 0
  @property({ type: Number, attribute: 'margin-left' }) marginLeft = 0

  // Color scales: https://observablehq.com/plot/features/scales#color-scales
  // > The default quantitative color scale type is linear, and the default scheme is turbo.
  @property({ type: String, attribute: 'color-type' }) colorType?: string
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: string

  // Position scale options: https://observablehq.com/plot/features/scales#position-scale-options
  // > The inset scale options can provide “breathing room” to separate marks from axes or the plot’s edge.
  @property({ type: Boolean }) round = false // round the output value to the nearest integer (whole pixel)
  @property({ type: Number }) inset = 0 // inset the default range by the specified amount in pixels
  @property({ type: Number, attribute: 'inset-top' }) insetTop = 0 //  insets the top of the default range by the specified number of pixels
  @property({ type: Number, attribute: 'inset-right' }) insetRight = 0 // insets the end of the default range by the specified number of pixels
  @property({ type: Number, attribute: 'inset-bottom' }) insetBottom = 0 //  insets the bottom of the default range by the specified number of pixels
  @property({ type: Number, attribute: 'inset-left' }) insetLeft = 0 // insets the start of the default range by the specified number of pixels

  // Other options: https://observablehq.com/plot/features/plots#other-options
  // > If the plot includes a title, subtitle, legend, or caption, plot wraps the SVG element with an HTML figure element.
  @property({ type: String, attribute: 'title' }) mainTitle?: string // `mainTitle` because `title` is a core HTML/JS attribute
  @property({ type: String }) subtitle?: string
  @property({ type: String }) caption?: string
  @property({ type: Boolean }) legend = false
  // @property({ type: String }) legend: DashboardV3ChartLegend = 'top'

  // Tooltips
  @property({ type: String, attribute: 'tooltip-fill' }) tooltipFill = 'RGBA(231,231,228,1)'
  @property({ type: String, attribute: 'tooltip-stroke' }) tooltipStroke = 'RGBA(255,255,255,0.1)'
  @property({ type: Number, attribute: 'tooltip-text-padding' }) tooltipTextPadding = 10
  @property({ type: Number, attribute: 'tooltip-line-height' }) tooltipLineHeight = 1.5

  // Quantitative scales
  @property({ type: Boolean }) clamp = false // if true, clamp input values to the scale’s domain
  @property({ type: Boolean }) nice = false // if true (or a tick count), extend the domain to nice round values
  @property({ type: Boolean }) zero = false // if true, extend the domain to include zero if needed
  @property({ type: Boolean }) percent = false // if true, transform proportions in [0, 1] to percents in [0, 100]

  override firstUpdated(changedProperties: PropertyValueMap<this>): void {
    super.firstUpdated(changedProperties)

    // create the gradient that is used to color a bar chart
    // TODO only run this if the type is bar or column?
    createGradient(
      'bar',
      [
        { offset: '15%', color: '#08595A' },
        { offset: '75%', color: '#08595A80' },
      ],
      this.shadowRoot
    )
  }

  override willUpdate(changedProperties: PropertyValueMap<this>) {
    super.willUpdate(changedProperties)
    if (changedProperties.has('theme')) this.tooltipFill = this.theme === 'dark' ? 'RGBA(24,24,27,1)' : 'RGBA(231,231,228,1)'
  }

  protected updated(_changedProperties: PropertyValueMap<this>) {
    this.updateChart()
  }

  private updateChart() {
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
      nice: this.nice,

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
      fill: this.tooltipFill,
      stroke: this.tooltipStroke,
      textPadding: this.tooltipTextPadding,
      lineHeight: this.tooltipLineHeight,
    }

    // TYPE: BAR
    if (this.type === 'bar') {
      this.data.forEach(({ data }) => {
        options.marks.push(
          barX(data, {
            x: this.xKey,
            y: this.yKey,
            stroke: this.xKey,
            fill: 'url(#bar)',
            tip,
          })
        )
      })
    }

    // TYPE: COLUMN
    if (this.type === 'column') {
      this.data.forEach(({ data }) => {
        options.marks.push(
          barY(data, {
            x: this.xKey,
            y: this.yKey,
            stroke: this.yKey,
            fill: 'url(#bar)',
            tip,
          })
        )
      })
    }

    // TYPE: LINE
    if (this.type === 'line') {
      this.data.forEach(({ data }) => {
        options.marks.push(
          lineY(data, { x: this.xKey, y: this.yKey, stroke: getRandomContrastingColor(this.theme === 'dark' ? '#000' : '#fff') })
        )
      })
    }

    // LABELS
    if (this.xAxisLabel) {
      options.x = { ...options.x, label: this.xAxisLabel }
    }
    if (this.yAxisLabel) {
      options.y = { ...options.y, label: this.yAxisLabel }
    }

    // GRIDS
    if (this.gridX) {
      options.marks.push(gridX(defaultGridStyle))
    }
    if (this.gridY) {
      options.marks.push(gridY(defaultGridStyle))
    }

    // render and append the plot
    const _plot = plot(options)
    const chartElement = this.shadowRoot?.getElementById('chart')
    if (chartElement) {
      chartElement.innerHTML = ''
      chartElement.appendChild(_plot)
    }
  }

  public render() {
    return html`<div id="chart" />`
  }
}
