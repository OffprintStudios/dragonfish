import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '@dragonfish/client/icons';
import { AlertsService } from './alerts.service';
import { AlertsComponent } from './alerts.component';

@NgModule({
    declarations: [AlertsComponent],
    imports: [CommonModule, IconsModule],
    providers: [AlertsService],
})
export class AlertsModule {}

export { AlertsService } from './alerts.service';
