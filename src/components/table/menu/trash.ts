import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('no-flicker-element')
export class NoFlickerElement extends LitElement {
  static styles = css`
    :host {
      // display: none;
      width: 200px;
      height: 200px;
    }
    :host(.measured) {
      display: block;
    }
  `

  @state() private _shouldRender = false

  connectedCallback(): void {
    super.connectedCallback()
    this._measure()
  }

  private async _measure(): Promise<void> {
    // Ensure the element is in the DOM
    // await new Promise((resolve) => requestAnimationFrame(resolve))

    // Temporarily make the element visible for measurement
    this.style.display = 'block'
    this.style.visibility = 'hidden'

    // Perform the measurement
    const width = this.offsetWidth
    console.log(width)
    // Reset styles
    this.style.display = ''
    this.style.visibility = ''

    // Decide whether to render based on the measurement
    if (width >= 100) {
      // Example condition
      this._shouldRender = true
      this.classList.add('measured')
    } else {
      // Optional: remove the element if it doesn't meet the criteria
      // this.remove();
    }

    // Force a re-render
    this.requestUpdate()
  }

  render() {
    // if (!this._shouldRender) {
    //   return html``
    // }
    return html`<div>Content that is only rendered if measurement passes</div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'no-flicker-element': NoFlickerElement
  }
}
