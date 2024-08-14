import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

// https://amphetamem.es/meme?id=its-always-sunny-in-philadelphia_06_10_541&timestamp=0%3A19%3A23.094&text=His+name+is+Hans+Wormhat.&dimensions=1920x1080&at=%2Fits-always-sunny-in-philadelphia%2F06%2F10%2F0-19-23-094&series=It%27s+Always+Sunny+in+Philadelphia&season=06&episodeNumber=10&episodeTitle=Charlie+Kelly+-+King+of+the+Rats
@customElement('hans-wormhole')
export class HansWormhole extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }

    #wormhole {
      margin: 0;
      background-color: unset;
      border: 0;
    }

    #wormhole:not(:popover-open) {
      display: none;
    }
  `

  @property({ type: Boolean }) public open = false
  @property({ type: Number }) public atX?: number
  @property({ type: Number }) public atY?: number
  @property({ type: String }) public anchorId: string | null = null
  @query('#wormhole') private wormhole!: HTMLElement

  // last mouse coordinates; does NOT trigger re-render
  private x = 0
  private y = 0
  private slotRef = createRef<HTMLSlotElement>()

  constructor() {
    super()
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('mousemove', this.onMouseMove)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('mousemove', this.onMouseMove)
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.showWormhole()
      } else {
        this.hideWormhole()
      }
    }
  }

  render() {
    return html`
      <dialog id="wormhole" popover="manual">
        <slot ${ref(this.slotRef)}></slot>
      </dialog>
    `
  }

  private onMouseMove(event: MouseEvent) {
    this.x = event.clientX
    this.y = event.clientY
  }

  private showWormhole() {
    if ('showPopover' in this.wormhole) {
      ;(this.wormhole as any).showPopover()
    }
    this.adjustPosition()
  }

  private hideWormhole() {
    if ('hidePopover' in this.wormhole) {
      ;(this.wormhole as any).hidePopover()
    }
  }

  private adjustPosition() {
    if (!this.wormhole) return

    // use anchored position, when available
    const anchor = this.findAnchor()
    if (anchor) {
      const { x: anchorX, y: anchorY } = this.calculateMenuPosition(anchor)

      if (anchorX && anchorY) {
        this.wormhole.style.left = `${anchorX}px`
        this.wormhole.style.top = `${anchorY}px`
        return
      }
    }

    const rect = this.wormhole.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    let adjustedX = this.atX ?? this.x
    let adjustedY = this.atY ?? this.y

    if (this.x + rect.width > windowWidth) {
      adjustedX = windowWidth - rect.width
    }

    if (this.y + rect.height > windowHeight) {
      adjustedY = windowHeight - rect.height
    }

    // Ensure the wormhole doesn't go off the left or top edge
    adjustedX = Math.max(0, adjustedX)
    adjustedY = Math.max(0, adjustedY)

    this.wormhole.style.left = `${adjustedX}px`
    this.wormhole.style.top = `${adjustedY}px`
  }

  findAnchor() {
    let currentElement: HTMLElement | null = this
    while (currentElement && currentElement.id !== this.anchorId) {
      currentElement = currentElement.parentElement || ((currentElement.getRootNode() as ShadowRoot).host as HTMLElement)

      // Break the loop if we've reached the top of the DOM or a detached element
      if (!currentElement || currentElement === document.body) {
        currentElement = null
        break
      }
    }

    return currentElement
  }

  calculateMenuPosition(anchor: HTMLElement) {
    if (!this.slotRef.value) return { x: 0, y: 0 }

    const anchorRect = anchor.getBoundingClientRect()

    // Get the assigned elements of the slot
    const assignedElements = this.slotRef.value.assignedElements()
    if (assignedElements.length === 0) return { x: 0, y: 0 }

    // Measure the first assigned element (assuming it's our menu content)
    const menuElement = assignedElements[0] as HTMLElement
    const menuRect = menuElement.getBoundingClientRect()

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Initially set x and y to bottom-right of anchor
    let x = anchorRect.right
    let y = anchorRect.bottom

    // Check if there's enough space to the right
    if (x + menuRect.width > viewportWidth) {
      // If not, try positioning to the left
      x = anchorRect.left - menuRect.width
      // If still not enough space, align with left edge of viewport
      if (x < 0) x = 0
    }

    // Check if there's enough space below
    if (y + menuRect.height > viewportHeight) {
      // If not, try positioning above
      y = anchorRect.top - menuRect.height
      // If still not enough space, align with top edge of viewport
      if (y < 0) y = 0
    }

    return { x, y }
  }
}
