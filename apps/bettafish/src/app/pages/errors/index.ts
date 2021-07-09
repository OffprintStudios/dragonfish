import { NotFoundComponent } from './not-found/not-found.component';
import { Routes } from '@angular/router';

export const ErrorPages = [NotFoundComponent];

export const ErrorRoutes: Routes = [
    {
        path: '**',
        component: NotFoundComponent,
    },
];
