import { LitElement, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import baseStyles from '../lib/base-styles.js'

const ToggleIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
</svg>`

@customElement('astra-select')
export default class AstraSelect extends LitElement {
    static styles = [
        baseStyles,
        css`
            #container {
                display: flex;
                gap: 8px;
                position: relative;
                cursor: pointer;
                padding: 10px 12px;
                border: 1px solid var(--astra-neutral-200);
                border-radius: 6px;
                background: white;
                font-family: var(--astra-font-family);
                user-select: none;
                -webkit-user-select: none;
            }

            #options-list {
                display: none;
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                width: 100%;
                z-index: 1;
                background: white;
                border: 1px solid var(--astra-neutral-200);
                border-radius: 6px;
            }

            .option {
                padding: 10px 12px;
                cursor: pointer;
                color: black;
            }

            .option:hover {
                background: var(--astra-neutral-200);
            }

            #placeholder {
                flex: 1;
                opacity: 0.5;
            }

            #selection {
                flex: 1;
                display: none;
            }

            @media (prefers-color-scheme: dark) {
                #container {
                    background: var(--astra-neutral-900);
                    border: 1px solid var(--astra-neutral-800);
                    color: white;
                }

                #options-list {
                    background: var(--astra-neutral-900);
                    border: 1px solid var(--astra-neutral-800);
                    border-radius: 6px;
                }

                .option {
                    color: white;
                }

                .option:hover {
                    background: var(--astra-neutral-800);
                }
            }
        `,
    ]

    @property({ attribute: 'placeholder' }) public placeholder = ''
    @property({ attribute: 'value' }) public value = ''
    @property({ attribute: 'options', type: Object }) options: Array<{ label: any; value: any }> = [] // using `options` instead of `children` because the DOM keeps removing them unless you include `<slot>` (and its visible)
    @state() isOpen = false
    @query('#options-list') optionsListElement!: HTMLElement

    connectedCallback(): void {
        this.onClickOutside = this.onClickOutside.bind(this)
    }

    private shouldDisplayOptions(isOpen: boolean) {
        if (isOpen) {
            this.optionsListElement.style.display = 'block'
            setTimeout(this.optionsListElement.focus.bind(this.optionsListElement), 0)
        } else {
            this.optionsListElement.style.display = 'none'
        }

        this.isOpen = isOpen
    }

    private onClickOutside(event: MouseEvent) {
        if (typeof document === 'undefined') return
        if (event.target === this) return
        this.shouldDisplayOptions(false)
        document.removeEventListener('click', this.onClickOutside)
    }

    private onClickInside(_event: MouseEvent) {
        if (typeof document === 'undefined') return
        if (this.isOpen) document.removeEventListener('click', this.onClickOutside)
        else document.addEventListener('click', this.onClickOutside)
        this.shouldDisplayOptions(!this.isOpen)
    }

    private renderOption(text: string, value: string) {
        return html`<div class="option" @click="${() => (this.value = value)}">${text}</div>`
    }

    public override render() {
        return html`
            <div id="container" @click="${this.onClickInside}">
                <div id="placeholder">${this.placeholder}</div>
                <div id="selection">${this.value}</div>

                ${ToggleIcon}

                <div id="options-list">
                    ${repeat(
                        this.options,
                        ({ label }) => label,
                        ({ label, value }) => this.renderOption(label, value)
                    )}
                </div>
            </div>
        `
    }
}
