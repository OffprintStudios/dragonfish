import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';
import { NgxsModule } from '@ngxs/store';
import { IconsModule } from '@dragonfish/client/icons';
import { PipesModule } from '@dragonfish/client/pipes';
import { EditorModule } from '@dragonfish/client/editor';
import { UiModule } from '@dragonfish/client/ui';
import { AlertsModule } from '@dragonfish/client/alerts';
import { MaterialModule } from '@dragonfish/client/material';
import { MyStuffRoutingModule } from './my-stuff-routing.module';

/* Components */
import { MyStuffComponent } from './my-stuff.component';
import {
    ToolbarComponent,
    SectionItemComponent,
    ContentItemComponent,
    ContentPreviewComponent,
    ManageSectionsComponent,
    UploadCoverArtComponent,
} from './components';
import {
    BlogFormComponent,
    NewsFormComponent,
    PoetryFormComponent,
    ProseFormComponent,
    ViewPoetryComponent,
    ViewProseComponent
} from './views';

/* State */
import { MyStuffState } from './repo';
import { SectionsState } from './repo/sections';

/* Services */
import { NetworkService, MyStuffService } from './repo/services';

@NgModule({
    declarations: [
        MyStuffComponent,
        ToolbarComponent,
        SectionItemComponent,
        ContentItemComponent,
        BlogFormComponent,
        NewsFormComponent,
        PoetryFormComponent,
        ProseFormComponent,
        ViewPoetryComponent,
        ViewProseComponent,
        ContentPreviewComponent,
        ManageSectionsComponent,
        UploadCoverArtComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,
        ImageCropperModule,
        NgSelectModule,
        NgxsModule.forFeature([MyStuffState, SectionsState]),
        IconsModule,
        PipesModule,
        EditorModule,
        UiModule,
        AlertsModule,
        MaterialModule,
        MyStuffRoutingModule,
        ClickOutsideModule,
        ContextMenuModule,
    ],
    providers: [
        NetworkService,
        MyStuffService,
    ]
})
export class MyStuffModule {}
