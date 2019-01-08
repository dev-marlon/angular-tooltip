import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';

import { fromEvent, Subject } from 'rxjs';
import {
    debounceTime,
    filter,
    share,
    startWith,
    switchMap,
    switchMapTo,
    takeUntil,
} from 'rxjs/operators';

import { TooltipComponent } from './tooltip.component';
import {
    PositionService,
    TooltipPosition,
    TooltipPositions,
} from './position.service';

@Directive({
    selector: '[mTooltipTrigger]',
})
export class TooltipTriggerDirective implements AfterViewInit, OnDestroy {
    private overlayRef: OverlayRef;
    private tooltipOpen: boolean = false;
    private destroy$: Subject<HTMLElement> = new Subject<HTMLElement>();

    private showTimeoutId: number;
    private hideTimeoutId: number;

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private elementRef: ElementRef,
        private platform: Platform,
        private positionService: PositionService
    ) {}

    @Input('mTooltipTrigger') public tooltip: TooltipComponent;
    @Input('mTooltipPosition') public position: TooltipPosition;

    @HostListener('mouseenter', ['$event'])
    public onMouseenter(e: Event): void {
        if (this.tooltipOpen) {
            return;
        }

        if (this.showTimeoutId) {
            return;
        }

        this.showTimeoutId = setTimeout(() => {
            this.openTooltip();

            document.addEventListener('mousemove', (event: MouseEvent) => {
                // Overcome gap between trigger and tooltip elements
                if (this.hideTimeoutId) {
                    return;
                }

                this.hideTimeoutId = setTimeout(() => {
                    console.log(
                        this.isMovedOutsideElements(
                            this.elementRef.nativeElement,
                            this.tooltip.tooltipRef.nativeElement,
                            event
                        )
                    );

                    return;

                    if (
                        this.isMovedOutsideElements(
                            this.elementRef.nativeElement,
                            this.tooltip.tooltipRef.nativeElement,
                            event
                        )
                    ) {
                        console.log('outside');

                        return;
                    }

                    this.closeTooltip();
                    this.hideTimeoutId = null;
                }, 100);
            });

            this.showTimeoutId = null;
        }, 250);
    }

    @HostListener('mouseleave', ['$event'])
    public onMouseleave(e: Event): void {
        console.log(e);

        return;

        // Cancel the delayed show if it is scheduled
        if (this.showTimeoutId) {
            clearTimeout(this.showTimeoutId);
            this.showTimeoutId = null;
        }

        if (!this.tooltipOpen) {
            return;
        }

        if (this.hideTimeoutId) {
            return;
        }

        this.hideTimeoutId = setTimeout(() => {
            this.closeTooltip();
            this.hideTimeoutId = null;
        }, 90);
    }

    public ngAfterViewInit(): void {
        return;

        if (this.platform.IOS || this.platform.ANDROID) {
            this.initTablet();

            return;
        }

        this.initDesktop();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
    }

    private initDesktop(): void {
        const originNativeEl: HTMLElement = this.elementRef.nativeElement;
        const openTooltip$ = fromEvent(originNativeEl, 'mousemove').pipe(
            filter(() => !this.tooltipOpen),
            switchMap((enterEvent: MouseEvent) =>
                fromEvent(document, 'mousemove').pipe(
                    startWith(enterEvent),
                    debounceTime(250),
                    filter((event: MouseEvent) =>
                        originNativeEl.contains(event.target as Node)
                    ),
                    share()
                )
            )
        );

        openTooltip$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.openTooltip());

        const closeTooltip$ = fromEvent(document, 'mousemove').pipe(
            debounceTime(90),
            filter(() => this.tooltipOpen),
            filter((event: MouseEvent) =>
                this.isMovedOutsideElements(
                    originNativeEl,
                    this.tooltip.tooltipRef.nativeElement,
                    event
                )
            )
        );

        openTooltip$
            .pipe(
                takeUntil(this.destroy$),
                switchMapTo(closeTooltip$),
                debounceTime(100)
            )
            .subscribe(() => this.closeTooltip());

        this.tooltip.closeEvent.subscribe(() => this.closeTooltip());
    }

    private initTablet(): void {
        const originNativeEl = this.elementRef.nativeElement;

        const openTooltip$ = fromEvent(originNativeEl, 'touchend').pipe(
            filter(() => !this.tooltipOpen)
        );

        openTooltip$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.openTooltip());

        const closeTooltip$ = fromEvent(document, 'touchend').pipe(
            filter(() => this.tooltipOpen),
            filter((event: TouchEvent) =>
                this.isMovedOutsideElements(
                    originNativeEl,
                    this.tooltip.tooltipRef.nativeElement,
                    event
                )
            )
        );

        openTooltip$
            .pipe(
                takeUntil(this.destroy$),
                switchMapTo(closeTooltip$)
            )
            .subscribe(() => this.closeTooltip());

        this.tooltip.closeEvent.subscribe(() => this.closeTooltip());
    }

    private openTooltip(): void {
        this.overlayRef = this.getOverlay();

        this.setTooltipArrowPosition();

        if (!this.overlayRef.hasAttached()) {
            const portal = new TemplatePortal(
                this.tooltip.templateRef,
                this.viewContainerRef
            );

            this.overlayRef.attach(portal);
            this.tooltipOpen = true;
        }
    }

    private setTooltipArrowPosition(): void {
        switch (this.position) {
            case TooltipPositions.right:
                this.tooltip.arrowPosition = 'left';
                break;
            case TooltipPositions.bottom:
            default:
                this.tooltip.arrowPosition = '';
        }
    }

    private closeTooltip(): void {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.tooltipOpen = false;
        }
    }

    private getOverlay(): OverlayRef {
        if (!this.overlayRef) {
            const config = new OverlayConfig({
                positionStrategy: this.positionService.getPositionStrategy(
                    this.elementRef,
                    this.position
                ),
                scrollStrategy: this.overlay.scrollStrategies.reposition(),
            });

            this.overlayRef = this.overlay.create(config);
        }

        return this.overlayRef;
    }

    private isMovedOutsideElements(
        overlayOriginEl: HTMLElement,
        tooltipEl: HTMLElement,
        event: Event
    ): boolean {
        return !(
            overlayOriginEl.contains(event.target as Node) ||
            tooltipEl.contains(event.target as Node)
        );
    }
}
