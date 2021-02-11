import { Routes } from '@angular/router';

import { MigrationComponent } from './migration.component';
import { MigrateWorkComponent } from './migrate-work/migrate-work.component';
import { MigrateBlogComponent } from './migrate-blog/migrate-blog.component';

import { AuthGuard } from '../../shared/auth/services';
import { MigrationResolver, MigrateBlogResolver, MigrateWorkResolver } from '../../resolvers/migration';

export const MigrationPages = [MigrationComponent, MigrateWorkComponent, MigrateBlogComponent];

export const MigrationRoutes: Routes = [
    {
        path: 'migration',
        component: MigrationComponent,
        canActivate: [AuthGuard],
        resolve: {
            contentData: MigrationResolver,
        },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'work/:workId',
                component: MigrateWorkComponent,
                canActivate: [AuthGuard],
                resolve: {
                    workData: MigrateWorkResolver,
                },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'blog/:blogId',
                component: MigrateBlogComponent,
                canActivate: [AuthGuard],
                resolve: {
                    blogData: MigrateBlogResolver,
                },
                runGuardsAndResolvers: 'always',
            },
        ],
    },
];
