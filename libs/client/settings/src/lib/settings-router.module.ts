import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AccountSettingsComponent } from './views/account-settings/account-settings.component';
import { AuthGuard } from '@dragonfish/client/repository/session/services';
import { ProfileSettingsComponent } from './views/profile-settings/profile-settings.component';
import { SocialSettingsComponent } from './views/social-settings/social-settings.component';
import { NotificationSettingsComponent } from './views/notification-settings/notification-settings.component';
import { GeneralSettingsComponent } from './views/general-settings/general-settings.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: 'account',
                component: AccountSettingsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'profile',
                component: ProfileSettingsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'social',
                component: SocialSettingsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'notifications',
                component: NotificationSettingsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: '',
                component: GeneralSettingsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRouterModule {}
