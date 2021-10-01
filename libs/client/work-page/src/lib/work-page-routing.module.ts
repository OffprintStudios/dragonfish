import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ContentHomeComponent } from './views/content-home/content-home.component';
import { ContentInfoComponent } from './views/content-info/content-info.component';
import { ContentCommentsComponent } from './views/content-comments/content-comments.component';
import { ContentRelatedComponent } from './views/content-related/content-related.component';

/* Misc */
import { WorkPageResolver } from './work-page.resolver';

const routes: Routes = [
    {
        path: ':id/:title',
        resolve: { data: WorkPageResolver },
        runGuardsAndResolvers: 'paramsChange',
        children: [
            {
                path: '',
                component: ContentHomeComponent,
                children: [
                    {
                        path: '',
                        component: ContentInfoComponent,
                    },
                    {
                        path: 'comments',
                        component: ContentCommentsComponent,
                    },
                    {
                        path: 'related',
                        component: ContentRelatedComponent,
                    },
                ],
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
