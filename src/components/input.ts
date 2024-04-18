import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import baseStyles from '../lib/base-styles.js'

@customElement('astra-input')
export default class AstraInput extends LitElement {
    static styles = [
        baseStyles,
        css`
            :host {
                display: block;
            }

            div {
                display: flex;
                gap: 8px;
                padding: 0 12px;
                border: 1px solid var(--astra-neutral-200);
                border-radius: 6px;
                background: white;
                align-items: center;
                font-family: var(--astra-font-family);
            }

            div:focus-within {
                border-color: var(--astra-neutral-400);
            }

            input {
                flex: 1;
                padding: 10px 0;
                background: transparent;
                border: none;
                color: var(--astra-neutral-900);
                font-family: var(--astra-font-family);
                -webkit-font-smoothing: antialiased;
                font-size: 14px;
                line-height: 20px;
            }

            input:focus {
                outline: none;
            }

            ::placeholder {
                color: var(--astra-neutral-500);
                opacity: 1; /* Firefox */
            }

            ::-ms-input-placeholder {
                color: var(--astra-neutral-500);
            }

            @media (prefers-color-scheme: dark) {
                div {
                    background: var(--astra-neutral-900);
                    border: 1px solid var(--astra-neutral-800);
                }

                input {
                    color: var(--astra-neutral-100);
                }

                div:focus-within {
                    border-color: var(--astra-neutral-600);
                }
            }
        `,
    ]

    @property({ type: String }) public placeholder: string = ''
    @property({ type: String }) public value: string = ''

    public onInput(event: Event) {
        this.value = (event.target as HTMLInputElement).value
        this.dispatchEvent(new CustomEvent('value-changed', { detail: this.value }))
    }

    public override render() {
        return html`
            <div>
                <slot name="left"></slot>
                <input type="text" .placeholder=${this.placeholder} .value=${this.value} @input=${this.onInput} />
                <slot name="right"></slot>
            </div>
        `
    }
}
