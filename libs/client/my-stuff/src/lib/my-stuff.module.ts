import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';
import { IconsModule } from '@dragonfish/client/icons';
import { PipesModule } from '@dragonfish/client/pipes';
import { UiModule } from '@dragonfish/client/ui';
import { AlertsModule } from '@dragonfish/client/alerts';
import { MaterialModule } from '@dragonfish/client/material';
import { MyStuffRoutingModule } from './my-stuff-routing.module';
import { CookieModule } from 'ngx-cookie';
import { EditorLiteModule } from '@dragonfish/client/editor-lite';
import { NgScrollbarModule } from 'ngx-scrollbar';

/* Components */
import { MyStuffComponent } from './my-stuff.component';
import {
    SectionItemComponent,
    ContentItemComponent,
    ContentPreviewComponent,
    ManageSectionsComponent,
    UploadCoverArtComponent,
    ContextMenuComponent,
} from './components';
import {
    BlogFormComponent,
    NewsFormComponent,
    PoetryFormComponent,
    ProseFormComponent,
    ViewPoetryComponent,
    ViewProseComponent,
    ContentPageComponent,
    SectionsPageComponent,
} from './views';

@NgModule({
    declarations: [
        MyStuffComponent,
        SectionItemComponent,
        ContentItemComponent,
        BlogFormComponent,
        NewsFormComponent,
        PoetryFormComponent,
        ProseFormComponent,
        ViewPoetryComponent,
        ViewProseComponent,
        ContentPageComponent,
        SectionsPageComponent,
        ContentPreviewComponent,
        ManageSectionsComponent,
        UploadCoverArtComponent,
        ContextMenuComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,
        ImageCropperModule,
        NgSelectModule,
        IconsModule,
        PipesModule,
        UiModule,
        AlertsModule,
        MaterialModule,
        MyStuffRoutingModule,
        ClickOutsideModule,
        ContextMenuModule,
        CookieModule,
        EditorLiteModule,
        NgScrollbarModule.withConfig({
            appearance: 'standard',
        }),
    ],
})
export class MyStuffModule {}
