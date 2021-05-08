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

/* Utilies */
import { getJwtSecretKey, JWT_EXPIRATION } from './util';
import { ContentService } from './services/content/content.service';
import { SectionsService } from './services/content/sections.service';

@Module({
    imports: [
        ...DatabaseModules,
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
