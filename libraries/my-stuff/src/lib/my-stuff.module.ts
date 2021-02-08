import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { MyStuffRoutingModule } from './my-stuff-routing.module';
import { MyStuffState } from './shared/my-stuff.state';
import { SectionsState } from './shared/sections';

@NgModule({
    imports: [
        CommonModule,
        MyStuffRoutingModule,
        NgxsModule.forFeature([MyStuffState, SectionsState])
    ],
})
export class MyStuffModule {}
