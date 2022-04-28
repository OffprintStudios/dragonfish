import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Controllers from './controllers';
import * as Services from './services';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import { AccountsModule } from '$modules/accounts';
import { JwtModule } from '@nestjs/jwt';
import { getJwtSecretKey, JWT_EXPIRATION } from '$shared/util';

@Module({
    imports: [
        AccountsModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
        MongooseModule.forFeatureAsync([
            {
                name: 'MessageThread',
                useFactory: Schemas.setupMessageThreadsCollection,
            },
            {
                name: 'Message',
                useFactory: Schemas.setupMessagesCollection,
            },
        ]),
    ],
    exports: [],
    providers: [
        Services.MessagesService,
        Stores.MessagesStore,
        Stores.MessageThreadsStore,
        Controllers.MessagesGateway,
    ],
    controllers: [Controllers.MessagesController],
})
export class MessagesModule {}
