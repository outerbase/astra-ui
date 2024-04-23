import { LitElement, type PropertyValueMap } from 'lit'
import { property } from 'lit/decorators.js'

import { TWStyles } from '../lib/tailwind.js'
import { Theme } from './types.js'

// ClassifiedElement provides the `classMap` delegate for determining which classes to apply to the component
// is propogated to the DOM and therefore it's CSS is applied
export class ClassifiedElement extends LitElement {
    static override styles = [TWStyles]

    @property({ attribute: 'theme', type: String })
    public theme = Theme.light

    @property({ reflect: true, attribute: 'class', type: String })
    public _class = this.theme == Theme.dark ? 'dark' : ''

    public override willUpdate(changedProperties: PropertyValueMap<this>): void {
        super.willUpdate(changedProperties)

        // ensure `_class` reflects our latest state
        if (changedProperties.has('theme')) this._class = this.theme == Theme.dark ? 'dark' : ''
    }
}
