import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// styles
import defaultStyles from './styles/default.js'
import freedomTheme from './themes/freedom.js'
import invasionTheme from './themes/invasion.js'
import moondustTheme from './themes/moondust.js'

// subcomponents
import './core/line-numbers.js' // Import the CoreLineNumbers component
import './core/text-area.js' // Import the CoreLineNumbers component

@customElement('universe-editor')
export class UniverseEditor extends LitElement {
  static styles = [defaultStyles, moondustTheme, invasionTheme, freedomTheme]

  @property({ type: String }) code = ''
  @property({ type: String }) language = 'sql'
  @property({ type: String }) mode = 'light'
  @property({ type: String }) theme = 'moondust'

  private handleCodeChange(event: CustomEvent): void {
    console.debug('handleCodeChange')
    this.code = event.detail.code
  }

  render() {
    return html`
      <div id="container" class="${this.theme} ${this.mode}">
        <div id="layout-container">
          <!-- left   -->
          <div id="left">
            <line-numbers .code="${this.code}"></line-numbers>
          </div>

          <!-- center -->
          <div id="center">
            <text-area .code="${this.code}" .language="${this.language}" @code-changed="${this.handleCodeChange}"></text-area>
          </div>

          <!-- right -->
          <div id="right"><slot name="right"></slot></div>
        </div>
      </div>
    `
  }
}
