import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { AngularTooltipModule } from 'angular-tooltip';

import { AngularTooltipModule } from '../../projects/angular-tooltip/src/public_api';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AngularTooltipModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
