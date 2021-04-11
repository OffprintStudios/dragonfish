import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const HomePages = [HomeComponent];

export const HomeRoutes: Routes = [{ path: '', component: HomeComponent, pathMatch: 'full' }];
