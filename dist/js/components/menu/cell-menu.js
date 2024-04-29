var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Theme } from '../../types.js';
import { Menu } from './index.js';
let CellMenu = class CellMenu extends Menu {
    get menuPositionClasses() {
        const isRenderingInBrowser = typeof window !== 'undefined';
        if (!isRenderingInBrowser)
            return '';
        return 'right-0 left-0 top-9';
    }
    render() {
        const darkClass = classMap({ dark: this.theme == Theme.dark });
        // @click shows/hides the menu
        // @dblclick prevents parent's dblclick
        // @keydown navigates the menu
        // TODO @johnny add `tabindex` to #trigger to restore keyboard nav to the cell menu
        // it needs to be conditional whether the menu is open or not or else double tabbing occurs on the table
        return html `
            <span
                class=${classMap({
            'whitespace-nowrap text-ellipsis': true,
            'overflow-hidden w-full focus:z-[1] ': true,
        })}
                ><slot></slot
            ></span>
            <span
                id="trigger"
                aria-haspopup="menu"
                class=${darkClass}
                @click=${this.onTrigger}
                @dblclick=${(e) => e.stopPropagation()}
                @keydown=${this.onKeyDown}
            >
                ${this.listElement}</span
            >
        `;
    }
};
CellMenu = __decorate([
    customElement('astra-td-menu')
], CellMenu);
export { CellMenu };
