import { Component, DebugElement } from '@angular/core';
import {
    ComponentFixture,
    fakeAsync,
    inject,
    TestBed,
    tick,
} from '@angular/core/testing';

import { AngularTooltipModule } from '../public_api';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';

const initialTooltipMessage = 'Lorem ispum si dolor amet';

describe('AngularTooltipDirective', () => {
    let fixture: ComponentFixture<TooltipDemoComponent>;
    let buttonDebugElement: DebugElement;
    let overlayContainer: OverlayContainer;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AngularTooltipModule],
            declarations: [TooltipDemoComponent],
        }).compileComponents();

        inject([OverlayContainer], (oc: OverlayContainer) => {
            overlayContainer = oc;
            overlayContainerElement = oc.getContainerElement();
        })();

        fixture = TestBed.createComponent(TooltipDemoComponent);
        fixture.detectChanges();

        buttonDebugElement = fixture.debugElement.query(By.css('button'));
    });

    it('should show and hide the tooltip', fakeAsync(() => {
        buttonDebugElement.nativeElement.dispatchEvent(
            new Event('mousemove', { bubbles: true })
        );

        // Tooltip will be shown after a 250ms delay
        tick(250);

        const tooltipElement = overlayContainerElement.querySelector(
            '.tooltip'
        ) as HTMLElement;

        expect(tooltipElement instanceof HTMLElement).toBe(true);
        expect(overlayContainerElement.textContent).toContain(
            initialTooltipMessage
        );
    }));
});

@Component({
    // tslint:disable-next-line
    selector: 'tooltip-demo-component',
    template: `
        <button [mTooltipTrigger]="tooltip">Button</button>
        <m-tooltip #tooltip>{{ tooltipContent }}</m-tooltip>
    `,
})
class TooltipDemoComponent {
    public tooltipContent: String = initialTooltipMessage;
}
