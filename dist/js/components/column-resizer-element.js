var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ResizeEndEvent, ResizeEvent, ResizeStartEvent } from '../lib/events.js';
import { Theme } from '../types.js';
import { ClassifiedElement } from './classified-element.js';
let ColumnResizer = class ColumnResizer extends ClassifiedElement {
    onMouseDown(downEvent) {
        if (!this.column)
            throw new Error('`column` is unset; aborting');
        const v = this.column.value ?? this.column.originalValue ?? '';
        this.dispatchEvent(new ResizeStartEvent(v));
        const _mouseMove = (moveEvent) => {
            if (!this.column)
                throw new Error('`column` is unset; aborting');
            if (!this.xPosition)
                throw new Error('`xPosition` is unset; aborting');
            if (!this.width)
                throw new Error('`width` is unset; aborting');
            this.dispatchEvent(new ResizeEvent(v, moveEvent.clientX - this.xPosition));
        };
        const _mouseUp = (upEvent) => {
            document.removeEventListener('mouseup', _mouseUp);
            document.removeEventListener('mousemove', _mouseMove);
            if (!this.column)
                throw new Error('`column` is unset; aborting');
            this.dispatchEvent(new ResizeEndEvent(v, this.xPosition ? upEvent.clientX - this.xPosition : 0));
        };
        document.addEventListener('mousemove', _mouseMove);
        document.addEventListener('mouseup', _mouseUp);
        this.xPosition = downEvent.clientX;
        this.width = parseInt(window.getComputedStyle(this.column).width, 10);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('mousedown', this.onMouseDown);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('mousedown', this.onMouseDown);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('height')) {
            // document.documentElement.style.setProperty('--table-height', `${this.height}px`)
        }
    }
    render() {
        const classes = classMap({
            'absolute z-[1] top-0 bottom-0 -right-[7px] w-4': true,
            'flex justify-center': true,
            'cursor-col-resize group': true,
            dark: this.theme == Theme.dark,
        });
        // the reason for nested div's here is to increase the click/draggable area while preserving a smaller visual element
        return html `
            <div class=${classes}>
                <div
                    class="h-full ml-[1px] w-[1px] group-hover:w-1 group-active:w-1 bg-theme-border dark:bg-theme-border-dark group-hover:bg-blue-400 group-active:bg-blue-500 dark:group-hover:bg-blue-900 dark:group-active:bg-blue-800"
                ></div>
            </div>
        `;
    }
};
__decorate([
    property({ type: Number, attribute: 'height' })
], ColumnResizer.prototype, "height", void 0);
__decorate([
    property({ type: Object })
], ColumnResizer.prototype, "column", void 0);
ColumnResizer = __decorate([
    customElement('column-resizer')
], ColumnResizer);
export { ColumnResizer };
