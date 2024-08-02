import { areaY, barX, barY, dot, gridX, gridY, lineY, plot } from '@observablehq/plot'
import { max, min, utcDay, utcMonth } from 'd3'
import { css, html, type PropertyValueMap } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
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
const mercuryValues = ['#ffffff', '#747474', '#000']

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
          // stroke-dasharray: 4000; // not working as intended; this is needed for the fancy loading animation tho
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
          /* [aria-label='line'] {
            stroke-width: 4;
          } */

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

  @state() private hasUpdatedHeight = false

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

  private convertDataIntoCastedData(data: DashboardV3Chart | undefined): DashboardV3Chart | undefined {
    let temp: any = JSON.parse(JSON.stringify(data))

    // For each temp.layers castData
    temp.layers.forEach((layer: any) => {
      layer.result = this.castData(layer.result)
    })

    return temp
    //   temp.layers[0].result = this.castData(this.data?.layers?.[0].result ?? [])
    //   this.data = temp
  }

  private castData(data: Row[]): Row[] {
    if (!data) return []

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

    if (changedProperties.has('data')) {
      // update chart type
      this.type = this.data?.layers?.[0]?.type // TODO don't assume 1 layer
      this.highlights = this.data?.highlights
      // this.apiKey = this.data?.apiKey // <-- this will switch from using passed-in data to making API requests

      //////////// BRAYDEN PLEASE HELP ME
      ////////////
      //   let newArray: Row[] = []
      //   this.data?.layers?.[0].result?.forEach((r) => {
      //     const day: string = r['day'] as string
      //     // console.log('Day: ', new Date(day))
      //     newArray.push({ day: new Date(day), total_users: Number(r['total_users']) })
      //   })

      //   let temp: any = JSON.parse(JSON.stringify(this.data))
      //   temp.layers[0].result = newArray
      //   this.data = temp

      //   let temp: any = JSON.parse(JSON.stringify(this.data))
      //   temp.layers[0].result = this.castData(this.data?.layers?.[0].result ?? [])
      //   this.data = temp

      this.data = this.convertDataIntoCastedData(this.data)
      ////////////
      ////////////

      const options = this.data?.options
      if (options) {
        // this.legend = options.legend
        this.axisLabelX = options.xAxisLabel
        this.axisLabelY = options.yAxisLabel
        this.keyX = options.xAxisKey
        this.keyY = options.yAxisKeys?.[0] // TODO don't assume 1
        this.sortOrder = options.sortOrder
        // this.percent = options.percentage
        // TODO xAxisLabelDisplay, yAxisLabelDisplay, groupBy
      }
    }
  }

  private getLatestPlot() {
    const layer = this.data?.layers?.[0] // TODO don't assume 1 layer
    if (!layer) return null

    const d = layer.result
    if (!d) return null

    const defaultGridStyle = { strokeDasharray: '2', strokeOpacity: 0.1, stroke: this.theme === 'light' ? 'black' : 'white' }

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

      // Other options: https://observablehq.com/plot/features/plots#other-options
      title: this.mainTitle,
      subtitle: this.subtitle,
      caption: this.caption,

      // Scale options
      inset: this.inset,
      color: {
        type: this.colorType,
        scheme: this.colorScheme,
        // legend: this.legend,
        // range: afterburnValues // TODO: If multiple series exists, pass the array of color RGB values from dashboard.next
      },
      //   symbol: { legend: this.legend },

      // Marks option: https://observablehq.com/plot/features/plots#marks-option
      marks: [],
    }

    const tip = {
      fill: this.theme === 'dark' ? '#171717' : '#FFFFFF',
      stroke: this.theme === 'dark' ? '#262626' : '#e5e5e5',
      textPadding: 10,
      lineHeight: 1.5,
    }

    // TYPE: BAR
    if (this.type === 'bar') {
      // include grid along X-axis unless explicitly disabled
      if (this.gridX !== false) {
        options.marks.push(gridX(defaultGridStyle))
      }

      options.marks.push(
        barX(d, {
          x: this.keyX,
          y: this.keyY,
          // stroke: this.keyX,
          // fill: 'url(#teal)',
          tip,
        })
      )

      const truncate = (str: string, maxLength: number) => (str.length > maxLength ? str.substring(0, maxLength) + '...' : str)

      options.y = {
        ...options.y,
        tickFormat: (d: any) => truncate(d, 6),
      }

      options.marginLeft = 50
    }

    // TYPE: COLUMN
    if (this.type === 'column') {
      // include grid along Y-axis unless explicitly disabled
      if (this.gridY !== false) {
        options.marks.push(gridY(defaultGridStyle))
      }
      let sort = undefined

      // Loop through every item in the data layers [0].result and check if the data is a date
      const tempKeyX: string = this.keyX ?? ''
      const newArray: Date[] =
        this.data?.layers?.[0].result
          ?.map((r: Record<string, any>) => {
            const isDate = !isNaN(Date.parse(r[tempKeyX]))

            if (isDate) return new Date(r[tempKeyX])
            return undefined
          })
          .filter((r): r is Date => r !== undefined) ?? []

      // Is the data in the xAxisKey a date?
      const isXAxisKeyDate = newArray.length && newArray.every((d) => d instanceof Date)

      if (isXAxisKeyDate) {
        const startDate = min(newArray)
        const endDate = max(newArray)
        let tickValues = undefined

        if (startDate && endDate) {
          tickValues = utcMonth.range(startDate, endDate)
        }

        options.x = {
          ...options.x,
          interval: isXAxisKeyDate ? utcDay.every(1) : undefined,
          tickValues: isXAxisKeyDate ? tickValues : undefined,
        }
      } else {
        if (this.sortOrder && this.sortOrder === 'asc') {
          sort = { x: 'y', reverse: false }
        } else if (this.sortOrder && this.sortOrder === 'desc') {
          sort = { x: 'y', reverse: true }
        }
      }

      options.marks.push(
        barY(d, {
          x: this.keyX,
          y: this.keyY,
          //   stroke: this.groupBy,
          fill: 'url(#mercury)',
          inset: 0.5,
          tip,
          sort,
        })
      )
    }

    // TYPE: LINE
    if (this.type === 'line') {
      // include grid along X-axis unless explicitly disabled
      if (this.gridX !== false) {
        options.marks.push(gridX(defaultGridStyle))
      }

      const yAxisKeys = this.data?.options?.yAxisKeys ?? [this.keyY]

      if (yAxisKeys.length > 1) {
        let legendColors: any[] = []
        let legendValues: any[] = []

        this.data?.options?.yAxisKeys?.forEach((key, index) => {
          const desiredColor = this.data?.options?.yAxisKeyColors?.[key] ?? iridiumValues[index % iridiumValues.length]

          legendColors.push(desiredColor)
          legendValues.push(key)

          options.marks.push(
            lineY(d, {
              x: this.keyX,
              y: key,
              stroke: desiredColor,
              tip,
            })
          )
        })

        options.color = {
          domain: legendValues,
          range: legendColors,
          //   legend: true,
        }
      } else {
        options.marks.push(
          lineY(d, {
            x: this.keyX,
            y: this.keyY,
            stroke: this.data?.options?.groupBy ?? this.groupBy,
            tip,
          })
        )
      }

      // This shows a legend at the top if defined.
      // options.color = {
      //   domain: ['4cea4345-3bd4-448a-85cd-908f32baf94f', '25fc9ba7-d349-4533-b00a-d179ed0a9996', '7b6175d0-1a6b-425f-9a04-ac5674b6eefe'],
      //   range: [
      //     '#1f77b4', // Blue for the first user_id
      //     '#ff7f0e', // Orange for the second user_id
      //     '#2ca02c', // Green for the third user_id
      //   ],
      //   legend: true,
      // }

      // default to `nice` less explicitly set to false
      if (this.niceY !== false) this.niceY = true

      //   options.color.legend = true
      //   options.color.scheme = 'purples'
    }

    if (this.type === 'scatter') {
      options.marks.push(
        dot(d, {
          x: this.keyX,
          y: this.keyY,
          tip,
        })
      )
    }

    if (this.type === 'area') {
      options.marks.push(
        lineY(d, {
          x: this.keyX,
          y: this.keyY,
          stroke: (this.data?.options?.yAxisKeys ?? []).length > 1 ? afterburnValues : 'url(#mercury)',
          tip,
        }),

        areaY(d, {
          x: this.keyX,
          y2: this.keyY,
          fill: 'url(#mercury)',
          fillOpacity: 0.1,
        })
      )
    }

    // LABELS
    options.x = {
      ...options.x,
      label: this.axisLabelX ?? null,
      labelAnchor: 'center',
      labelArrow: 'none',
      ticks: this.ticksX,
      nice: this.niceX,
      padding: 0.3,
    }
    options.y = {
      ...options.y,
      label: this.axisLabelY ?? null,
      labelAnchor: 'top',
      labelArrow: 'none',
      ticks: this.ticksY,
      //   tickPadding: -10,
      nice: this.niceY,
    }

    // render and append the plot
    return plot(options)
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    const elements = this.shadowRoot!.querySelectorAll('rect')
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.animationDelay = `${i / 50}s`
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
        keyboard-shortcuts
        selectable-rows
        outer-border
        blank-fill
      ></astra-table>`
    } else if (this.type === 'single_value') {
      const firstRecord = this.data?.layers?.[0].result?.[0]
      const firstRecordValue = firstRecord ? firstRecord[this.keyX ?? ''] : ''
      const style = this.sizeX === 1 && this.sizeY === 1 ? 'font-size: 30px; line-height: 36px;' : 'font-size: 60px; line-height: 68px;'
      plot = html`<div
        style=${`font-family: Inter, sans-serif; ${style}`}
        class=${`${this.theme === 'dark' ? 'text-neutral-50' : 'text-neutral-950'} font-bold`}
      >
        ${firstRecordValue}
      </div>`
    } else if (this.type === 'text') {
      plot = html`<astra-text variant="h1">text</astra-text>`
    } else plot = this.getLatestPlot()

    const decoratedPlot = html`<div
      class=${`${this.type === 'table' ? `${this.theme === 'dark' ? '!bg-black' : '!bg-white'}` : ''} selection:bg-violet-500/20 text-zinc-400 dark:text-zinc-600 h-full flex items-end`}
    >
      ${plot}
    </div>`

    const themedPlot = html`<div
      id="themed-plot"
      class="${classMap({ dark: this.theme === 'dark', '*:fade barY *:animate-fade w-full h-full relative': true })}"
    >
      ${decoratedPlot}
    </div>`

    /**
     * TODO:
     *
     * This is very much a hack to force the chart to be the size of the appropriate
     * container when the Chart is hosted inside of a `ComposedChart` component. Without
     * it the height requires either a fixed pixel value or aspect ratio to be set.
     * The unfortunate part at the moment is the height is dynamic as it's a flex container
     * and not known until the `#chart` element is rendered.
     *
     * So the following code will look at `#chart` and use it's height to force that
     * pixel value to be on the Plotly chart. The problem here is that when the AstraChart
     * component is used standalone and not within the ComposedChart component, the
     * `#chart` element is not present and the height will be 0.
     */
    if (!this.hasUpdatedHeight) {
      setTimeout(() => {
        // Get height of `themedPlot` and set it as the height of the component
        const findThemedPlot = this.shadowRoot?.querySelector('#chart')
        const { height } = findThemedPlot?.getBoundingClientRect() ?? { height: 0 }

        this.height = height
        this.hasUpdatedHeight = true
      }, 0)
    }

    return html`${gradients} ${themedPlot}`
  }
}
