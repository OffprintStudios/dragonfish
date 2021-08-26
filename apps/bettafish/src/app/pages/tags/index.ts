import { Routes } from '@angular/router';
import { TagPageComponent } from './tag-page.component';

export const TagPages = [
    TagPageComponent
];

export const TagRoutes: Routes = [
    { path: 'tag/:tagId/:tagName', component: TagPageComponent },
];
