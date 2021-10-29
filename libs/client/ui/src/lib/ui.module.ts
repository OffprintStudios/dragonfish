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
import { TabsModule } from 'ngx-tabset';
import { DynamicViewModule } from '@ngneat/overview';
import { TeleportModule } from '@ngneat/overview';
import { EditorLiteModule } from '@dragonfish/client/editor-lite';
import { MarkdownModule } from 'ngx-markdown';

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
import { NewsCardComponent } from './components/news-card/news-card.component';
import { PopupComponent } from './components/popup/popup.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { SidebarComponent } from './components/nav/sidebar/sidebar.component';
import { TopbarComponent } from './components/nav/topbar/topbar.component';
import { AuthModalComponent } from './components/auth/auth-modal/auth-modal.component';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { RegisterFormComponent } from './components/auth/register-form/register-form.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { MessagesTabComponent } from './components/inbox/messages-tab/messages-tab.component';
import { NotificationsTabComponent } from './components/inbox/notifications-tab/notifications-tab.component';
import { PagebarComponent } from './components/nav/pagebar/pagebar.component';
import { MobileNavComponent } from './components/nav/mobile-nav/mobile-nav.component';
import { WorkFormComponent } from './components/work-form/work-form.component';
import { TagBadgeComponent } from './components/tag-badge/tag-badge.component';
import { SectionsListComponent } from './components/sections-list/sections-list.component';
import { CommentBlockComponent } from './components/comment-block/comment-block.component';
import { UserMenuComponents } from './components/auth/user-menu';
import { ShelfCardComponent } from './components/shelf-card/shelf-card.component';

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
        NewsCardComponent,
        PopupComponent,
        ReportDialogComponent,
        SidebarComponent,
        TopbarComponent,
        AuthModalComponent,
        LoginFormComponent,
        RegisterFormComponent,
        ...UserMenuComponents,
        InboxComponent,
        MessagesTabComponent,
        NotificationsTabComponent,
        PagebarComponent,
        MobileNavComponent,
        WorkFormComponent,
        TagBadgeComponent,
        SectionsListComponent,
        CommentBlockComponent,
        ShelfCardComponent,
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
        TabsModule,
        DynamicViewModule,
        TeleportModule,
        EditorLiteModule,
        MarkdownModule.forChild(),
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
        NewsCardComponent,
        PopupComponent,
        ReportDialogComponent,
        SidebarComponent,
        TopbarComponent,
        PagebarComponent,
        MobileNavComponent,
        RegisterFormComponent,
        LoginFormComponent,
        WorkFormComponent,
        TagBadgeComponent,
        SectionsListComponent,
        CommentBlockComponent,
        ShelfCardComponent,
    ],
})
export class UiModule {}

export { PopupComponent } from './components/popup/popup.component';
export { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
export { WorkFormComponent } from './components/work-form/work-form.component';
export { WorkFormData } from './components/work-form/work-form-data';
