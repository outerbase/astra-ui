import { html, type PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

import { CaretDown } from '../../icons/caret-down.js'
import { ChangeEvent, MenuSelectedEvent } from '../../lib/events.js'
import { Theme } from '../../lib/types.js'
import { Menu } from './index.js'

@customElement('astra-input-menu')
export class InputMenu extends Menu {
    @property({ type: Object })
    protected _classMap = {
        'focus:ring-1 focus:ring-neutral-950 dark:focus:ring-neutral-50 focus:outline-none ': true,
        'px-2 py-1.5': true,
        'bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50': true,
        'placeholder-neutral-400 dark:placeholder-neutral-600': true,
        'rounded-md border border-neutral-400 dark:border-neutral-600': true,
    }

    @property({ type: String })
    public value = ''

    protected override get menuPositionClasses() {
        return 'left-0 right-0 top-8'
    }

    protected onMenuSelection(event: Event) {
        // event.stopPropagation()
        const { value } = event as MenuSelectedEvent
        this.value = value
    }

    protected onKeyDown(event: KeyboardEvent) {
        if (this.open) return super.onKeyDown({ ...event, didCloseMenu: false })

        const { code } = event
        if (code === 'Space' || code === 'ArrowLeft' || code === 'ArrowRight') {
            return
        } else if (code === 'ArrowDown') {
            this.open = true
        } else super.onKeyDown({ ...event, didCloseMenu: false })
    }

    public override connectedCallback() {
        super.connectedCallback()
        this.addEventListener('menu-selection', this.onMenuSelection)
    }

    public override disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('menu-selection', this.onMenuSelection)
    }

    public override willUpdate(changedProperties: PropertyValueMap<this>): void {
        super.willUpdate(changedProperties)

        if (changedProperties.has('value') && this.dispatchEvent) {
            this.dispatchEvent(new ChangeEvent(this.value))
        }
    }

    public override render() {
        const triggerClasses = {
            'absolute right-1': true,
            'border border-transparent': true,
            'bg-neutral-50 dark:bg-neutral-950': true,

            'hover:bg-neutral-100 dark:hover:bg-neutral-900 active:border-neutral-200 dark:active:border-neutral-800': true,
            'p-0.5 rounded-md': true,
        }

        return html`
            <slot></slot>
            <input
            id="trigger"
            @keydown=${this.onKeyDown}
            .value=${this.value}
            @input=${(event: InputEvent) => {
                const { value } = event.target as HTMLInputElement
                this.value = value
            }}
                class=${classMap({
                    'relative w-full': true,
                    dark: this.theme == Theme.dark,
                    ...this._classMap,
                })}
                tabindex="0"
                type="text"
                autocomplete="off"
                required
            >
                <div class=${classMap(triggerClasses)} @click=${(event: MouseEvent) => {
                    const trigger = this.shadowRoot?.querySelector('#trigger') as HTMLElement | null
                    trigger?.focus()
                    this.onTrigger(event)
                }} aria-haspopup="menu">${CaretDown(16)}</div>
                ${this.listElement}
            </input>
        `
    }
}
