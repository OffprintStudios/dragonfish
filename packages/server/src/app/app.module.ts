import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { getJwtSecretKey, JWT_EXPIRATION } from './util';

import { AppController } from './app.controller';
import { AdminRoutes } from './controllers/admin';
import { AuthRoutes } from './controllers/auth';
import { ContentRoutes } from './controllers/content';
import { MigrationRoutes } from './controllers/migration';
import { NotificationsRoutes } from './controllers/notifications';
import { PortfolioRoutes } from './controllers/portfolio';
import { SearchRoutes } from './controllers/search';

@Module({
    imports: [
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
    providers: [],
})
export class AppModule {}
