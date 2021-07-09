import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';

export const SettingsPages = [
    SettingsComponent,
];

export const SettingsRoutes: Routes = [
    { path: 'settings', component: SettingsComponent },
];
