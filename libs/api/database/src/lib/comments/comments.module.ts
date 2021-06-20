import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './schemas';
import * as Stores from './stores';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Comment',
                useFactory: Schemas.setupCommentCollection,
                discriminators: [{ name: 'ContentComment', schema: Schemas.ContentCommentSchema }],
            },
        ]),
    ],
    exports: [Stores.CommentStore],
    providers: [Stores.CommentStore],
})
export class CommentsModule {}
