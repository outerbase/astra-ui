var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from 'lit/decorators.js';
import { Menu } from './index.js';
let ColumnMenu = class ColumnMenu extends Menu {
    get menuPositionClasses() {
        const isRenderingInBrowser = typeof window !== 'undefined';
        if (!isRenderingInBrowser)
            return '';
        return 'right-0 top-8';
    }
};
ColumnMenu = __decorate([
    customElement('astra-th-menu')
], ColumnMenu);
export { ColumnMenu };
