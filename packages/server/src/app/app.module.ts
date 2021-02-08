import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

/* Controllers */
import { AppController } from './app.controller';
import { AdminRoutes } from './controllers/admin';
import { AuthRoutes } from './controllers/auth';
import { ContentRoutes } from './controllers/content';
import { MigrationRoutes } from './controllers/migration';
import { NotificationsRoutes } from './controllers/notifications';
import { PortfolioRoutes } from './controllers/portfolio';
import { SearchRoutes } from './controllers/search';

/* Services */
import { AdminServices } from './services/admin';
import { AuthServices } from './services/auth';
import { ImagesServices } from './services/images';
import { ContentServices } from './services/content';
import { MigrationServices } from './controllers/migration';

/* Database Modules */
import { UsersModule } from './db/users/users.module';
import { ContentModule } from './db/content';
import { ReadingHistoryModule } from './db/reading-history/reading-history.module';
import { CollectionsModule } from './db/collections/collections.module';
import { MessagesModule } from './db/messages/messages.module';
import { NotificationsModule } from './db/notifications/notifications.module';
import { SectionsModule } from './db/sections/sections.module';
import { ApprovalQueueModule } from './db/approval-queue/approval-queue.module';
import { CommentsModule } from './db/comments/comments.module';
import { WorksModule } from './db/works/works.module';
import { OldBlogsModule } from './db/blogs/blogs.module';

/* Utilies */
import { getJwtSecretKey, JWT_EXPIRATION } from './util';

/* Other */
import { ApprovalQueueService } from './services/admin/approval-queue.service';
import { MetaService } from './services/admin/meta.service';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/auth/user.service';
import { ImagesService } from './services/images/images.service';
import { ContentService } from './services/content/content.service';

@Module({
    imports: [
        UsersModule,
        ContentModule,
        ReadingHistoryModule,
        CollectionsModule,
        MessagesModule,
        NotificationsModule,
        SectionsModule,
        ApprovalQueueModule,
        CommentsModule,
        WorksModule,
        OldBlogsModule,
        ServeStaticModule.forRoot({ rootPath: join(__dirname, './static') }),
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.MONGO_URL,
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            }),
        }),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    controllers: [
        AppController,
        ...AdminRoutes,
        ...AuthRoutes,
        ...ContentRoutes,
        ...MigrationRoutes,
        ...NotificationsRoutes,
        ...PortfolioRoutes,
        ...SearchRoutes,
    ],
    providers: [
        ...AdminServices,
        ...AuthServices,
        ...ContentServices,
        ...ImagesServices,
        ...MigrationServices,
        { provide: 'IApprovalQueue', useClass: ApprovalQueueService },
        { provide: 'IMeta', useClass: MetaService },
        { provide: 'IAuth', useClass: AuthService },
        { provide: 'IUser', useClass: UserService },
        { provide: 'IImages', useClass: ImagesService },
        { provide: 'IContent', useClass: ContentService },
    ],
})
export class AppModule {}
