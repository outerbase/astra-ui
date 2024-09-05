import { LitElement, css, html } from 'lit'
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
      overflow: visible;
    }

    dialog::backdrop {
      display: none;
    }

    :host([backdrop]) dialog::backdrop {
      display: block;
      background-color: var(--astra-menu-backdrop-color, rgba(0, 0, 0, 0.2));
      backdrop-filter: blur(var(--astra-menu-backdrop-blur, 1px));
      -webkit-backdrop-filter: blur(var(--astra-menu-backdrop-blur, 1px));
      -moz-backdrop-filter: blur(var(--astra-menu-backdrop-blur, 1px));
      -o-backdrop-filter: blur(var(--astra-menu-backdrop-blur, 1px));
      -ms-backdrop-filter: blur(var(--astra-menu-backdrop-blur, 1px));
    }
  `

  @property({ type: Boolean }) public open = false
  @property({ type: Number }) public atX?: number
  @property({ type: Number }) public atY?: number
  @property({ type: String }) public anchorId: string | null = null
  @property({ type: Boolean, attribute: 'backdrop' }) public backdrop = false
  @property({ type: Boolean, attribute: 'modal' }) public modal = false
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

    if (changedProperties.has('open') && changedProperties.get('open') !== undefined) {
      if (this.open) {
        this.showWormhole()
      } else {
        this.hideWormhole()
      }
    }
  }

  render() {
    return this.modal
      ? html`
          <dialog id="wormhole">
            <slot ${ref(this.slotRef)}></slot>
          </dialog>
        `
      : html`
          <div id="wormhole" popover="manual">
            <slot ${ref(this.slotRef)}></slot>
          </div>
        `
  }

  private showWormhole() {
    if (this.modal) (this.wormhole as any).showModal()
    else (this.wormhole as any).showPopover()
    this.adjustPosition()
  }

  private hideWormhole() {
    if (this.modal as any) (this.wormhole as any).close()
    else (this.wormhole as any).hidePopover()
  }

  private onMouseMove(event: MouseEvent) {
    this.x = event.clientX
    this.y = event.clientY
  }

  private adjustPosition() {
    if (!this.wormhole) return

    const rect = this.wormhole.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x: number
    let y: number

    const anchor = this.findAnchor()
    if (anchor) {
      ;({ x, y } = this.calculateMenuPosition(anchor))
    } else {
      x = this.atX ?? this.x
      y = this.atY ?? this.y
    }

    // Ensure the wormhole stays within the viewport
    x = Math.max(0, Math.min(x, viewportWidth - rect.width))
    y = Math.max(0, Math.min(y, viewportHeight - rect.height))

    this.wormhole.style.left = `${x}px`
    this.wormhole.style.top = `${y}px`
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
    const spaceLeft = anchorRect.left
    const spaceRight = viewportWidth - anchorRect.right
    const spaceBelow = viewportHeight - anchorRect.bottom
    const spaceAbove = anchorRect.top

    // Determine horizontal position
    let x: number
    if (spaceLeft >= menuRect.width) {
      // Position to the left if there's enough space, aligning right edges
      x = anchorRect.right - menuRect.width
    } else if (spaceRight >= menuRect.width) {
      // Position to the right if there's not enough space on the left
      x = anchorRect.right
    } else {
      // If neither side has enough space, align with the side that has more space
      x = spaceLeft > spaceRight ? 0 : viewportWidth - menuRect.width
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

    // Ensure the menu stays within the viewport
    x = Math.max(0, Math.min(x, viewportWidth - menuRect.width))
    y = Math.max(0, Math.min(y, viewportHeight - menuRect.height))

    return { x, y }
  }
}
