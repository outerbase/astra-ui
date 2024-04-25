import { LitElement, css, html, type PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import baseStyles from '../lib/base-styles.js'

enum Variant {
    primary = 'primary',
    secondary = 'secondary',
    transparent = 'transparent',
}

enum Size {
    base = 'base',
    small = 'small',
    compact = 'compact',
}

enum Shape {
    default = 'default',
    square = 'square',
    circle = 'circle',
}

@customElement('astra-button')
export default class AstraButton extends LitElement {
    static styles = [
        baseStyles,
        css`
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
                -webkit-font-smoothing: antialiased;
                line-height: 20px;
                border-radius: 6px;
                user-select: none;
                -webkit-user-select: none;
                outline: none; /* Avoid default focus styles */
            }

            /* Enhanced focus styles for keyboard navigation */
            button:focus-visible {
                box-shadow: 0 0 0 3px var(--astra-focus-color, blue); /* Custom focus indicator */
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
    ]

    // accessibility, state
    @property({ type: Boolean, reflect: true }) disabled = false // enabled by default
    @property({ type: Number, reflect: true }) tabIndex = this.disabled ? -1 : 0 // tabbable when enabled

    // styling
    @property({ type: String }) size: Size = Size.base
    @property({ type: String }) shape: Shape = Shape.default
    @property({ type: String }) variant: Variant = Variant.primary

    constructor() {
        super()
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    onKeyDown(event: KeyboardEvent) {
        const { code } = event

        if (this.disabled) return
        if (code === 'Space' || code === 'Enter') {
            event.preventDefault()
            this.click()
        }
    }

    override connectedCallback(): void {
        super.connectedCallback()
        this.addEventListener('keydown', this.onKeyDown)
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback()
        this.removeEventListener('keydown', this.onKeyDown)
    }

    override willUpdate(changedProperties: PropertyValueMap<this>): void {
        super.willUpdate(changedProperties)

        if (changedProperties.has('disabled')) {
            this.tabIndex = this.disabled ? -1 : 0
        }
    }

    override render() {
        return html`
            <button class="${`variant-${this.variant} size-${this.size} shape-${this.shape}`}" ?disabled="${this.disabled}">
                <slot></slot>
            </button>
        `
    }
}
