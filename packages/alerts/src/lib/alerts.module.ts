import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IconsModule } from '@pulp-fiction/icons';

import { AlertComponent } from './components';
import { AlertService } from './services';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, MatSnackBarModule, IconsModule],
  providers: [AlertService],
  exports: [AlertComponent, AlertService]
})
export class AlertsModule {}
