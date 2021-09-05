import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRouterModule } from './settings-router.module';
import { SettingsComponent } from './settings.component';
import { UiModule } from '@dragonfish/client/ui';
import { MaterialModule } from '@dragonfish/client/material';
import { IconsModule } from '@dragonfish/client/icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '@dragonfish/client/pipes';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';

/* Views */
import { AccountSettingsComponent } from './views/account-settings/account-settings.component';
import { GeneralSettingsComponent } from './views/general-settings/general-settings.component';
import { NotificationSettingsComponent } from './views/notification-settings/notification-settings.component';
import { ProfileSettingsComponent } from './views/profile-settings/profile-settings.component';
import { SocialSettingsComponent } from './views/social-settings/social-settings.component';

/* Components */
import { UploadAvatarComponent, CoverPicUploadComponent } from './components';

@NgModule({
    declarations: [
        SettingsComponent,
        AccountSettingsComponent,
        GeneralSettingsComponent,
        NotificationSettingsComponent,
        ProfileSettingsComponent,
        SocialSettingsComponent,
        UploadAvatarComponent,
        CoverPicUploadComponent,
    ],
    imports: [
        CommonModule,
        SettingsRouterModule,
        UiModule,
        MaterialModule,
        IconsModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        PipesModule,
        FileUploadModule,
        ImageCropperModule,
        NgScrollbarModule.withConfig({
            appearance: 'standard',
            track: 'all',
        }),
    ],
})
export class SettingsModule {}
