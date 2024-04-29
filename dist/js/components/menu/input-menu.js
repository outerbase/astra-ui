var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { CaretDown } from '../../icons/caret-down.js';
import { ChangeEvent } from '../../lib/events.js';
import { Theme } from '../../types.js';
import { Menu } from './index.js';
let InputMenu = class InputMenu extends Menu {
    constructor() {
        super(...arguments);
        this._classMap = {
            'focus:ring-1 focus:ring-neutral-950 dark:focus:ring-neutral-50 focus:outline-none ': true,
            'px-2 py-1.5': true,
            'bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50': true,
            'placeholder-neutral-400 dark:placeholder-neutral-600': true,
            'rounded-md border border-neutral-400 dark:border-neutral-600': true,
        };
        this.value = '';
    }
    get menuPositionClasses() {
        return 'left-0 right-0 top-8';
    }
    onMenuSelection(event) {
        // event.stopPropagation()
        const { value } = event;
        this.value = value;
    }
    onKeyDown(event) {
        if (this.open)
            return super.onKeyDown({ ...event, didCloseMenu: false });
        const { code } = event;
        if (code === 'Space' || code === 'ArrowLeft' || code === 'ArrowRight') {
            return;
        }
        else if (code === 'ArrowDown') {
            this.open = true;
        }
        else
            super.onKeyDown({ ...event, didCloseMenu: false });
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('menu-selection', this.onMenuSelection);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('menu-selection', this.onMenuSelection);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('value') && this.dispatchEvent) {
            this.dispatchEvent(new ChangeEvent(this.value));
        }
    }
    render() {
        const triggerClasses = {
            'absolute right-1': true,
            'border border-transparent': true,
            'bg-neutral-50 dark:bg-neutral-950': true,
            'hover:bg-neutral-100 dark:hover:bg-neutral-900 active:border-neutral-200 dark:active:border-neutral-800': true,
            'p-0.5 rounded-md': true,
        };
        return html `
            <slot></slot>
            <input
            id="trigger"
            @keydown=${this.onKeyDown}
            .value=${this.value}
            @input=${(event) => {
            const { value } = event.target;
            this.value = value;
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
                <div class=${classMap(triggerClasses)} @click=${(event) => {
            const trigger = this.shadowRoot?.querySelector('#trigger');
            trigger?.focus();
            this.onTrigger(event);
        }} aria-haspopup="menu">${CaretDown(16)}</div>
                ${this.listElement}
            </input>
        `;
    }
};
__decorate([
    property({ type: Object })
], InputMenu.prototype, "_classMap", void 0);
__decorate([
    property({ type: String })
], InputMenu.prototype, "value", void 0);
InputMenu = __decorate([
    customElement('astra-input-menu')
], InputMenu);
export { InputMenu };
