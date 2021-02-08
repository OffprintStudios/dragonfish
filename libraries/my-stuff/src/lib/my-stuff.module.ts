import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { MaterialModule } from '@dragonfish/material';
import { IconsModule } from '@dragonfish/icons';
import { AlertsModule } from '@dragonfish/alerts';

import { MyStuffRoutingModule } from './my-stuff-routing.module';
import { MyStuffState } from './shared/my-stuff.state';
import { SectionsState } from './shared/sections';
import { MyStuffComponents } from './components';

@NgModule({
    declarations: [
        ...MyStuffComponents
    ],
    imports: [
        CommonModule,
        MyStuffRoutingModule,
        NgxsModule.forFeature([MyStuffState, SectionsState]),
        MaterialModule,
        IconsModule,
        AlertsModule,
    ],
})
export class MyStuffModule {}
