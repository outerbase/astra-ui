import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import baseStyles from '../lib/base-styles.js'

@customElement('astra-button')
export class AstraButton extends LitElement {
    static styles = [
        baseStyles,
        css`
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
            }

            button:active {
                opacity: 0.75;
            }

            .disabled {
                opacity: 0.4;
                pointer-events: none;
            }

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

            .variant-primary {
                background: var(--astra-neutral-700);
                color: white;
            }

            .variant-primary:hover {
                background: var(--astra-neutral-900);
            }

            .variant-secondary {
                background: var(--astra-neutral-100);
                color: var(--astra-neutral-900);
            }

            .variant-secondary:hover {
                background: var(--astra-neutral-200);
            }

            .variant-transparent {
                background: transparent;
                color: var(--astra-neutral-900);
            }

            .variant-transparent:hover {
                background: var(--astra-neutral-100);
            }

            .variant-destructive {
                background: var(--astra-red-600);
                color: white !important;
            }

            .variant-destructive:hover {
                background: var(--astra-red-700);
            }

            @media (prefers-color-scheme: dark) {
                .variant-primary {
                    background: var(--astra-neutral-200);
                    color: black;
                }

                .variant-primary:hover {
                    background: white;
                }

                .variant-secondary {
                    background: var(--astra-neutral-800);
                    color: var(--astra-neutral-200);
                }

                .variant-secondary:hover {
                    background: var(--astra-neutral-700);
                }

                .variant-transparent {
                    background: transparent;
                    color: var(--astra-neutral-200);
                }

                .variant-transparent:hover {
                    background: var(--astra-neutral-800);
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

    @property({ type: String }) public disabled: string = ''
    @property({ type: String }) public shape: string = 'default'
    @property({ type: String }) public size: string = 'base'
    @property({ type: String }) public variant: string = 'primary'

    public override render() {
        return html`
            <button class="variant-${this.variant} size-${this.size} shape-${this.shape} ${this.disabled ? 'disabled' : ''}">
                <slot></slot>
            </button>
        `
    }
}
