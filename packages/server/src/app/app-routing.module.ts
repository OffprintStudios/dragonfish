import { Module } from '@nestjs/common';
import { Routes, RouterModule } from 'nest-router';

import { AuthModule } from './api/auth/auth.module';
import { ContentModule } from './api/content/content.module';
import { AdminModule } from './api/admin/admin.module';
import { SearchModule } from './api/search/search.module';
import { ImagesModule } from './api/images/images.module';
import { ContribModule } from './api/contrib/contrib.module';
import { BrowseModule } from './api/browse/browse.module';
import { DashboardModule } from './api/dashboard/dashboard.module';

const routes: Routes = [
    {path: 'api', children: [
        {path: 'auth', module: AuthModule},
        {path: 'content', module: ContentModule},
        {path: 'admin', module: AdminModule},
        {path: 'search', module: SearchModule},
        {path: 'images', module: ImagesModule},
        {path: 'contrib', module: ContribModule},
        {path: 'browse', module: BrowseModule},
        {path: 'dashboard', module: DashboardModule}
    ]}
];

@Module({
    imports: [
        RouterModule.forRoutes(routes),
        AuthModule,
        AuthModule,
        ContentModule,
        AdminModule,
        SearchModule,
        ImagesModule,
        ContribModule,
        BrowseModule,
        DashboardModule,
    ]
})
export class AppRoutingModule {}