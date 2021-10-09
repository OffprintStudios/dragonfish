import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

/* Controllers */
import { AdminRoutes } from './controllers/admin';
import { AuthRoutes } from './controllers/auth';
import { ContentRoutes } from './controllers/content';
import { SearchRoutes } from './controllers/search';
import { ContentLibraryRoutes } from './controllers/content-library';

/* Services */
import { InterfaceProviders } from './services';
import { AdminServices } from './services/admin';
import { AuthServices } from './services/auth';
import { ImagesServices } from './services/images';
import { ContentServices } from './services/content';
import { SearchServices } from './services/search';

/* Database Modules */
import { ContentModule } from '@dragonfish/api/database/content';
import { NotificationsModule } from '@dragonfish/api/database/notifications';
import { UsersModule } from '@dragonfish/api/database/users';
import { CollectionsModule } from '@dragonfish/api/database/collections';
import { ApprovalQueueModule } from '@dragonfish/api/database/approval-queue';
import { AdminModule } from '@dragonfish/api/database/admin/admin.module';
import { CommentsModule } from '@dragonfish/api/database/comments';
import { ContentLibraryModule } from '@dragonfish/api/database/content-library';
import { AccountsModule } from '@dragonfish/api/database/accounts';

/* Utilities */
import { getJwtSecretKey, JWT_EXPIRATION } from '@dragonfish/api/utilities/secrets';

@Module({
    imports: [
        ContentModule,
        NotificationsModule,
        UsersModule,
        CollectionsModule,
        ApprovalQueueModule,
        AdminModule,
        CommentsModule,
        ContentLibraryModule,
        AccountsModule,
        ServeStaticModule.forRoot({ rootPath: join(__dirname, './static') }),
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.MONGO_URL,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
        }),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                secure: false,
                port: +process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            },
            defaults: {
                from: `"Beatriz" <${process.env.MAIL_FROM}>`,
            },
            template: {
                dir: join(__dirname, 'assets/templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [...AdminRoutes, ...AuthRoutes, ...ContentRoutes, ...SearchRoutes, ...ContentLibraryRoutes],
    providers: [
        ...AdminServices,
        ...AuthServices,
        ...ContentServices,
        ...ImagesServices,
        ...SearchServices,
        ...InterfaceProviders,
    ],
})
export class AppModule {}
