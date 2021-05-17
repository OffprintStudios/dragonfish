import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

/* Controllers */
import { AdminRoutes } from './controllers/admin';
import { AuthRoutes } from './controllers/auth';
import { ContentRoutes } from './controllers/content';
import { MigrationRoutes } from './controllers/migration';
import { SearchRoutes } from './controllers/search';

/* Services */
import { InterfaceProviders } from './services';
import { AdminServices } from './services/admin';
import { AuthServices } from './services/auth';
import { ImagesServices } from './services/images';
import { ContentServices } from './services/content';
import { MigrationServices } from './controllers/migration';
import { SearchServices } from './services/search';

/* Database Modules */
import { DatabaseModules } from './db';
import { ContentModule } from '@dragonfish/api/database/content';
import { NotificationsModule } from '@dragonfish/api/database/notifications';
import { UsersModule } from '@dragonfish/api/database/users';
import { CollectionsModule } from '@dragonfish/api/database/collections';
import { ApprovalQueueModule } from '@dragonfish/api/database/approval-queue';

/* Utilities */
import { getJwtSecretKey, JWT_EXPIRATION } from '@dragonfish/api/utilities/secrets';

@Module({
    imports: [
        ...DatabaseModules,
        ContentModule,
        NotificationsModule,
        UsersModule,
        CollectionsModule,
        ApprovalQueueModule,
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
    controllers: [...AdminRoutes, ...AuthRoutes, ...ContentRoutes, ...MigrationRoutes, ...SearchRoutes],
    providers: [
        ...AdminServices,
        ...AuthServices,
        ...ContentServices,
        ...ImagesServices,
        ...MigrationServices,
        ...SearchServices,
        ...InterfaceProviders,
    ],
})
export class AppModule {}
