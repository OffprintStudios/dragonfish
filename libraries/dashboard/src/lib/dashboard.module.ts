import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AlertsModule } from '@dragonfish/alerts';
import { IconsModule } from '@dragonfish/icons';
import { MaterialModule } from '@dragonfish/material';
import { DashboardRoutingModule } from './dashboard-routing.module';

/* Pages */
import { DashboardComponent } from './dashboard.component';

/* Components */

/* State */

@NgModule({
    declarations: [
        DashboardComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        AlertsModule,
        IconsModule,
        MaterialModule,
        NgxsModule.forFeature([]),
    ],
})
export class DashboardModule {}
