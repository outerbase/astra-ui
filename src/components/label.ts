import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import baseStyles from '../lib/base-styles.js'

enum LabelVariant {
    unspecified = '',
    label = 'label',
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
}

@customElement('astra-label')
export default class AstraLabel extends LitElement {
    static styles = [
        baseStyles,
        css`
            label {
                display: block;
                font-weight: 500;
                font-family: var(--astra-font-family);
                color: black;
                opacity: 0.8;
                cursor: text;
            }

            .label {
                font-weight: 700;
                font-size: 12px;
                font-family: var(--astra-font-family);
                opacity: 0.6;
            }

            .h1 {
                opacity: 1;
                font-size: 36px;
                line-height: 40px;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .h2 {
                opacity: 1;
                font-size: 24px;
                line-height: 32px;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .h3 {
                opacity: 1;
                font-size: 20px;
                line-height: 28px;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .h4 {
                opacity: 1;
                font-size: 16px;
                line-height: 24px;
                font-weight: 600;
                margin-bottom: 4px;
            }

            @media (prefers-color-scheme: dark) {
                label {
                    color: white;
                }
            }
        `,
    ]

    @property({ attribute: 'variant' }) public variant: LabelVariant = LabelVariant.unspecified

    public override render() {
        return html`<label class=${this.variant}><slot></slot></label>`
    }
}
