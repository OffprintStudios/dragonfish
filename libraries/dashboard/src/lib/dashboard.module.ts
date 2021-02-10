import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgxsModule.forFeature([])
    ],
})
export class DashboardModule {}
