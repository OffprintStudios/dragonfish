import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppRoutingModule } from './app-routing.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        AppRoutingModule,
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
    controllers: [AppController],
})
export class AppModule {}
