import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import defaultStyles from './styles/default.js'
import freedomTheme from './themes/freedom.js'
import invasionTheme from './themes/invasion.js'
import moondustTheme from './themes/moondust.js'

import './core/core-line-numbers.js' // Import the CoreLineNumbers component

@customElement('universe-editor')
export class UniverseEditor extends LitElement {
  @property({ type: String }) code = ''
  @property({ type: String }) language = ''
  @property({ type: String }) mode = 'light'
  @property({ type: String }) theme = 'moondust'

  private containerRef: Ref<HTMLElement> = createRef()
  private layoutContainerRef: Ref<HTMLElement> = createRef()

  static styles = [defaultStyles, moondustTheme, invasionTheme, freedomTheme]

  private plugins = [
    { tag: 'core-line-numbers', location: 'left' },
    // Add more plugins here
  ]

  render() {
    console.log('Rendering UniverseEditor with plugins:', this.plugins) // Debugging
    return html`
      <div ${ref(this.containerRef)} class="${this.theme} ${this.mode}">
        <div ${ref(this.layoutContainerRef)} class="${this.mode}">
          <div id="left">${this.renderPlugins('left')}</div>
          <div id="center">${this.renderPlugins('center')}</div>
          <div id="right">${this.renderPlugins('right')}</div>
        </div>
      </div>
    `
  }

  private renderPlugins(location: string) {
    return html`
      ${this.plugins
        .filter((plugin) => plugin.location === location)
        .map((plugin) => {
          const element = document.createElement(plugin.tag)
          element.setAttribute('location', plugin.location)
          element.setAttribute('editorValue', this.code)
          return element
        })
        .map((element) => html`${element}`)}
    `
  }
}
