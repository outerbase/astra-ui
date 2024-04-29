import { css, html, type PropertyValueMap } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { state } from 'lit/decorators/state.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import debounce from 'lodash-es/debounce.js'

import { Axis, Theme } from '../types'
import { ClassifiedElement } from './classified-element'

@customElement('astra-scroll-area')
export default class ScrollArea extends ClassifiedElement {
  static override styles = [
    ...ClassifiedElement.styles,
    css`
      /* Hide scrollbar for Chrome, Safari and Opera */
      ::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
      }

      /* Hide scrollbar for IE, Edge, and Firefox */
      :host {
        -ms-overflow-style: none; /* for Internet Explorer and Edge */
        scrollbar-width: none; /* for Firefox */
      }
    `,
  ]

  @property() public onScroll?: () => void
  @property({ type: Number }) public threshold = 0
  @property() public scroller: Ref<HTMLDivElement> = createRef()
  @property() public rightScrollZone: Ref<HTMLDivElement> = createRef()
  @property() public rightScrollHandle: Ref<HTMLDivElement> = createRef()
  @property() public bottomScrollZone: Ref<HTMLDivElement> = createRef()
  @property() public bottomScrollHandle: Ref<HTMLDivElement> = createRef()
  @property() public hasHoveringCursor = false
  @property() public axis = Axis.both

  @state() protected isDragging = false
  @state() protected verticalScrollPosition = 0
  @state() protected horizontalScrollPosition = 0
  @state() protected verticalScrollSize = 0
  @state() protected horizontalScrollSize = 0

  protected horizontalScrollProgress = 0
  protected verticalScrollProgress = 0
  protected previousScrollPosition?: number

  private pendingMouseLeave?: number
  private startX = 0
  private startY = 0
  private scrollStartX = 0
  private scrollStartY = 0

  constructor() {
    super()
    this._onScroll = this._onScroll ? debounce(this._onScroll, 10).bind(this) : this._onScroll.bind(this)

    this.updateScrollerSizeAndPosition = this.updateScrollerSizeAndPosition.bind(this)
    this.onWheelVerticalScroller = this.onWheelVerticalScroller.bind(this)
    this.onWheelHorizontalScroller = this.onWheelHorizontalScroller.bind(this)
    this.onHorizontalScrollerHandleMouseDown = this.onHorizontalScrollerHandleMouseDown.bind(this)
    this.onVerticalScrollerHandleMouseDown = this.onVerticalScrollerHandleMouseDown.bind(this)
  }

  // maintains the appearance of our scrollers (horizontal + vertical)
  private updateScrollerSizeAndPosition(_event?: Event) {
    // vertical
    if ([Axis.both, Axis.vertical].includes(this.axis)) {
      const scrollTop = this.scroller.value?.scrollTop ?? 0
      const scrollHeight = this.scroller.value?.scrollHeight ?? 0
      const scrollHeightCoEfficient = (this.scroller.value?.clientHeight ?? 0) / scrollHeight

      this.verticalScrollSize = scrollHeightCoEfficient === 1 ? 0 : (this.scroller.value?.clientHeight ?? 0) * scrollHeightCoEfficient // 0 when nothing to scroll
      this.verticalScrollProgress = scrollTop / scrollHeight
      this.verticalScrollPosition = this.verticalScrollProgress * (this.scroller.value?.clientHeight ?? 0)
    }

    // horizontal
    if ([Axis.both, Axis.horizontal].includes(this.axis)) {
      const scrollWidth = this.scroller.value?.scrollWidth ?? 0
      const scrollLeft = this.scroller.value?.scrollLeft ?? 0
      const scrollWidthCoEfficient = (this.scroller.value?.clientWidth ?? 0) / scrollWidth
      const horizontalScrollHandleWidth =
        scrollWidthCoEfficient === 1 ? 0 : (this.scroller.value?.clientWidth ?? 0) * scrollWidthCoEfficient // 0 when nothing to scroll
      this.horizontalScrollProgress = scrollLeft / scrollWidth
      this.horizontalScrollSize = horizontalScrollHandleWidth
      this.horizontalScrollPosition = this.horizontalScrollProgress * (this.scroller.value?.clientWidth ?? 0)
    }
  }

  // trigger `onScroll` when scrolling distance >= threshold (for the sake of optimizing performance)
  private _onScroll(_event: Event) {
    const previous = this.previousScrollPosition ?? 0
    const current = this.scroller.value?.scrollTop ?? 0
    const difference = Math.abs(previous - current)
    if (difference > this.threshold) {
      this.previousScrollPosition = current
      if (typeof this.onScroll === 'function') {
        this.onScroll()
      }
    }
  }

  protected onClickVerticalScroller(event: MouseEvent) {
    if (this.scroller.value) {
      const clickedAtCoef = (event.clientY - this.getBoundingClientRect().top) / this.scroller.value?.clientHeight
      this.scroller.value.scrollTop = clickedAtCoef * (this.scroller.value?.scrollHeight ?? 0) - this.verticalScrollSize
    }
  }

  protected onClickHorizontalScroller(event: MouseEvent) {
    if (this.scroller.value) {
      const clickedAtCoef = (event.clientX - this.getBoundingClientRect().left) / this.scroller.value?.clientWidth
      this.scroller.value.scrollLeft = clickedAtCoef * (this.scroller.value?.scrollWidth ?? 0) - this.horizontalScrollSize
    }
  }

  protected onWheelHorizontalScroller(event: WheelEvent) {
    if (this.scroller.value) {
      this.scroller.value.scrollLeft += event.deltaX
    }
  }

  protected onWheelVerticalScroller(event: WheelEvent) {
    if (this.scroller.value) {
      this.scroller.value.scrollTop += event.deltaY
    }
  }

  protected onHorizontalScrollerHandleMouseDown(mouseDownEvent: MouseEvent) {
    mouseDownEvent.preventDefault() // Prevent text selection/dragging behavior

    this.startX = mouseDownEvent.pageX // Starting X position of the mouse
    this.scrollStartX = this.scroller.value?.scrollLeft ?? 0 // Starting scroll position
    // document.body.classList.add('user-select-none') // Optional: Disable text selection during drag

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const deltaX = mouseMoveEvent.pageX - this.startX // Calculate mouse movement
      const scrollWidth = this.scroller.value?.scrollWidth ?? 0
      const scrollWidthCoEfficient = (this.scroller.value?.clientWidth ?? 0) / scrollWidth
      if (this.scroller.value) this.scroller.value.scrollLeft = this.scrollStartX + deltaX / scrollWidthCoEfficient
    }

    const onMouseUp = (_event: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)

      // document.body.classList.remove('user-select-none') // Re-enable text selection after dragging
    }

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
  }

  protected preventDefault(event: Event) {
    event.preventDefault()
  }

  protected onVerticalScrollerHandleMouseDown(mouseDownEvent: MouseEvent) {
    mouseDownEvent.preventDefault() // Prevent text selection/dragging behavior

    this.startY = mouseDownEvent.pageY // Starting X position of the mouse
    this.scrollStartY = this.scroller.value?.scrollTop ?? 0 // Starting scroll position
    // document.body.classList.add('user-select-none') // Optional: Disable text selection during drag

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      mouseMoveEvent.preventDefault()
      const deltaY = mouseMoveEvent.pageY - this.startY // Calculate mouse movement
      const scrollHeight = this.scroller.value?.scrollHeight ?? 0
      const scrollHeightCoEfficient = (this.scroller.value?.clientHeight ?? 0) / scrollHeight
      if (this.scroller.value) this.scroller.value.scrollTop = this.scrollStartY + deltaY / scrollHeightCoEfficient
    }

    const onMouseUp = (_event: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)

      // document.body.classList.remove('user-select-none') // Re-enable text selection after dragging
    }

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
  }

  public override connectedCallback(): void {
    super.connectedCallback()

    setTimeout(() => {
      this.scroller.value?.addEventListener('scroll', this.updateScrollerSizeAndPosition, { passive: true })
      this.scroller.value?.addEventListener('scroll', this._onScroll, { passive: true })
      this.scroller.value?.addEventListener('scrollend', this._onScroll, { passive: true })

      this.rightScrollZone.value?.addEventListener('wheel', this.onWheelVerticalScroller, { passive: true })
      this.bottomScrollZone.value?.addEventListener('wheel', this.onWheelHorizontalScroller, { passive: true })

      this.bottomScrollHandle.value?.addEventListener('mousedown', this.onHorizontalScrollerHandleMouseDown)
      this.rightScrollHandle.value?.addEventListener('mousedown', this.onVerticalScrollerHandleMouseDown)

      this.rightScrollZone.value?.addEventListener('contextmenu', this.preventDefault)
      this.bottomScrollZone.value?.addEventListener('contextmenu', this.preventDefault)
      this.bottomScrollHandle.value?.addEventListener('contextmenu', this.preventDefault)
      this.rightScrollHandle.value?.addEventListener('contextmenu', this.preventDefault)
    }, 0)
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback()

    // remove event listeners
    this.scroller.value?.removeEventListener('scroll', this.updateScrollerSizeAndPosition)
    this.scroller.value?.removeEventListener('scroll', this._onScroll)
    this.scroller.value?.removeEventListener('scrollend', this._onScroll)

    this.rightScrollZone.value?.removeEventListener('wheel', this.onWheelVerticalScroller)
    this.bottomScrollZone.value?.removeEventListener('wheel', this.onWheelHorizontalScroller)

    this.bottomScrollHandle.value?.removeEventListener('mousedown', this.onHorizontalScrollerHandleMouseDown)
    this.rightScrollHandle.value?.removeEventListener('mousedown', this.onVerticalScrollerHandleMouseDown)

    this.rightScrollZone.value?.removeEventListener('contextmenu', this.preventDefault)
    this.bottomScrollZone.value?.removeEventListener('contextmenu', this.preventDefault)
    this.bottomScrollHandle.value?.removeEventListener('contextmenu', this.preventDefault)
    this.rightScrollHandle.value?.removeEventListener('contextmenu', this.preventDefault)
  }

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    if (changedProperties.has('theme')) {
      this.requestUpdate('class')
    }

    if (changedProperties.has('hasHoveringCursor')) {
      // ensure scrollers appear on initial appearance
      if (this.hasHoveringCursor) this.updateScrollerSizeAndPosition()
    }
  }

  public override render() {
    const scrollGrabHandleClasses = {
      'w-full rounded-md': true,
      'bg-neutral-200/60 dark:bg-neutral-700/50': true,
      'hover:bg-neutral-300 dark:hover:bg-neutral-700': true,
      'active:bg-neutral-300 dark:active:bg-neutral-700': true,
    }
    const scrollTrackGutterClasses = {
      'z-50 absolute right-0 bottom-0 m-0.5': true,
      'transition-opacity duration-300': true,
      'opacity-0': !this.hasHoveringCursor,
      'opacity-100': this.hasHoveringCursor,
    }
    const verticalHandleStyles = {
      transform: `translateY(${this.verticalScrollPosition}px)`,
      height: `${this.verticalScrollSize}px`,
    }
    const horizontalHandleStyles = {
      transform: `translateX(${this.horizontalScrollPosition}px)`,
      width: `${this.horizontalScrollSize}px`,
    }
    const scrollableClasses = {
      'absolute bottom-0 left-0 right-0 top-0': true,
      'overflow-scroll': this.axis === Axis.both,
      'overflow-x-scroll overflow-y-hidden': this.axis === Axis.horizontal,
      'overflow-y-scroll overflow-x-hidden': this.axis === Axis.vertical,
    }

    return html`<!-- this comment exists to force the next line onto the next line -->
      <div
        @mouseleave=${() => {
          this.pendingMouseLeave = setTimeout(() => {
            this.hasHoveringCursor = false
            delete this.pendingMouseLeave
          }, 1000) as unknown as number
        }}
        @mouseenter=${() => {
          this.hasHoveringCursor = true
          clearTimeout(this.pendingMouseLeave)
          delete this.pendingMouseLeave
        }}
        class=${classMap({ dark: this.theme == Theme.dark })}
      >
        <div
          class=${classMap({ ...scrollTrackGutterClasses, 'top-0 w-1.5': true })}
          ${ref(this.rightScrollZone)}
          @click=${this.onClickVerticalScroller}
        >
          <div style=${styleMap(verticalHandleStyles)} class=${classMap(scrollGrabHandleClasses)} ${ref(this.rightScrollHandle)}></div>
        </div>

        <div
          class=${classMap({ ...scrollTrackGutterClasses, 'left-0': true })}
          ${ref(this.bottomScrollZone)}
          @click=${this.onClickHorizontalScroller}
        >
          <div
            style=${styleMap(horizontalHandleStyles)}
            class=${classMap({ ...scrollGrabHandleClasses, 'h-1.5': true })}
            ${ref(this.bottomScrollHandle)}
          ></div>
        </div>

        <div class=${classMap(scrollableClasses)} ${ref(this.scroller)}>
          <slot></slot>
        </div>
      </div>`
  }
}
