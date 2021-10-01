import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */
import { ContentHomeComponent } from './views/content-home/content-home.component';
import { ContentInfoComponent } from './views/content-info/content-info.component';
import { ContentCommentsComponent } from './views/content-comments/content-comments.component';
import { ContentRelatedComponent } from './views/content-related/content-related.component';
import { SectionPageComponent } from './views/section-page/section-page.component';

/* Misc */
import { WorkPageResolver } from './work-page.resolver';
import { SectionPageResolver } from './section-page.resolver';
import { AuthGuard } from '@dragonfish/client/repository/session/services';

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
            {
                path: 'create-section',
                component: SectionPageComponent,
                data: { createMode: true },
                canActivate: [AuthGuard],
            },
            {
                path: 'section/:sectionId/:sectionTitle',
                component: SectionPageComponent,
                data: { createMode: false },
                resolve: { section: SectionPageResolver },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [WorkPageResolver, SectionPageResolver],
})
export class WorkPageRoutingModule {}
