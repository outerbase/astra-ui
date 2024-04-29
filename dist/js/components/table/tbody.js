var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from 'lit/decorators.js';
import { ClassifiedElement } from '../classified-element.js';
// tl;dr <tbody/>, table-row-group
let TBody = class TBody extends ClassifiedElement {
    classMap() {
        return { 'table-row-group': true, ...super.classMap() };
    }
};
TBody = __decorate([
    customElement('astra-rowgroup')
], TBody);
export { TBody };
