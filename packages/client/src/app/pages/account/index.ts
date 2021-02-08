import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';

export const AccountPages = [RegisterComponent];

export const AccountRoutes: Routes = [
    { path: 'register', component: RegisterComponent },
];
