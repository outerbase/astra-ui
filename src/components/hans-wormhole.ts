import { LitElement, css, html, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

// https://amphetamem.es/meme?id=its-always-sunny-in-philadelphia_06_10_541&timestamp=0%3A19%3A23.094&text=His+name+is+Hans+Wormhat.&dimensions=1920x1080&at=%2Fits-always-sunny-in-philadelphia%2F06%2F10%2F0-19-23-094&series=It%27s+Always+Sunny+in+Philadelphia&season=06&episodeNumber=10&episodeTitle=Charlie+Kelly+-+King+of+the+Rats
@customElement('hans-wormhole')
export class HansWormhole extends LitElement {
  static styles = css`
    #wormhole {
      margin: 0;
      padding: 0;
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
    super.updated(changedProperties)

    if (changedProperties.has('open')) {
      if (this.open) {
        this.showWormhole()
      } else {
        this.hideWormhole()
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    console.log('wormhole', this.wormhole)
    this.wormhole.addEventListener('toggle', (event) => {
      console.log('event.newState', event.newState)
      if (event.newState === 'closed') {
        console.log('Popover was closed')
        this.open = false
        this.dispatchEvent(new Event('close'))
        // Your code here for when the popover closes
      }
    })
  }

  render() {
    return html`
      <div id="wormhole" popover ?open=${this.open}>
        <slot ${ref(this.slotRef)}></slot>
      </div>
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

  findAnchor(): HTMLElement | null {
    let currentElement: Node | null = this

    while (currentElement && currentElement !== document) {
      // Check if the current element is the anchor
      if (currentElement instanceof HTMLElement && currentElement.id === this.anchorId) {
        return currentElement
      }

      // Move to the parent element
      if (currentElement.parentNode) {
        currentElement = currentElement.parentNode
      }
      // If we're at a shadow root, move to the host element
      else if (currentElement instanceof ShadowRoot) {
        currentElement = currentElement.host
      }
      // If we can't go up further, break the loop
      else {
        break
      }
    }

    // If we've reached here, we didn't find the anchor
    return null
  }

  calculateMenuPosition(anchor: HTMLElement): { x: number; y: number } {
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

    // Calculate available space in each direction
    const spaceRight = viewportWidth - anchorRect.right
    const spaceLeft = anchorRect.left
    const spaceBelow = viewportHeight - anchorRect.bottom
    const spaceAbove = anchorRect.top

    // Determine horizontal position
    let x: number
    if (spaceRight >= menuRect.width) {
      // Position to the right if there's enough space
      x = anchorRect.left
    } else if (spaceLeft >= menuRect.width) {
      // Position to the left if there's enough space
      x = anchorRect.right - menuRect.width
    } else {
      // If neither side has enough space, align with the side that has more space
      x = spaceRight > spaceLeft ? viewportWidth - menuRect.width : 0
    }

    // Determine vertical position
    let y: number
    if (spaceBelow >= menuRect.height) {
      // Position below if there's enough space
      y = anchorRect.bottom + 4
    } else if (spaceAbove >= menuRect.height) {
      // Position above if there's enough space
      y = anchorRect.top - menuRect.height - 4
    } else {
      // If neither above nor below has enough space, align with the side that has more space
      y = spaceBelow > spaceAbove ? viewportHeight - menuRect.height : 0
    }

    return { x, y }
  }
}
