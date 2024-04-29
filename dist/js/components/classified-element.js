var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { TWStyles } from '../lib/.tw-styles.js';
import classMapToClassName from '../lib/class-map-to-class-name.js';
import { Theme } from '../types.js';
// ClassifiedElement provides the `classMap` delegate for determining which classes to apply to the component
// is propogated to the DOM and therefore it's CSS is applied
export class ClassifiedElement extends LitElement {
    constructor() {
        super(...arguments);
        this.theme = Theme.light;
        this._class = this.theme;
    }
    // classMap is a pairing of class(es) (a string) with a boolean expression
    // such that only the truthy values are rendered out and the rest are dropped
    // if a property used in such a boolean expression changes, this value is recomputed
    classMap() {
        return {
            dark: this.theme == Theme.dark,
        };
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        // ensure `_class` reflects our latest state
        this._class = classMapToClassName(this.classMap());
    }
    // this render() looks like it does next-to-nothing,
    // but our component itself is being rendered,
    // and it's appearance/style is provided by each component's `get _componentsInitialClassAttribute() {}` override
    // i.e. `table` vs `table-row-group` vs `table-cell` vs ...etc...
    render() {
        return html `<slot></slot>`;
    }
}
ClassifiedElement.styles = [TWStyles];
__decorate([
    property({ attribute: 'theme', type: String })
], ClassifiedElement.prototype, "theme", void 0);
__decorate([
    property({ reflect: true, attribute: 'class', type: String })
], ClassifiedElement.prototype, "_class", void 0);
