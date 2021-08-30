import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { SocialSettingsComponent } from './social-settings/social-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { AuthGuard } from '@dragonfish/client/repository/session/services';

export const SettingsPages = [
    SettingsComponent,
    GeneralSettingsComponent,
    AccountSettingsComponent,
    ProfileSettingsComponent,
    SocialSettingsComponent,
    NotificationSettingsComponent,
];

export const SettingsRoutes: Routes = [
    {
        path: 'settings',
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
