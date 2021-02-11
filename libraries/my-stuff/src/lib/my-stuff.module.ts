import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxsModule } from '@ngxs/store';
import { MaterialModule } from '@dragonfish/material';
import { IconsModule } from '@dragonfish/icons';
import { AlertsModule } from '@dragonfish/alerts';
import { PipesModule } from '@dragonfish/pipes';
import { EditorModule } from '@dragonfish/editor';
import { ComponentsModule } from '@dragonfish/components';
import { MyStuffRoutingModule } from './my-stuff-routing.module';

/* State */
import { MyStuffState } from './shared/my-stuff.state';
import { SectionsState } from './shared/sections';

/* Components */
import { ContentItemComponent, SectionItemComponent, UploadCoverartComponent } from './components';
import { BlogFormComponent, NewsFormComponent, PoetryFormComponent, ProseFormComponent, ViewPoetryComponent, ViewProseComponent } from './views';
import { MyStuffFacade } from './facades';
import { MyStuffService } from './shared/services';
import { MyStuffComponent } from './my-stuff.component';

@NgModule({
    declarations: [
        MyStuffComponent, 
        BlogFormComponent,
        NewsFormComponent,
        PoetryFormComponent,
        ProseFormComponent,
        ViewProseComponent,
        ViewPoetryComponent,
        ContentItemComponent,
        SectionItemComponent, 
        UploadCoverartComponent,
    ],
    imports: [
        CommonModule,
        MyStuffRoutingModule,
        NgxsModule.forFeature([MyStuffState, SectionsState]),
        MaterialModule,
        IconsModule,
        AlertsModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        EditorModule,
        ComponentsModule,
        FileUploadModule,
        ImageCropperModule,
    ],
    providers: [MyStuffFacade, MyStuffService],
})
export class MyStuffModule {}
