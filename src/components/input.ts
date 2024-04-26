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
                border: 1px solid var(--astra-neutral-200);
                border-radius: 6px;
                overflow: hidden; // preserves border-radius from un-rounded children
                background: white;
                align-items: center;
                font-family: var(--astra-font-family);
            }

            div:focus-within {
                outline: 1px solid var(--astra-accent, lime);
                outline-offset: -1px; // 0px draws it _outside_ of the border, where as this covers the border
            }

            input {
                flex: 1;
                padding: 10px 12px;
                background: transparent;
                border: none;
                color: var(--astra-neutral-900);
                font-family: var(--astra-font-family);
                font-size: 14px;
                line-height: 20px;
            }

            /* Removed outline:none; to preserve default focus indication */
            input::placeholder {
                color: var(--astra-neutral-500);
                opacity: 1; /* Firefox */
            }

            ::-ms-input-placeholder {
                color: var(--astra-neutral-500);
            }

            label {
                position: absolute;
                clip: rect(1px, 1px, 1px, 1px);
                clip-path: inset(50%);
                height: 1px;
                width: 1px;
                margin: -1px;
                overflow: hidden;
                padding: 0;
                border: 0;
            }

            @media (prefers-color-scheme: dark) {
                div {
                    background: var(--astra-neutral-900);
                    border: 1px solid var(--astra-neutral-800);
                }

                input {
                    color: var(--astra-neutral-100);
                }
            }
        `,
    ]

    @property({ type: String }) public placeholder: string = ''
    @property({ type: String }) public value: string = ''
    @property({ type: String }) public label?: string

    public onInput(event: Event) {
        this.value = (event.target as HTMLInputElement).value
    }

    public override render() {
        const labelIfSpecified = this.label ? html`<label id="input-label" for="input">${this.label}</label>` : undefined
        return html`
            <div>
                <slot name="left"></slot>

                ${labelIfSpecified}
                <input
                    id="input"
                    type="text"
                    aria-labelledby="input-label"
                    .placeholder=${this.placeholder}
                    .value=${this.value}
                    @input=${this.onInput}
                />

                <slot name="right"></slot>
            </div>
        `
    }
}

// Implementation notes
// The use of the complicated clipping CSS for the label element instead of simply using display: none; is a thoughtful approach in terms of accessibility. Here’s why it matters:
// Screen Reader Accessibility: When you set display: none; or visibility: hidden; on an element, it not only hides the element from the visual viewport but also makes it invisible to screen readers. This means that users who rely on assistive technologies won't receive the information that the label provides, which is crucial for understanding the purpose of the input fields.
// CSS Clipping: By using CSS clipping paths or the older method of position: absolute combined with clip: rect(1px, 1px, 1px, 1px);, the element is visually hidden from the screen, but it remains accessible to screen readers. This technique ensures that the label content is still read by screen readers, thereby supporting users who rely on this technology to navigate and interact with web content.
// Accessibility Best Practices: The practice of visually hiding but making content available to screen readers is a common accessibility best practice. It ensures that all users, regardless of how they access the web, have a consistent and informative experience.
