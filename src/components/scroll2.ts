import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ClassifiedElement } from './classified-element.js'

@customElement('custom-scrollbar')
export class CustomScrollbar extends ClassifiedElement {
  @property({ type: Number }) scrollLeft = 0
  @property({ type: Number }) scrollTop = 0
  @property({ type: Number }) scrollWidth = 0
  @property({ type: Number }) scrollHeight = 0
  @property({ type: Number }) clientWidth = 0
  @property({ type: Number }) clientHeight = 0

  @query('.content-wrapper') private contentWrapper!: HTMLElement

  static styles = [
    ...ClassifiedElement.styles,
    css`
      :host {
        display: block;
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
      }

      .content-wrapper {
        width: 100%;
        height: 100%;
        overflow: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .content-wrapper::-webkit-scrollbar {
        display: none;
      }

      .scrollbar {
        position: absolute;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .scrollbar:hover,
      .scrollbar.active {
        opacity: 1;
      }

      .scrollbar-x {
        bottom: 0;
        left: 0;
        width: calc(100% - 8px);
        height: 8px;
      }

      .scrollbar-y {
        top: 0;
        right: 0;
        width: 8px;
        height: calc(100% - 8px);
      }

      .scrollbar-thumb {
        position: absolute;
        border-radius: 4px;
        transition: background-color 0.3s;
      }

      .scrollbar-thumb-x {
        height: 100%;
      }

      .scrollbar-thumb-y {
        width: 100%;
      }

      .scrollbar-y {
        top: 0;
        right: 0;
        width: 8px;
        height: 100%;
      }
    `,
  ]

  private resizeObserver: ResizeObserver
  private isScrolling = false
  private scrollTimeout: number | null = null

  constructor() {
    super()
    this.resizeObserver = new ResizeObserver(() => this.updateScrollInfo())
  }

  firstUpdated() {
    this.resizeObserver.observe(this)
    this.resizeObserver.observe(this.contentWrapper)
    this.contentWrapper.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.resizeObserver.unobserve(this)
    this.resizeObserver.unobserve(this.contentWrapper)
    this.contentWrapper.removeEventListener('scroll', this.handleScroll.bind(this))
  }

  handleScroll() {
    this.updateScrollInfo()
    this.isScrolling = true
    this.requestUpdate()

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }

    this.scrollTimeout = window.setTimeout(() => {
      this.isScrolling = false
      this.requestUpdate()
    }, 1000)
  }

  updateScrollInfo() {
    this.scrollLeft = this.contentWrapper.scrollLeft
    this.scrollTop = this.contentWrapper.scrollTop
    this.scrollWidth = this.contentWrapper.scrollWidth
    this.scrollHeight = this.contentWrapper.scrollHeight
    this.clientWidth = this.contentWrapper.clientWidth
    this.clientHeight = this.contentWrapper.clientHeight
    this.requestUpdate()
  }

  render() {
    const showX = this.scrollWidth > this.clientWidth
    const showY = this.scrollHeight > this.clientHeight

    const scrollbarWidth = 8 // Width of the scrollbar
    const availableHeight = this.clientHeight - (showX ? scrollbarWidth : 0)
    const availableWidth = this.clientWidth - (showY ? scrollbarWidth : 0)

    const thumbYHeight = Math.max((availableHeight / this.scrollHeight) * availableHeight, 20)
    const thumbYTop = (this.scrollTop / (this.scrollHeight - availableHeight)) * (availableHeight - thumbYHeight)

    const thumbXWidth = Math.max((availableWidth / this.scrollWidth) * availableWidth, 20)
    const thumbXLeft = (this.scrollLeft / (this.scrollWidth - availableWidth)) * (availableWidth - thumbXWidth)

    const scrollGrabHandleClasses = `bg-neutral-200/60 dark:bg-neutral-700/50 hover:bg-neutral-300 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-700`

    return html`
      <div class="content-wrapper">
        <slot></slot>
      </div>
      ${showX
        ? html`
            <div class="scrollbar scrollbar-x ${this.isScrolling ? 'active' : ''}">
              <div
                class="scrollbar-thumb scrollbar-thumb-x ${scrollGrabHandleClasses}"
                style="width: ${thumbXWidth}px; left: ${thumbXLeft}px;"
                @mousedown="${(e: MouseEvent) => this.startDragging(e, 'x')}"
              ></div>
            </div>
          `
        : ''}
      ${showY
        ? html`
            <div class="scrollbar scrollbar-y ${this.isScrolling ? 'active' : ''}">
              <div
                class="scrollbar-thumb scrollbar-thumb-y ${scrollGrabHandleClasses}"
                style="height: ${thumbYHeight}px; top: ${thumbYTop}px;"
                @mousedown="${(e: MouseEvent) => this.startDragging(e, 'y')}"
              ></div>
            </div>
          `
        : ''}
    `
  }

  startDragging(e: MouseEvent, direction: 'x' | 'y') {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startScrollLeft = this.scrollLeft
    const startScrollTop = this.scrollTop

    const thumb = e.target as HTMLElement
    thumb.classList.add('active')

    const handleMouseMove = (e: MouseEvent) => {
      if (direction === 'x') {
        const deltaX = e.clientX - startX
        const percentMoved = deltaX / this.clientWidth
        this.contentWrapper.scrollLeft = startScrollLeft + percentMoved * this.scrollWidth
      } else {
        const deltaY = e.clientY - startY
        const percentMoved = deltaY / this.clientHeight
        this.contentWrapper.scrollTop = startScrollTop + percentMoved * this.scrollHeight
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      thumb.classList.remove('active')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}
