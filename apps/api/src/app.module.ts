import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SendGridModule, SendGridModuleOptions } from '@anchan828/nest-sendgrid';

/* Modules */
import { AccountsModule } from '$modules/accounts';
import { ContentModule } from '$modules/content';
import { NotificationsModule } from '$modules/notifications';
import { AdminModule } from '$modules/admin';
import { CommentsModule } from '$modules/comments';
import { UtilitiesModule } from '$modules/utilities';
import { MessagesModule } from '$modules/messages';

@Module({
    imports: [
        AdminModule,
        AccountsModule,
        ContentModule,
        NotificationsModule,
        CommentsModule,
        UtilitiesModule,
        MessagesModule,
        EventEmitterModule.forRoot(),
        BullModule.forRootAsync({
            useFactory: () => ({
                redis: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 9164,
                    username: process.env.REDIS_USER,
                    password: process.env.REDIS_PASSWORD,
                    tls:
                        process.env.NODE_ENV === 'development'
                            ? undefined
                            : // An empty `tls` config object instructs Bull to try to connect via TLS
                              // (i.e.) redis:// and is intentional here.
                              {},
                },
            }),
        }),
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.MONGO_URL,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
        }),
        SendGridModule.forRootAsync({
            useFactory: (): SendGridModuleOptions => ({
                apikey: process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '',
                defaultMailData: {
                    from: process.env.SUPPORT_ADDRESS,
                },
            }),
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
