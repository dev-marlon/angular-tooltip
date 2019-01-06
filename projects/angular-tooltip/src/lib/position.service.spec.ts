import { inject, TestBed } from '@angular/core/testing';

import {
    FlexibleConnectedPositionStrategy,
    Overlay,
    OverlayModule,
} from '@angular/cdk/overlay';

import { PositionService, TooltipPositions } from './position.service';
import { MockElementRef } from '../test/mock-element-ref';

describe('PositionService', () => {
    let overlay: Overlay;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [OverlayModule],
            providers: [PositionService],
        });

        inject([Overlay], (o: Overlay) => {
            overlay = o;
        })();
    });

    it('should be created', () => {
        const service: PositionService = TestBed.get(PositionService);
        expect(service).toBeTruthy();
    });

    describe('should return a position strategy with correct positions', () => {
        let service: PositionService;
        let elementRefMock: MockElementRef;

        beforeEach(() => {
            service = TestBed.get(PositionService);
            elementRefMock = new MockElementRef();
        });

        it('should return correct position for "right"', () => {
            const positionStrategy: FlexibleConnectedPositionStrategy = service.getPositionStrategy(
                elementRefMock,
                TooltipPositions.right
            );

            expect(positionStrategy).toBeTruthy();

            const expectedPositionStrategy: FlexibleConnectedPositionStrategy = overlay
                .position()
                .flexibleConnectedTo(elementRefMock)
                .withPositions([
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                        offsetX: 9,
                    },
                ]);

            expect(positionStrategy.positions).toEqual(
                expectedPositionStrategy.positions
            );
        });

        it('should return correct position for "bottom"', () => {
            const positionStrategy: FlexibleConnectedPositionStrategy = service.getPositionStrategy(
                elementRefMock,
                TooltipPositions.bottom
            );

            expect(positionStrategy).toBeTruthy();

            const expectedPositionStrategy: FlexibleConnectedPositionStrategy = overlay
                .position()
                .flexibleConnectedTo(elementRefMock)
                .withPositions([
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top',
                        offsetY: 9,
                    },
                ]);

            expect(positionStrategy.positions).toEqual(
                expectedPositionStrategy.positions
            );
        });

        it('should return correct default position', () => {
            const positionStrategy: FlexibleConnectedPositionStrategy = service.getPositionStrategy(
                elementRefMock
            );

            expect(positionStrategy).toBeTruthy();

            const expectedPositionStrategy: FlexibleConnectedPositionStrategy = overlay
                .position()
                .flexibleConnectedTo(elementRefMock)
                .withPositions([
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top',
                        offsetY: 9,
                    },
                ]);

            expect(positionStrategy.positions).toEqual(
                expectedPositionStrategy.positions
            );
        });
    });
});
