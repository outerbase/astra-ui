import { customElement } from 'lit/decorators.js'
import { ClassifiedElement } from '../classified-element.js'

// tl;dr <thead/>, table-header-group
@customElement('outerbase-thead')
export class THead extends ClassifiedElement {
    protected override classMap() {
        return { 'table-header-group sticky z-[2] top-0': true, ...super.classMap() }
    }
}
