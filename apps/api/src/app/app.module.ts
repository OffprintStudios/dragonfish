import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

/* Controllers */
import { AdminRoutes } from './controllers/admin';
import { AuthRoutes } from './controllers/auth';
import { ContentRoutes } from './controllers/content';
import { SearchRoutes } from './controllers/search';

/* Services */
import { InterfaceProviders } from './services';
import { AdminServices } from './services/admin';
import { AuthServices } from './services/auth';
import { ImagesServices } from './services/images';
import { ContentServices } from './services/content';
import { SearchServices } from './services/search';

/* Modules */
import { NotificationsModule } from '@dragonfish/api/notifications';
import { ContentLibraryModule } from '@dragonfish/api/content-library';

/* Database Modules */
import { ContentModule } from '@dragonfish/api/database/content';
import { UsersModule } from '@dragonfish/api/database/users';
import { CollectionsModule } from '@dragonfish/api/database/collections';
import { ApprovalQueueModule } from '@dragonfish/api/database/approval-queue';
import { AdminModule } from '@dragonfish/api/database/admin/admin.module';
import { CommentsModule } from '@dragonfish/api/database/comments';
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
        AccountsModule,
        ContentLibraryModule,
        BullModule.forRootAsync({
            useFactory: () => ({
                redis: {
                    host: process.env.REDIS_HOST,
                    port: +process.env.REDIS_PORT,
                    username: process.env.REDIS_USER,
                    password: process.env.REDIS_PASSWORD,
                    tls: process.env.NODE_ENV === "development" 
                        ? undefined 
                        // An empty `tls` config object instructs Bull to try to connect via TLS
                        // (i.e.) rediss:// and is intentional here. 
                        : { }, 
                },
            }),
        }),
        EventEmitterModule.forRoot(),
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
        SendGridModule.forRootAsync({
            useFactory: () => ({
                apikey: process.env.SENDGRID_API_KEY,
                defaultMailData: {
                    from: process.env.SUPPORT_ADDRESS,
                },
            }),
        }),
    ],
    controllers: [...AdminRoutes, ...AuthRoutes, ...ContentRoutes, ...SearchRoutes],
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
