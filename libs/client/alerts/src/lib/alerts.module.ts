import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { IconsModule } from '@dragonfish/client/icons';
import { AlertsService, AlertsState } from './shared';
import { AlertsComponent } from './alerts.component'

@NgModule({
    declarations: [AlertsComponent],
    imports: [
        CommonModule,
        IconsModule,
        NgxsModule.forFeature([AlertsState]),
    ],
    providers: [AlertsService]
})
export class AlertsModule {}

export { AlertsService } from './shared';
