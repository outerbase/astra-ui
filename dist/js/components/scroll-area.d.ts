import { type PropertyValueMap } from 'lit';
import { type Ref } from 'lit/directives/ref.js';
import { Axis } from '../types';
import { ClassifiedElement } from './classified-element';
export default class ScrollArea extends ClassifiedElement {
    static styles: import("lit").CSSResult[];
    onScroll?: () => void;
    threshold: number;
    scroller: Ref<HTMLDivElement>;
    rightScrollZone: Ref<HTMLDivElement>;
    rightScrollHandle: Ref<HTMLDivElement>;
    bottomScrollZone: Ref<HTMLDivElement>;
    bottomScrollHandle: Ref<HTMLDivElement>;
    hasHoveringCursor: boolean;
    axis: Axis;
    protected isDragging: boolean;
    protected verticalScrollPosition: number;
    protected horizontalScrollPosition: number;
    protected verticalScrollSize: number;
    protected horizontalScrollSize: number;
    protected horizontalScrollProgress: number;
    protected verticalScrollProgress: number;
    protected previousScrollPosition?: number;
    private pendingMouseLeave?;
    private startX;
    private startY;
    private scrollStartX;
    private scrollStartY;
    constructor();
    private updateScrollerSizeAndPosition;
    private _onScroll;
    protected onClickVerticalScroller(event: MouseEvent): void;
    protected onClickHorizontalScroller(event: MouseEvent): void;
    protected onWheelHorizontalScroller(event: WheelEvent): void;
    protected onWheelVerticalScroller(event: WheelEvent): void;
    protected onHorizontalScrollerHandleMouseDown(mouseDownEvent: MouseEvent): void;
    protected preventDefault(event: Event): void;
    protected onVerticalScrollerHandleMouseDown(mouseDownEvent: MouseEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changedProperties: PropertyValueMap<this>): void;
    render(): import("lit").TemplateResult<1>;
}
//# sourceMappingURL=scroll-area.d.ts.map