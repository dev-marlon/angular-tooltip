import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { PositionService } from './position.service';
import { TooltipComponent } from './tooltip.component';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';

@NgModule({
    declarations: [TooltipComponent, TooltipTriggerDirective],
    imports: [BrowserModule, OverlayModule],
    exports: [TooltipComponent, TooltipTriggerDirective],
    providers: [PositionService],
})
export class TooltipModule {}
