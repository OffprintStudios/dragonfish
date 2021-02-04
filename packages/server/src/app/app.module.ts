import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppRoutingModule } from './app-routing.module';

@Module({
    imports: [
        AppRoutingModule,
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
    ],
})
export class AppModule {}
