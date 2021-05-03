import { MigrationComponent } from './migration.component';
import { MigrationResolver } from './migration.resolver';
import { MigrateWorkComponent } from './migrate-work/migrate-work.component';
import { MigrateWorkResolver } from './migrate-work/migrate-work.resolver';
import { MigrateBlogComponent } from './migrate-blog/migrate-blog.component';
import { MigrateBlogResolver } from './migrate-blog/migrate-blog.resolver';
import { Routes } from '@angular/router';
import { AuthGuard } from '../../repo/auth/services';

export const MigrationPages = [MigrationComponent, MigrateWorkComponent, MigrateBlogComponent];
export const MigrationResolvers = [MigrationResolver, MigrateWorkResolver, MigrateBlogResolver];
export const MigrationRoutes: Routes = [
    {
        path: 'migration',
        component: MigrationComponent,
        canActivate: [AuthGuard],
        resolve: {
            contentData: MigrationResolver
        },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'work/:workId',
                component: MigrateWorkComponent,
                canActivate: [AuthGuard],
                resolve: {
                    workData: MigrateWorkResolver
                },
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'blog/:blogId',
                component: MigrateBlogComponent,
                canActivate: [AuthGuard],
                resolve: {
                    blogData: MigrateBlogResolver
                },
                runGuardsAndResolvers: 'always'
            },
        ],
    },
];
