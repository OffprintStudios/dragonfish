import { Module } from '@nestjs/common';
import { Routes, RouterModule } from 'nest-router';

import { AuthModule } from './api/auth/auth.module';
import { ContentModule } from './api/content/content.module';
import { AdminModule } from './api/admin/admin.module';
import { SearchModule } from './api/search/search.module';
import { ImagesModule } from './api/images/images.module';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { NotificationModule } from './api/notification/notification.module';
import { MigrationModule } from './api/migration/migration.module';

const routes: Routes = [
    {
        path: 'api',
        children: [
            { path: 'auth', module: AuthModule },
            { path: 'content', module: ContentModule },
            { path: 'admin', module: AdminModule },
            { path: 'search', module: SearchModule },
            { path: 'images', module: ImagesModule },
            { path: 'dashboard', module: DashboardModule },
            { path: 'notifications', module: NotificationModule },
            { path: 'migration', module: MigrationModule },
        ],
    },
];

@Module({
    imports: [
        RouterModule.forRoutes(routes),
        AuthModule,
        ContentModule,
        AdminModule,
        SearchModule,
        ImagesModule,
        DashboardModule,
        NotificationModule,
        MigrationModule,
    ],
})
export class AppRoutingModule {}
