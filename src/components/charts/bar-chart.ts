import * as d3 from 'd3'
import { CSSResult, LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type TemplateResult = import('lit').TemplateResult

interface DataPoint {
  label: string
  value: number
  color?: string
  note?: string
}

type RoundingSize = 'small' | 'medium' | 'large'
type LabelOrientation = 'centered' | 'slanted' | 'abbreviated'

@customElement('bar-chart')
export class BarChart extends LitElement {
  @property({ type: Array }) data: DataPoint[] = []
  @property({ type: String }) rounding: RoundingSize = 'small'
  @property({ type: Boolean, attribute: 'rounded-bottoms' }) roundedBottoms: boolean = true
  @property({ type: Boolean, attribute: 'show-bar-labels' }) showBarLabels: boolean = true
  @property({ type: Boolean, attribute: 'emphasize-labels-on-hover' }) emphasizeLabelsOnHover: boolean = false
  @property({ type: Boolean, attribute: 'highlight-bars-on-hover' }) highlightBarsOnHover: boolean = true
  @property({ type: String, attribute: 'label-orientation' }) labelOrientation: LabelOrientation = 'centered'
  @property({ type: String, attribute: 'vertical-axis-label' }) verticalAxisLabel?: string
  @property({ type: Number, attribute: 'x-axis-label-font-size' }) xAxisLabelFontSize: number = 14
  @property({ type: Number, attribute: 'y-axis-label-font-size' }) yAxisLabelFontSize: number = 14

  static styles: CSSResult = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      --background-color: white;
      --tooltip-bg: white;
      --tooltip-color: black;
      --tooltip-border: black;
    }
    :host([dark]) {
      --background-color: black;
      --tooltip-bg: black;
      --tooltip-color: white;
      --tooltip-border: white;
    }
    svg {
      width: 100%;
      background-color: var(--background-color);
    }
    .tooltip {
      position: absolute;
      padding: 5px;
      pointer-events: none;
      visibility: hidden;
      z-index: 10;
      background-color: var(--tooltip-bg);
      color: var(--tooltip-color);
      border: 1px solid var(--tooltip-border);
      border-radius: 4px;
    }
    .no-select {
      user-select: none;
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
    }
    .no-pointer-events {
      pointer-events: none;
    }
  `

  private resizeObserver: ResizeObserver

  constructor() {
    super()
    this.resizeObserver = new ResizeObserver(() => this.createChart())
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.updateDarkMode()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.updateDarkMode)
    this.resizeObserver.observe(this)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.updateDarkMode)
    this.resizeObserver.unobserve(this)
  }

  updateDarkMode = (): void => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDarkMode) {
      this.setAttribute('dark', '')
    } else {
      this.removeAttribute('dark')
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (
      changedProperties.has('data') ||
      changedProperties.has('rounding') ||
      changedProperties.has('roundedBottoms') ||
      changedProperties.has('showBarLabels') ||
      changedProperties.has('labelOrientation') ||
      changedProperties.has('verticalAxisLabel')
    ) {
      this.createChart()
    }
  }

  getRoundingValue(): number {
    switch (this.rounding) {
      case 'small':
        return 5
      case 'medium':
        return 10
      case 'large':
        return 15
      default:
        return 0
    }
  }

  getHoverColor(color: string, isDarkMode: boolean): string {
    const d3Color = d3.color(color)
    if (!d3Color) return color
    const factor = isDarkMode ? 1.2 : 0.8
    return isDarkMode ? d3Color.brighter(factor).toString() : d3Color.darker(factor).toString()
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  createChart(): void {
    const svg = d3.select(this.renderRoot.querySelector('svg') as SVGElement)
    svg.selectAll('*').remove()

    const tooltip = d3.select(this.renderRoot.querySelector('.tooltip') as HTMLElement)

    const margin = { top: 10, right: 0, bottom: 100, left: 80 }
    const width = this.clientWidth - margin.left - margin.right
    const height = this.clientHeight + 40 - margin.top - margin.bottom

    svg.attr('viewBox', `0 0 ${this.clientWidth} ${this.clientHeight}`).classed('no-select', true) // Add the no-select class to the SVG

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleBand<string>()
      .domain(this.data.map((d) => d.label))
      .range([0, width])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.value)!])
      .nice()
      .range([height, 0])

    const xAxis = g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

    if (this.showBarLabels) {
      if (this.labelOrientation === 'slanted') {
        xAxis
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-45)')
          .style('font-size', `${this.xAxisLabelFontSize}px`)
          .classed('no-pointer-events', true) // Add the no-pointer-events class to the text elements
      } else if (this.labelOrientation === 'abbreviated') {
        xAxis
          .selectAll('text')
          .text((d) => (d as string).charAt(0))
          .style('font-size', `${this.xAxisLabelFontSize}px`)
          .classed('no-pointer-events', true) // Add the no-pointer-events class to the text elements
      } else {
        xAxis
          .selectAll('text')
          .style('text-anchor', 'middle')
          .style('font-size', `${this.xAxisLabelFontSize}px`)
          .classed('no-pointer-events', true) // Add the no-pointer-events class to the text elements
      }
    }

    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', `${this.yAxisLabelFontSize}px`)
      .classed('no-pointer-events', true) // Add the no-pointer-events class to the text elements

    if (this.verticalAxisLabel) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${-margin.left + 20},${height / 2})rotate(-90)`)
        .text(this.verticalAxisLabel)
        .style('font-size', `${this.yAxisLabelFontSize}px`)
        .style('font-family', 'Arial')
        .classed('no-pointer-events', true) // Add the no-pointer-events class to the text elements
    }

    g.selectAll('rect')
      .data(this.data)
      .join('rect')
      .attr('x', (d) => x(d.label)!)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => height - y(d.value))
      .attr('width', x.bandwidth())
      .attr('rx', this.getRoundingValue())
      .attr('ry', (d) => (this.roundedBottoms ? this.getRoundingValue() : 0))
      .each((d, i, nodes) => {
        const color = d.color || (d.color = this.getRandomColor())
        d3.select(nodes[i]).attr('fill', color).attr('data-original-color', color)
      })
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible').html(`<strong>${d.label}:</strong> ${d.value}<br>${d.note || ''}`)
        if (this.highlightBarsOnHover) {
          const originalColor = d3.select(event.currentTarget).attr('data-original-color')
          const hoverColor = this.getHoverColor(originalColor, window.matchMedia('(prefers-color-scheme: dark)').matches)
          d3.select(event.currentTarget).attr('fill', hoverColor)
        }
        if (this.emphasizeLabelsOnHover) {
          d3.select(event.currentTarget.parentNode)
            .selectAll('text')
            .filter(function () {
              return d3.select(this).text() === d.label
            })
            .style('font-weight', 'bold')
        }
      })
      .on('mousemove', (event) => {
        const [mouseX, mouseY] = d3.pointer(event)
        const tooltipWidth = tooltip.node()?.getBoundingClientRect().width || 0
        const tooltipHeight = tooltip.node()?.getBoundingClientRect().height || 0
        const containerWidth = this.clientWidth
        const containerHeight = this.clientHeight

        let posX = mouseX + tooltipWidth + 8
        let posY = mouseY + tooltipHeight / 2 + 8

        if (posX + tooltipWidth > containerWidth) {
          posX = mouseX - 8
        }

        if (posY + tooltipHeight > containerHeight) {
          posY = mouseY - 14
        }

        tooltip.style('top', `${posY}px`).style('left', `${posX}px`)
      })
      .on('mouseout', (event, d) => {
        tooltip.style('visibility', 'hidden')
        if (this.highlightBarsOnHover) {
          d3.select(event.currentTarget).attr('fill', d.color || 'var(--bar-color)')
        }
        if (this.emphasizeLabelsOnHover) {
          d3.select(event.currentTarget.parentNode).selectAll('text').style('font-weight', 'normal')
        }
      })
  }

  firstUpdated(): void {
    this.resizeObserver.observe(this)
    const svg = d3.select(this.renderRoot.querySelector('svg') as SVGElement)
    svg.attr('width', this.clientWidth).attr('height', this.clientHeight + 40) // Increase height by 40 pixels
    this.createChart()
  }

  render(): TemplateResult {
    return html`
      <svg></svg>
      <div class="tooltip"></div>
    `
  }
}
