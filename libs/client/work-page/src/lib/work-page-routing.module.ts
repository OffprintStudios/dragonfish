import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ContentHomeComponent } from './views/content-home/content-home.component';

/* Misc */
import { WorkPageResolver } from './work-page.resolver';

const routes: Routes = [
    {
        path: ':id/:title',
        resolve: { data: WorkPageResolver },
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
    providers: [WorkPageResolver],
})
export class WorkPageRoutingModule {}
