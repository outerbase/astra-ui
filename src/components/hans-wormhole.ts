import { LitElement, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

// https://amphetamem.es/meme?id=its-always-sunny-in-philadelphia_06_10_541&timestamp=0%3A19%3A23.094&text=His+name+is+Hans+Wormhat.&dimensions=1920x1080&at=%2Fits-always-sunny-in-philadelphia%2F06%2F10%2F0-19-23-094&series=It%27s+Always+Sunny+in+Philadelphia&season=06&episodeNumber=10&episodeTitle=Charlie+Kelly+-+King+of+the+Rats
@customElement('hans-wormhole')
export class HansWormhole extends LitElement {
  @property({ type: Boolean }) open = false // only render slotted children when open

  @state() private wormhole: HTMLDivElement | null = null

  // last mouse coordinates; does NOT trigger re-render
  private x = 0
  private y = 0

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
    this.removeWormhole()
    window.removeEventListener('mousemove', this.onMouseMove)
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.createWormhole()
      } else {
        this.removeWormhole()
      }
    }
  }

  render() {
    return this.open ? nothing : html`<slot></slot>`
  }

  onMouseMove(event: MouseEvent) {
    this.x = event.clientX
    this.y = event.clientY
  }

  private createWormhole() {
    this.wormhole = document.createElement('div')
    this.wormhole.style.position = 'absolute' // Changed from 'absolute' to 'fixed'
    this.wormhole.style.zIndex = '100'
    this.wormhole.classList.add('backdrop-blur-sm')

    const content = document.createElement('div')
    this.moveContent(this, content)
    this.wormhole.appendChild(content)
    document.body.appendChild(this.wormhole)

    this.adjustPosition()
  }

  private adjustPosition() {
    if (!this.wormhole) return

    const rect = this.wormhole.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    let adjustedX = this.x
    let adjustedY = this.y

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

  private moveContent(from: Element, to: Element) {
    while (from.firstChild) {
      to.appendChild(from.firstChild)
    }
  }

  private removeWormhole() {
    if (this.wormhole && document.body.contains(this.wormhole)) {
      const content = this.wormhole.firstElementChild
      if (content) {
        this.moveContent(content, this)
      }
      document.body.removeChild(this.wormhole)
    }
    this.wormhole = null
  }
}
