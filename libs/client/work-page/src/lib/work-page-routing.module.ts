import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ContentHomeComponent } from './views/content-home/content-home.component';

const routes: Routes = [
    {
        path: ':id/:title',
        children: [
            {
                path: '',
                component: ContentHomeComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkPageRoutingModule {}
