import { ElementRef, Injectable } from '@angular/core';
import {
    ConnectedPosition,
    FlexibleConnectedPositionStrategy,
    Overlay,
} from '@angular/cdk/overlay';

export enum TooltipPositions {
    bottom = 'bottom',
    right = 'right',
}

export declare type TooltipPositionBottom = TooltipPositions.bottom;
export declare type TooltipPositionRight = TooltipPositions.right;
export declare type TooltipPosition =
    | TooltipPositionBottom
    | TooltipPositionRight;

@Injectable()
export class PositionService {
    constructor(private overlay: Overlay) {}

    public getPositionStrategy(
        elementRef: ElementRef,
        position?: TooltipPosition
    ): FlexibleConnectedPositionStrategy {
        let positions: ConnectedPosition[];

        switch (position) {
            case TooltipPositions.right:
                positions = [
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                        offsetX: 9,
                    },
                ];

                break;
            case TooltipPositions.bottom:
            default:
                positions = [
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top',
                        offsetY: 9,
                    },
                ];
        }

        return this.overlay
            .position()
            .flexibleConnectedTo(elementRef)
            .withPositions(positions)
            .withFlexibleDimensions(false)
            .withLockedPosition(true);
    }
}
