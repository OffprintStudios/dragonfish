import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { AlertsModule } from '@dragonfish/client/alerts';
import { PipesModule } from '@dragonfish/client/pipes';
import { WorkPageRoutingModule } from './work-page-routing.module';
import { Views } from './views';
import { Components } from './components';

@NgModule({
    imports: [CommonModule, WorkPageRoutingModule, UiModule, IconsModule, MaterialModule, AlertsModule, PipesModule],
    declarations: [...Views, ...Components],
})
export class WorkPageModule {}
