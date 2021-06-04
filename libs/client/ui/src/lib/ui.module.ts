import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2FittextModule } from 'ng2-fittext';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LineTruncationLibModule } from 'ngx-line-truncation';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconsModule } from '@dragonfish/client/icons';
import { PipesModule } from '@dragonfish/client/pipes';
import { MaterialModule } from '@dragonfish/client/material';
import { ClickOutsideModule } from 'ng-click-outside';

/* Components */
import { RatingIconComponent } from './components/rating-icon/rating-icon.component';
import { RoleBadgeComponent } from './components/role-badge/role-badge.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { WorkCardComponent } from './components/work-card/work-card.component';
import { TextFieldComponent } from './components/text-field/text-field.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { ContentListItemComponent } from './components/content-list-item/content-list-item.component';
import { SectionsListComponent } from './components/sections-list/sections-list.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { PopupComponent } from './components/popup/popup.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { EditorLiteComponent } from './components/editor-lite/editor-lite.component';

@NgModule({
    declarations: [
        RatingIconComponent,
        RoleBadgeComponent,
        UserCardComponent,
        WorkCardComponent,
        TextFieldComponent,
        ToggleComponent,
        TextAreaComponent,
        BlogCardComponent,
        ContentListItemComponent,
        SectionsListComponent,
        NewsCardComponent,
        PopupComponent,
        ReportDialogComponent,
        EditorLiteComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IconsModule,
        PipesModule,
        Ng2FittextModule,
        FileUploadModule,
        ImageCropperModule,
        LineTruncationLibModule,
        NgSelectModule,
        MaterialModule,
        ClickOutsideModule,
        RouterModule.forChild([]),
    ],
    exports: [
        RatingIconComponent,
        RoleBadgeComponent,
        UserCardComponent,
        WorkCardComponent,
        TextFieldComponent,
        ToggleComponent,
        TextAreaComponent,
        BlogCardComponent,
        ContentListItemComponent,
        SectionsListComponent,
        NewsCardComponent,
        PopupComponent,
        ReportDialogComponent,
        EditorLiteComponent,
    ],
})
export class UiModule {}

export { PopupComponent } from './components/popup/popup.component';
export { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
