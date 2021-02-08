import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsService, AlertsState } from './shared';
import { AlertsComponent } from './components';
import { IconsModule } from '@dragonfish/icons';

@NgModule({
    declarations: [
        AlertsComponent,
    ],
    imports: [
        CommonModule,
        IconsModule,
    ],
    providers: [
        AlertsService,
    ],
    exports: [
        AlertsState,
        AlertsService,
    ]
})
export class AlertsModule {}

export { AlertsState, AlertsService } from './shared';