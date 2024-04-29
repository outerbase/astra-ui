import { LitElement, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { TWStyles } from '../lib/.tw-styles.js'
import baseStyles from '../lib/base-styles.js'

const ToggleIcon = html`<svg
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  viewBox="0 0 256 256"
>
  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
</svg>`

@customElement('astra-select')
export default class AstraSelect extends LitElement {
  static styles = [
    TWStyles,
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

      #container:focus-within {
        outline: 1px solid var(--astra-accent, lime);
        outline-offset: -1px; // 0px draws it _outside_ of the border, where as this covers the border
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

      li {
        list-style-type: none;
      }

      ul {
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 0px;
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

  @property({ attribute: 'aria-expanded', reflect: true }) ariaExpanded = 'false'
  @property({ attribute: 'placeholder' }) public placeholder = ''
  @property({ attribute: 'value' }) public value = ''
  @property({ attribute: 'options', type: Array }) public options: Array<{ label: any; value: any }> = [] // using `options` instead of `children` because the DOM keeps removing them unless you include `<slot>` (and its visible)
  @property({ attribute: 'disabled', type: Boolean }) disabled = false
  @state() protected isOpen = false
  @query('#options-list') protected optionsListElement!: HTMLElement

  protected shouldDisplayOptions(isOpen: boolean) {
    if (isOpen) {
      this.optionsListElement.style.display = 'block'
      setTimeout(this.optionsListElement.focus.bind(this.optionsListElement), 0)
    } else {
      this.optionsListElement.style.display = 'none'
    }

    this.isOpen = isOpen
    this.ariaExpanded = isOpen ? 'true' : 'false'
  }

  protected onClickOutside(event: MouseEvent) {
    if (typeof document === 'undefined') return
    if (event.target === this) return

    this.shouldDisplayOptions(false)
    document.removeEventListener('click', this.onClickOutside)
  }

  protected onClickInside(_event?: MouseEvent) {
    if (typeof document === 'undefined') return
    if (this.isOpen) document.removeEventListener('click', this.onClickOutside)
    else document.addEventListener('click', this.onClickOutside)
    this.shouldDisplayOptions(!this.isOpen)
  }

  onKeyDown(event: KeyboardEvent) {
    const { code } = event

    if (this.disabled) return
    if (code === 'Space' || code === 'Enter') {
      event.preventDefault()
      this.onClickInside()
    }
  }

  protected renderOption(text: string, value: string) {
    return html`<li
      class="option"
      tabindex="0"
      @click=${() => {
        this.value = value
      }}
    >
      ${text}
    </li>`
  }

  public override connectedCallback(): void {
    super.connectedCallback()
    this.onClickOutside = this.onClickOutside.bind(this)
    this.addEventListener('keydown', this.onKeyDown)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keydown', this.onKeyDown)
  }

  constructor() {
    super()
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  public override render() {
    const displayedValue =
      this.value.length > 0
        ? html`<div class="flex-1 ">${this.value}</div>`
        : html`<div class="flex-1 opacity-50">${this.placeholder}</div>`
    // TODO place a button in here that serves as the trigger instead of the container itself
    // and then put aria-haspopup="listbox" on it
    return html`
      <div id="container" aria-haspopup="listbox" tabindex="0" @click=${this.onClickInside} role="listbox">
        ${displayedValue} ${ToggleIcon}

        <ul id="options-list" aria-owns="container" role="menu">
          ${repeat(
            this.options,
            ({ label }) => label,
            ({ label, value }) => this.renderOption(label, value)
          )}
        </ul>
      </div>
    `
  }
}
