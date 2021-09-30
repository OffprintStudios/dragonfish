import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkPageRoutingModule } from './work-page-routing.module';
import { Views } from './views';

@NgModule({
    imports: [CommonModule, WorkPageRoutingModule],
    declarations: [...Views],
})
export class WorkPageModule {}
