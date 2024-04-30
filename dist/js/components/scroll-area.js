var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { debounce } from 'lodash-es';
import { Axis, Theme } from '../types.js';
import { ClassifiedElement } from './classified-element.js';
let ScrollArea = class ScrollArea extends ClassifiedElement {
    constructor() {
        super();
        this.threshold = 0;
        this.scroller = createRef();
        this.rightScrollZone = createRef();
        this.rightScrollHandle = createRef();
        this.bottomScrollZone = createRef();
        this.bottomScrollHandle = createRef();
        this.hasHoveringCursor = false;
        this.axis = Axis.both;
        this.isDragging = false;
        this.verticalScrollPosition = 0;
        this.horizontalScrollPosition = 0;
        this.verticalScrollSize = 0;
        this.horizontalScrollSize = 0;
        this.horizontalScrollProgress = 0;
        this.verticalScrollProgress = 0;
        this.startX = 0;
        this.startY = 0;
        this.scrollStartX = 0;
        this.scrollStartY = 0;
        this._onScroll = this._onScroll ? debounce(this._onScroll, 10).bind(this) : this._onScroll.bind(this);
        this.updateScrollerSizeAndPosition = this.updateScrollerSizeAndPosition.bind(this);
        this.onWheelVerticalScroller = this.onWheelVerticalScroller.bind(this);
        this.onWheelHorizontalScroller = this.onWheelHorizontalScroller.bind(this);
        this.onHorizontalScrollerHandleMouseDown = this.onHorizontalScrollerHandleMouseDown.bind(this);
        this.onVerticalScrollerHandleMouseDown = this.onVerticalScrollerHandleMouseDown.bind(this);
    }
    // maintains the appearance of our scrollers (horizontal + vertical)
    updateScrollerSizeAndPosition(_event) {
        // vertical
        if ([Axis.both, Axis.vertical].includes(this.axis)) {
            const scrollTop = this.scroller.value?.scrollTop ?? 0;
            const scrollHeight = this.scroller.value?.scrollHeight ?? 0;
            const scrollHeightCoEfficient = (this.scroller.value?.clientHeight ?? 0) / scrollHeight;
            this.verticalScrollSize = scrollHeightCoEfficient === 1 ? 0 : (this.scroller.value?.clientHeight ?? 0) * scrollHeightCoEfficient; // 0 when nothing to scroll
            this.verticalScrollProgress = scrollTop / scrollHeight;
            this.verticalScrollPosition = this.verticalScrollProgress * (this.scroller.value?.clientHeight ?? 0);
        }
        // horizontal
        if ([Axis.both, Axis.horizontal].includes(this.axis)) {
            const scrollWidth = this.scroller.value?.scrollWidth ?? 0;
            const scrollLeft = this.scroller.value?.scrollLeft ?? 0;
            const scrollWidthCoEfficient = (this.scroller.value?.clientWidth ?? 0) / scrollWidth;
            const horizontalScrollHandleWidth = scrollWidthCoEfficient === 1 ? 0 : (this.scroller.value?.clientWidth ?? 0) * scrollWidthCoEfficient; // 0 when nothing to scroll
            this.horizontalScrollProgress = scrollLeft / scrollWidth;
            this.horizontalScrollSize = horizontalScrollHandleWidth;
            this.horizontalScrollPosition = this.horizontalScrollProgress * (this.scroller.value?.clientWidth ?? 0);
        }
    }
    // trigger `onScroll` when scrolling distance >= threshold (for the sake of optimizing performance)
    _onScroll(_event) {
        const previous = this.previousScrollPosition ?? 0;
        const current = this.scroller.value?.scrollTop ?? 0;
        const difference = Math.abs(previous - current);
        if (difference > this.threshold) {
            this.previousScrollPosition = current;
            if (typeof this.onScroll === 'function') {
                this.onScroll();
            }
        }
    }
    onClickVerticalScroller(event) {
        if (this.scroller.value) {
            const clickedAtCoef = (event.clientY - this.getBoundingClientRect().top) / this.scroller.value.clientHeight;
            this.scroller.value.scrollTop = clickedAtCoef * (this.scroller.value.scrollHeight ?? 0) - this.verticalScrollSize;
        }
    }
    onClickHorizontalScroller(event) {
        if (this.scroller.value) {
            const clickedAtCoef = (event.clientX - this.getBoundingClientRect().left) / this.scroller.value.clientWidth;
            this.scroller.value.scrollLeft = clickedAtCoef * (this.scroller.value.scrollWidth ?? 0) - this.horizontalScrollSize;
        }
    }
    onWheelHorizontalScroller(event) {
        if (this.scroller.value) {
            this.scroller.value.scrollLeft += event.deltaX;
        }
    }
    onWheelVerticalScroller(event) {
        if (this.scroller.value) {
            this.scroller.value.scrollTop += event.deltaY;
        }
    }
    onHorizontalScrollerHandleMouseDown(mouseDownEvent) {
        mouseDownEvent.preventDefault(); // Prevent text selection/dragging behavior
        this.startX = mouseDownEvent.pageX; // Starting X position of the mouse
        this.scrollStartX = this.scroller.value?.scrollLeft ?? 0; // Starting scroll position
        // document.body.classList.add('user-select-none') // Optional: Disable text selection during drag
        const onMouseMove = (mouseMoveEvent) => {
            const deltaX = mouseMoveEvent.pageX - this.startX; // Calculate mouse movement
            const scrollWidth = this.scroller.value?.scrollWidth ?? 0;
            const scrollWidthCoEfficient = (this.scroller.value?.clientWidth ?? 0) / scrollWidth;
            if (this.scroller.value)
                this.scroller.value.scrollLeft = this.scrollStartX + deltaX / scrollWidthCoEfficient;
        };
        const onMouseUp = (_event) => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            // document.body.classList.remove('user-select-none') // Re-enable text selection after dragging
        };
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
    }
    preventDefault(event) {
        event.preventDefault();
    }
    onVerticalScrollerHandleMouseDown(mouseDownEvent) {
        mouseDownEvent.preventDefault(); // Prevent text selection/dragging behavior
        this.startY = mouseDownEvent.pageY; // Starting X position of the mouse
        this.scrollStartY = this.scroller.value?.scrollTop ?? 0; // Starting scroll position
        // document.body.classList.add('user-select-none') // Optional: Disable text selection during drag
        const onMouseMove = (mouseMoveEvent) => {
            mouseMoveEvent.preventDefault();
            const deltaY = mouseMoveEvent.pageY - this.startY; // Calculate mouse movement
            const scrollHeight = this.scroller.value?.scrollHeight ?? 0;
            const scrollHeightCoEfficient = (this.scroller.value?.clientHeight ?? 0) / scrollHeight;
            if (this.scroller.value)
                this.scroller.value.scrollTop = this.scrollStartY + deltaY / scrollHeightCoEfficient;
        };
        const onMouseUp = (_event) => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            // document.body.classList.remove('user-select-none') // Re-enable text selection after dragging
        };
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
    }
    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.scroller.value?.addEventListener('scroll', this.updateScrollerSizeAndPosition, { passive: true });
            this.scroller.value?.addEventListener('scroll', this._onScroll, { passive: true });
            this.scroller.value?.addEventListener('scrollend', this._onScroll, { passive: true });
            this.rightScrollZone.value?.addEventListener('wheel', this.onWheelVerticalScroller, { passive: true });
            this.bottomScrollZone.value?.addEventListener('wheel', this.onWheelHorizontalScroller, { passive: true });
            this.bottomScrollHandle.value?.addEventListener('mousedown', this.onHorizontalScrollerHandleMouseDown);
            this.rightScrollHandle.value?.addEventListener('mousedown', this.onVerticalScrollerHandleMouseDown);
            this.rightScrollZone.value?.addEventListener('contextmenu', this.preventDefault);
            this.bottomScrollZone.value?.addEventListener('contextmenu', this.preventDefault);
            this.bottomScrollHandle.value?.addEventListener('contextmenu', this.preventDefault);
            this.rightScrollHandle.value?.addEventListener('contextmenu', this.preventDefault);
        }, 0);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        // remove event listeners
        this.scroller.value?.removeEventListener('scroll', this.updateScrollerSizeAndPosition);
        this.scroller.value?.removeEventListener('scroll', this._onScroll);
        this.scroller.value?.removeEventListener('scrollend', this._onScroll);
        this.rightScrollZone.value?.removeEventListener('wheel', this.onWheelVerticalScroller);
        this.bottomScrollZone.value?.removeEventListener('wheel', this.onWheelHorizontalScroller);
        this.bottomScrollHandle.value?.removeEventListener('mousedown', this.onHorizontalScrollerHandleMouseDown);
        this.rightScrollHandle.value?.removeEventListener('mousedown', this.onVerticalScrollerHandleMouseDown);
        this.rightScrollZone.value?.removeEventListener('contextmenu', this.preventDefault);
        this.bottomScrollZone.value?.removeEventListener('contextmenu', this.preventDefault);
        this.bottomScrollHandle.value?.removeEventListener('contextmenu', this.preventDefault);
        this.rightScrollHandle.value?.removeEventListener('contextmenu', this.preventDefault);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('theme')) {
            this.requestUpdate('class');
        }
        if (changedProperties.has('hasHoveringCursor')) {
            // ensure scrollers appear on initial appearance
            if (this.hasHoveringCursor)
                this.updateScrollerSizeAndPosition();
        }
    }
    render() {
        const scrollGrabHandleClasses = {
            'w-full rounded-md': true,
            'bg-neutral-200/60 dark:bg-neutral-700/50': true,
            'hover:bg-neutral-300 dark:hover:bg-neutral-700': true,
            'active:bg-neutral-300 dark:active:bg-neutral-700': true,
        };
        const scrollTrackGutterClasses = {
            'z-50 absolute right-0 bottom-0 m-0.5': true,
            'transition-opacity duration-300': true,
            'opacity-0': !this.hasHoveringCursor,
            'opacity-100': this.hasHoveringCursor,
        };
        const verticalHandleStyles = {
            transform: `translateY(${this.verticalScrollPosition}px)`,
            height: `${this.verticalScrollSize}px`,
        };
        const horizontalHandleStyles = {
            transform: `translateX(${this.horizontalScrollPosition}px)`,
            width: `${this.horizontalScrollSize}px`,
        };
        const scrollableClasses = {
            'absolute bottom-0 left-0 right-0 top-0': true,
            'overflow-scroll': this.axis === Axis.both,
            'overflow-x-scroll overflow-y-hidden': this.axis === Axis.horizontal,
            'overflow-y-scroll overflow-x-hidden': this.axis === Axis.vertical,
        };
        return html `<!-- this comment exists to force the next line onto the next line -->
      <div
        @mouseleave=${() => {
            this.pendingMouseLeave = setTimeout(() => {
                this.hasHoveringCursor = false;
                delete this.pendingMouseLeave;
            }, 1000);
        }}
        @mouseenter=${() => {
            this.hasHoveringCursor = true;
            clearTimeout(this.pendingMouseLeave);
            delete this.pendingMouseLeave;
        }}
        class=${classMap({ dark: this.theme == Theme.dark })}
      >
        <div
          class=${classMap({ ...scrollTrackGutterClasses, 'top-0 w-1.5': true })}
          ${ref(this.rightScrollZone)}
          @click=${this.onClickVerticalScroller}
        >
          <div style=${styleMap(verticalHandleStyles)} class=${classMap(scrollGrabHandleClasses)} ${ref(this.rightScrollHandle)}></div>
        </div>

        <div
          class=${classMap({ ...scrollTrackGutterClasses, 'left-0': true })}
          ${ref(this.bottomScrollZone)}
          @click=${this.onClickHorizontalScroller}
        >
          <div
            style=${styleMap(horizontalHandleStyles)}
            class=${classMap({ ...scrollGrabHandleClasses, 'h-1.5': true })}
            ${ref(this.bottomScrollHandle)}
          ></div>
        </div>

        <div class=${classMap(scrollableClasses)} ${ref(this.scroller)}>
          <slot></slot>
        </div>
      </div>`;
    }
};
ScrollArea.styles = [
    ...ClassifiedElement.styles,
    css `
      /* Hide scrollbar for Chrome, Safari and Opera */
      ::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
      }

      /* Hide scrollbar for IE, Edge, and Firefox */
      :host {
        -ms-overflow-style: none; /* for Internet Explorer and Edge */
        scrollbar-width: none; /* for Firefox */
      }
    `,
];
__decorate([
    property()
], ScrollArea.prototype, "onScroll", void 0);
__decorate([
    property({ type: Number })
], ScrollArea.prototype, "threshold", void 0);
__decorate([
    property()
], ScrollArea.prototype, "scroller", void 0);
__decorate([
    property()
], ScrollArea.prototype, "rightScrollZone", void 0);
__decorate([
    property()
], ScrollArea.prototype, "rightScrollHandle", void 0);
__decorate([
    property()
], ScrollArea.prototype, "bottomScrollZone", void 0);
__decorate([
    property()
], ScrollArea.prototype, "bottomScrollHandle", void 0);
__decorate([
    property()
], ScrollArea.prototype, "hasHoveringCursor", void 0);
__decorate([
    property()
], ScrollArea.prototype, "axis", void 0);
__decorate([
    state()
], ScrollArea.prototype, "isDragging", void 0);
__decorate([
    state()
], ScrollArea.prototype, "verticalScrollPosition", void 0);
__decorate([
    state()
], ScrollArea.prototype, "horizontalScrollPosition", void 0);
__decorate([
    state()
], ScrollArea.prototype, "verticalScrollSize", void 0);
__decorate([
    state()
], ScrollArea.prototype, "horizontalScrollSize", void 0);
ScrollArea = __decorate([
    customElement('astra-scroll-area')
], ScrollArea);
export default ScrollArea;
