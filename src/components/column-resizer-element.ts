import { html, type PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ResizeEndEvent, ResizeEvent, ResizeStartEvent } from '../lib/events.js'
import { Theme } from '../types.js'
import { ClassifiedElement } from './classified-element.js'
import type { TH } from './table/th.js'

@customElement('column-resizer')
export class ColumnResizer extends ClassifiedElement {
  @property({ type: Number, attribute: 'height' })
  public height?: number

  // this successfully sets/receives `column` when `.column={...}` is passed
  // but it's unclear whether updates to `.column` are reflected
  // the docs explicitly say it won't be observed, but it has been tested to definitely work on the initial render
  @property({ type: Object })
  public column?: TH

  private xPosition?: number
  private width?: number

  private onMouseDown(downEvent: MouseEvent) {
    if (!this.column) throw new Error('`column` is unset; aborting')
    const v = this.column.value ?? this.column.originalValue ?? ''

    this.dispatchEvent(new ResizeStartEvent(v))

    const _mouseMove = (moveEvent: MouseEvent) => {
      if (!this.column) throw new Error('`column` is unset; aborting')
      if (!this.xPosition) throw new Error('`xPosition` is unset; aborting')
      if (!this.width) throw new Error('`width` is unset; aborting')

      this.dispatchEvent(new ResizeEvent(v, moveEvent.clientX - this.xPosition))
    }

    const _mouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mouseup', _mouseUp)
      document.removeEventListener('mousemove', _mouseMove)

      if (!this.column) throw new Error('`column` is unset; aborting')
      this.dispatchEvent(new ResizeEndEvent(v, this.xPosition ? upEvent.clientX - this.xPosition : 0))
    }

    document.addEventListener('mousemove', _mouseMove)
    document.addEventListener('mouseup', _mouseUp)

    this.xPosition = downEvent.clientX
    this.width = parseInt(window.getComputedStyle(this.column).width, 10)
  }

  public override connectedCallback() {
    super.connectedCallback()
    this.addEventListener('mousedown', this.onMouseDown)
  }

  public override disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('mousedown', this.onMouseDown)
  }

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    if (changedProperties.has('height')) {
      // document.documentElement.style.setProperty('--table-height', `${this.height}px`)
    }
  }

  public override render() {
    const classes = classMap({
      'absolute z-[1] top-0 bottom-0 -right-[7px] w-4': true,
      'flex justify-center': true,
      'cursor-col-resize group': true,
      dark: this.theme == Theme.dark,
    })

    // the reason for nested div's here is to increase the click/draggable area while preserving a smaller visual element
    return html`
      <div class=${classes}>
        <div
          class="h-full ml-[1px] w-[1px] group-hover:w-1 group-active:w-1 bg-theme-table-border dark:bg-theme-table-border-dark group-hover:bg-blue-400 group-active:bg-blue-500 dark:group-hover:bg-blue-900 dark:group-active:bg-blue-800"
        ></div>
      </div>
    `
  }
}
