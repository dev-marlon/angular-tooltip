import {
    Component,
    ViewChild,
    TemplateRef,
    EventEmitter,
    OnDestroy,
    ElementRef,
    Input,
} from '@angular/core';

@Component({
    selector: 'm-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.less'],
})
export class TooltipComponent implements OnDestroy {
    public closeEvent: EventEmitter<void> = new EventEmitter<void>();
    public arrowPosition: string;

    @Input() public headline: string;
    @ViewChild(TemplateRef) public templateRef: TemplateRef<HTMLElement>;
    @ViewChild('tooltip') public tooltipRef: ElementRef<HTMLElement>;

    public ngOnDestroy(): void {
        this.closeEvent.complete();
    }

    public closeTooltip(): void {
        this.closeEvent.emit();
    }
}
