import { Module } from '@nestjs/common';
import { Routes, RouterModule } from 'nest-router';
import { AuthModule } from './api/auth/auth.module';
import { ContentModule } from './api/content/content.module';

const routes: Routes = [
    {path: 'api', children: [
        {path: 'auth', module: AuthModule},
        {path: 'content', module: ContentModule},
    ]},
];

@Module({
    imports: [
        RouterModule.forRoutes(routes),
        AuthModule,
        ContentModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
