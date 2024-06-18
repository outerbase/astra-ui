import { LitElement, html, type PropertyValueMap } from 'lit'
import { property } from 'lit/decorators.js'
import { TWStyles } from '../lib/.tw-styles.js'
import classMapToClassName from '../lib/class-map-to-class-name.js'

// ClassifiedElement provides the `classMap` delegate for determining which classes to apply to the component
// is propogated to the DOM and therefore it's CSS is applied
export class ClassifiedElement extends LitElement {
  static override styles = [TWStyles]

  // classMap is a pairing of class(es) (a string) with a boolean expression
  // such that only the truthy values are rendered out and the rest are dropped
  // if a property used in such a boolean expression changes, this value is recomputed
  protected classMap() {
    return {
      dark: this.theme === 'dark',
    }
  }

  @property({ attribute: 'theme', type: String })
  public theme = 'light'

  @property({ reflect: true, attribute: 'class', type: String })
  public _class: string = this.theme

  public override willUpdate(changedProperties: PropertyValueMap<this>): void {
    super.willUpdate(changedProperties)

    // ensure `_class` reflects our latest state
    this._class = classMapToClassName(this.classMap())
  }

  // this render() looks like it does next-to-nothing,
  // but our component itself is being rendered,
  // and it's appearance/style is provided by each component's `get _componentsInitialClassAttribute() {}` override
  // i.e. `table` vs `table-row-group` vs `table-cell` vs ...etc...
  public override render() {
    return html`<slot></slot>`
  }
}
