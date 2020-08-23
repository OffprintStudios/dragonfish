import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsComponent } from './alerts.component';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  declarations: [AlertsComponent],
  imports: [
    CommonModule,
    IconsModule
  ],
  exports: [AlertsComponent]
})
export class AlertsModule { }