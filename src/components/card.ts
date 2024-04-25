import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import baseStyles from '../lib/base-styles.js'

enum Size {
    base = 'base',
    small = 'small',
    compact = 'compact',
}

@customElement('astra-card')
export default class AstraCard extends LitElement {
    static styles = [
        baseStyles,
        css`
            div {
                display: flex;
                flex-direction: column;
                gap: 8px;
                font-weight: 500;
                font-family: var(--astra-font-family);
                -webkit-font-smoothing: antialiased;
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
    ]

    @property({ type: String }) public size: Size = Size.base

    public override render() {
        return html`
            <section class="size-${this.size}">
                <slot></slot>
            </section>
        `
    }
}
