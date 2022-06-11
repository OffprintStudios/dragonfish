import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import * as Controllers from './controllers';
import * as Services from './services';
import { getJwtSecretKey, JWT_EXPIRATION } from '$shared/util';
import { AccountsModule } from '$modules/accounts';
import { ContentModule } from '$modules/content';

@Module({
    imports: [
        AccountsModule,
        ContentModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'Comment',
                useFactory: Schemas.setupCommentCollection,
                discriminators: [{ name: 'ContentComment', schema: Schemas.ContentCommentSchema }],
            },
        ]),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    exports: [Services.CommentsService],
    providers: [Stores.CommentStore, Services.CommentsService],
    controllers: [Controllers.CommentsController],
})
export class CommentsModule {}
