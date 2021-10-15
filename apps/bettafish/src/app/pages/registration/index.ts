import { RegistrationComponent } from './registration.component';
import { SetupPseudComponent } from './setup-pseud/setup-pseud.component';
import { SelectPseudComponent } from './select-pseud/select-pseud.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@dragonfish/client/repository/session/services';

export const RegistrationPages = [
    RegistrationComponent,
    SelectPseudComponent,
    SetupPseudComponent,
    ResetPasswordComponent,
];

export const RegistrationRoutes: Routes = [
    {
        path: 'registration',
        component: RegistrationComponent,
        children: [
            {
                path: 'select-pseud',
                component: SelectPseudComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'setup-pseud',
                component: SetupPseudComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
            },
        ],
    },
];
