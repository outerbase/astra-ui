var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import baseStyles from '../lib/base-styles.js';
var Size;
(function (Size) {
    Size["base"] = "base";
    Size["small"] = "small";
    Size["compact"] = "compact";
})(Size || (Size = {}));
let AstraCard = class AstraCard extends LitElement {
    constructor() {
        super(...arguments);
        this.size = Size.base;
    }
    render() {
        return html `
            <section class="size-${this.size}">
                <slot></slot>
            </section>
        `;
    }
};
AstraCard.styles = [
    baseStyles,
    css `
            section {
                display: flex;
                flex-direction: column;
                gap: 8px;
                font-weight: 500;
                font-family: var(--astra-font-family);
                color: black;
                background: var(--astra-neutral-100);
                border: 1px solid var(--astra-neutral-200);
                border-radius: 6px;
            }

            .size-base {
                padding: 12px;
                gap: 8px;
            }

            .size-small {
                padding: 8px;
                gap: 4px;
            }

            .size-compact {
                padding: 4px;
                gap: 2px;
            }

            @media (prefers-color-scheme: dark) {
                div {
                    background: var(--astra-neutral-900);
                    border: 1px solid var(--astra-neutral-800);
                    color: white;
                }
            }
        `,
];
__decorate([
    property({ type: String })
], AstraCard.prototype, "size", void 0);
AstraCard = __decorate([
    customElement('astra-card')
], AstraCard);
export default AstraCard;
