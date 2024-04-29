var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import baseStyles from '../lib/base-styles.js';
var Variant;
(function (Variant) {
    Variant["primary"] = "primary";
    Variant["secondary"] = "secondary";
    Variant["transparent"] = "transparent";
})(Variant || (Variant = {}));
var Size;
(function (Size) {
    Size["base"] = "base";
    Size["small"] = "small";
    Size["compact"] = "compact";
})(Size || (Size = {}));
var Shape;
(function (Shape) {
    Shape["default"] = "default";
    Shape["square"] = "square";
    Shape["circle"] = "circle";
})(Shape || (Shape = {}));
let AstraButton = class AstraButton extends LitElement {
    constructor() {
        super();
        // accessibility, state
        this.disabled = false; // enabled by default
        // styling
        this.size = Size.base;
        this.shape = Shape.default;
        this.variant = Variant.primary;
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    onKeyDown(event) {
        const { code } = event;
        if (this.disabled)
            return;
        if (code === 'Space' || code === 'Enter') {
            event.preventDefault();
            this.click();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('keydown', this.onKeyDown);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('keydown', this.onKeyDown);
    }
    render() {
        return html `
            <button tabindex="0" class="${`variant-${this.variant} size-${this.size} shape-${this.shape}`}" ?disabled="${this.disabled}">
                <slot></slot>
            </button>
        `;
    }
};
AstraButton.styles = [
    baseStyles,
    css `
            /* Base button styles */
            button {
                display: flex;
                gap: 8px;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border: none;
                font-weight: 500;
                font-family: var(--astra-font-family);
                line-height: 20px;
                border-radius: 6px;
                user-select: none;
                -webkit-user-select: none;
                outline: none; /* Avoid default focus styles */
            }

            /* Enhanced focus styles for keyboard navigation */
            button:focus-visible {
                box-shadow: 0 0 0 3px var(--astra-accent, lime); /* Custom focus indicator */
            }

            /* Handling active and disabled states */
            button:active {
                opacity: 0.75;
            }

            button[disabled] {
                opacity: 0.4;
                cursor: default;
            }

            /* Styling for button shapes */
            .shape-default {
                padding: 8px 10px;
                font-size: 14px;
            }

            .shape-square {
                padding: 0 !important;
            }

            .shape-circle {
                padding: 0 !important;
                border-radius: 50%;
                overflow: hidden;
            }

            .size-base.shape-square,
            .size-base.shape-circle {
                width: 40px;
                height: 40px;
            }

            .size-small.shape-square,
            .size-small.shape-circle {
                width: 36px;
                height: 36px;
            }

            .size-compact.shape-square,
            .size-compact.shape-circle {
                width: 32px;
                height: 32px;
            }

            /* Styling for button sizes */
            .size-base {
                padding: 10px 16px;
                font-size: 14px;
            }

            .size-small {
                padding: 8px 12px;
                font-size: 14px;
            }

            .size-compact {
                padding: 8px 10px;
                font-size: 12px;
                line-height: 16px;
            }

            /* Variant styling for buttons */
            .variant-primary {
                background: var(--astra-neutral-700);
                color: white;
            }

            .variant-secondary {
                background: var(--astra-neutral-100);
                color: var(--astra-neutral-900);
            }

            .variant-transparent {
                background: transparent;
                color: var(--astra-neutral-900);
            }

            .variant-destructive {
                background: var(--astra-red-600);
                color: white !important;
            }

            button:not([disabled]) {
                .variant-primary:hover {
                    background: var(--astra-neutral-900);
                }

                .variant-secondary:hover {
                    background: var(--astra-neutral-200);
                }

                .variant-destructive:hover {
                    background: var(--astra-red-700);
                }
            }

            /* Media queries for dark mode adaptations */
            @media (prefers-color-scheme: dark) {
                button[disabled] {
                    opacity: 0.4;
                    cursor: default;
                }

                .variant-primary {
                    background: var(--astra-neutral-200);
                    color: black;
                }

                button:not([disabled]) {
                    .variant-primary:hover {
                        background: white;
                    }

                    .variant-secondary:hover {
                        background: var(--astra-neutral-700);
                    }

                    .variant-transparent:hover {
                        background: var(--astra-neutral-800);
                    }
                }

                .variant-secondary {
                    background: var(--astra-neutral-800);
                    color: var(--astra-neutral-200);
                }

                .variant-transparent {
                    background: transparent;
                    color: var(--astra-neutral-200);
                }

                .variant-destructive {
                    background: var(--astra-red-900);
                }

                .variant-destructive:hover {
                    background: var(--astra-red-800);
                }
            }
        `,
];
__decorate([
    property({ type: Boolean, reflect: true })
], AstraButton.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], AstraButton.prototype, "size", void 0);
__decorate([
    property({ type: String })
], AstraButton.prototype, "shape", void 0);
__decorate([
    property({ type: String })
], AstraButton.prototype, "variant", void 0);
AstraButton = __decorate([
    customElement('astra-button')
], AstraButton);
export default AstraButton;
