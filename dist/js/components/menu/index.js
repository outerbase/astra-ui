var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { CaretDown } from '../../icons/caret-down.js';
import classMapToClassName from '../../lib/class-map-to-class-name.js';
import { MenuOpenEvent, MenuSelectedEvent } from '../../lib/events.js';
import { Theme } from '../../types.js';
import { ClassifiedElement } from '../classified-element.js';
export class Menu extends ClassifiedElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.options = [];
        this.withoutPadding = false;
        this.activeOptions = [];
        this.historyStack = [];
        // storing this as a variable instead of anonymous function
        // so that the listener can determine if it's the same closer or not
        // for the scenario when the same menu is repeatedly opened
        this.close = () => (this.open = false);
    }
    classMap() {
        return {
            'flex items-center justify-between gap-2': !this.withoutPadding,
            'font-medium select-none whitespace-nowrap': true,
            ...super.classMap(),
        };
    }
    // this function is intended to be overriden in a subclass
    // and not accessed otherwise
    get menuPositionClasses() {
        return '';
    }
    get listElement() {
        if (!this.open)
            return null;
        const classes = {
            [this.menuPositionClasses]: true,
            'absolute z-[2] overflow-hidden': true,
            'rounded-xl p-1.5': true,
            'text-sm text-neutral-900 dark:text-white font-medium': true,
            'bg-white dark:bg-neutral-900': true,
            'shadow-lg shadow-black/5': true,
            'border border-neutral-200 dark:border-neutral-800': true,
        };
        return html `<ul class=${classMap(classes)} role="menu">
            ${repeat(this.activeOptions, ({ label }) => label, ({ label, value, classes }) => html `<li
                        @click=${this.onItemClick}
                        data-value=${value}
                        class=${classMapToClassName({
            [classes ?? '']: !!classes,
            'text-ellipsis overflow-hidden': true,
            'rounded-md p-2.5': true,
            'text-neutral-700 dark:text-neutral-300': !classes,
            'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800': true,
            'bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800': this.focused === value,
        })}
                        role="menuitem"
                        ?selected=${this.selection === value}
                    >
                        ${label}
                    </li>`)}
        </ul>`;
    }
    onTrigger(event) {
        this.open = !this.open;
        this.activeEvent = event;
    }
    onItemClick(event) {
        const el = event.target;
        // look for someone with a `data-value`
        // this was necessary when passing in a label that
        // is itself another html element such that the literal thing
        // being clicked does NOT have the value
        let parent = el;
        while (parent && !parent.hasAttribute('data-value') && parent.parentElement) {
            parent = parent.parentElement;
        }
        const value = parent.getAttribute('data-value');
        if (!value)
            throw new Error("onItemClick didn't recover a selection value");
        this.onSelection(event, value);
    }
    onSelection(event, value) {
        const submenu = this.options.find((opt) => opt.value === value);
        if (submenu && submenu.options) {
            event.stopPropagation();
            event.preventDefault();
            this.historyStack.push(this.options);
            this.options = submenu.options;
            return;
        }
        if (typeof value === 'string') {
            const selectionEvent = new MenuSelectedEvent(value);
            this.selection = value;
            this.dispatchEvent(selectionEvent);
        }
    }
    onKeyDown(event) {
        const { code } = event;
        if (code === 'Escape') {
            this.open = false;
        }
        else if (code === 'Space' || code === 'Enter') {
            event.preventDefault();
            this.open = !this.open;
            event.didCloseMenu = true;
            if (!this.open && this.focused)
                this.onSelection(event, this.focused);
        }
        else if (code === 'ArrowDown' || code === 'ArrowRight') {
            event.preventDefault();
            if (!this.focused)
                this.focused = this.activeOptions[0]?.value;
            else {
                const idx = this.activeOptions.findIndex(({ value }, _idx) => value === this.focused);
                if (idx > -1 && idx < this.activeOptions.length - 1)
                    this.focused = this.activeOptions[idx + 1].value;
                else if (idx === this.activeOptions.length - 1)
                    this.focused = this.activeOptions[0].value;
            }
        }
        else if (code === 'ArrowUp' || code === 'ArrowLeft') {
            event.preventDefault();
            if (!this.focused)
                this.focused = this.activeOptions[this.activeOptions.length - 1]?.value;
            else {
                const idx = this.activeOptions.findIndex(({ value }, _idx) => value === this.focused);
                if (idx > 0)
                    this.focused = this.activeOptions[idx - 1].value;
                else if (idx === 0)
                    this.focused = this.activeOptions[this.activeOptions.length - 1].value;
            }
        }
        else if (code === 'Tab') {
            // prevent tabbing focus away from an open menu
            if (this.open)
                event.preventDefault();
        }
    }
    focus() {
        const trigger = this.shadowRoot?.querySelector('#trigger');
        trigger?.focus();
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        // when the menu is being opened
        if (changedProperties.has('open') && this.open) {
            this.setAttribute('aria-expanded', '');
            this.outsideClicker = ((event) => {
                if (event !== this.activeEvent) {
                    this.open = false;
                    delete this.activeEvent;
                    if (this.outsideClicker)
                        document.removeEventListener('click', this.outsideClicker);
                }
            }).bind(this);
            document.addEventListener('click', this.outsideClicker);
            this.dispatchEvent(new MenuOpenEvent(this.close));
        }
        // when the menu is being closed
        else if (changedProperties.has('open') && !this.open) {
            this.removeAttribute('aria-expanded');
            // reset history; restore root menu ietms
            if (this.historyStack.length > 0) {
                this.options = this.historyStack[0];
                this.historyStack = [];
            }
            if (this.outsideClicker) {
                delete this.activeEvent;
                document.removeEventListener('click', this.outsideClicker);
            }
        }
        if (changedProperties.has('options')) {
            // reset the menu to it's root
            this.activeOptions = this.options;
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        // when closing
        if (changedProperties.has('open') && !this.open) {
            this.focused = undefined;
        }
    }
    render() {
        // @click shows/hides the menu
        // @dblclick prevents parent's dblclick
        // @keydown navigates the menu
        const outerClasses = {
            'relative -mr-1 cursor-pointer': true,
            dark: this.theme == Theme.dark,
        };
        const innerClasses = {
            'border border-transparent': true,
            'hover:bg-neutral-100 dark:hover:bg-neutral-900 active:border-neutral-200 dark:active:border-neutral-800': true,
            'p-0.5 rounded-md': true,
        };
        return html `
            <slot></slot>
            <div
                id="trigger"
                class=${classMap(outerClasses)}
                aria-haspopup="menu"
                tabindex="0"
                @click=${this.onTrigger}
                @dblclick=${(e) => e.stopPropagation()}
                @keydown=${this.onKeyDown}
            >
                <div class=${classMap(innerClasses)}>${CaretDown(16)}</div>
                ${this.listElement}
            </div>
        `;
    }
}
__decorate([
    property({ type: Boolean, attribute: 'open', reflect: true })
], Menu.prototype, "open", void 0);
__decorate([
    property({ attribute: 'selection', type: String })
], Menu.prototype, "selection", void 0);
__decorate([
    property({ type: Array, attribute: 'options' })
], Menu.prototype, "options", void 0);
__decorate([
    property({ attribute: 'without-padding', type: Boolean })
], Menu.prototype, "withoutPadding", void 0);
__decorate([
    state()
], Menu.prototype, "activeOptions", void 0);
__decorate([
    state()
], Menu.prototype, "historyStack", void 0);
__decorate([
    state()
], Menu.prototype, "focused", void 0);
