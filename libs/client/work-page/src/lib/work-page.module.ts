import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@dragonfish/client/ui';
import { IconsModule } from '@dragonfish/client/icons';
import { MaterialModule } from '@dragonfish/client/material';
import { AlertsModule } from '@dragonfish/client/alerts';
import { PipesModule } from '@dragonfish/client/pipes';
import { EditorLiteModule } from '@dragonfish/client/editor-lite';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { WorkPageRoutingModule } from './work-page-routing.module';
import { Views } from './views';
import { Components } from './components';

@NgModule({
    imports: [
        CommonModule,
        WorkPageRoutingModule,
        UiModule,
        IconsModule,
        MaterialModule,
        AlertsModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        EditorLiteModule,
        NgSelectModule,
        NgxPaginationModule,
        ImageCropperModule,
    ],
    declarations: [...Views, ...Components],
})
export class WorkPageModule {}
