import { Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';

export const MessagesPages = [MessagesComponent];

export const MessagesRoutes: Routes = [
    { path: 'messages', component: MessagesComponent }
];
