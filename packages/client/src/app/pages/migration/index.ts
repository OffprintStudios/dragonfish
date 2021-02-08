import { Routes } from '@angular/router';

import { MigrationComponent } from './migration.component';
import { MigrateWorkComponent } from './migrate-work/migrate-work.component';
import { MigrateBlogComponent } from './migrate-blog/migrate-blog.component';

import { AuthGuard } from '../../shared/auth/services';
import { MigrationResolvers } from '../../resolvers/migration';

export const MigrationPages = [
    MigrationComponent,
    MigrateWorkComponent,
    MigrateBlogComponent,
];

export const MigrationRoutes: Routes = [
    {
        path: 'migration',
        component: MigrationComponent,
        canActivate: [AuthGuard],
        resolve: { contentData: MigrationResolvers.find(x => { return x.name === 'MigrationResolver' }) },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'work/:workId',
                component: MigrateWorkComponent,
                canActivate: [AuthGuard],
                resolve: { workData: MigrationResolvers.find(x => { return x.name === 'MigrateWorkResolver' }) },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'blog/:blogId',
                component: MigrateBlogComponent,
                canActivate: [AuthGuard],
                resolve: { blogData: MigrationResolvers.find(x => { return x.name === 'MigrateBlogResolver' }) },
                runGuardsAndResolvers: 'always',
            },
        ],
    },
];