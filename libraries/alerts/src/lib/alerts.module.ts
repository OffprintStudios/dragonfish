import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AlertsService, AlertsState } from './shared';
import { AlertsComponent } from './components';
import { IconsModule } from '@dragonfish/icons';

@NgModule({
    declarations: [AlertsComponent],
    imports: [CommonModule, IconsModule, NgxsModule.forFeature([AlertsState])],
    providers: [AlertsService],
})
export class AlertsModule {}

export { AlertsService } from './shared';
