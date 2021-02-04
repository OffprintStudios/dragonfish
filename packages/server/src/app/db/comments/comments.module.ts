import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

import { CommentsSchema } from './comments.schema';
import { CommentsService } from './comments.service';

import { ContentModule } from '../content/content.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        ContentModule,
        MongooseModule.forFeature([{ name: 'Comment', schema: CommentsSchema }]),
        NotificationsModule,
    ],
    providers: [
        CommentsService,
        {
            provide: getModelToken('ContentComment'),
            useFactory: (commentModel) =>
                commentModel.discriminator(
                    'ContentComment',
                    new Schema({
                        contentId: { type: String, ref: 'Content', required: true, index: true },
                    }),
                ),
            inject: [getModelToken('Comment')],
        },
    ],
    exports: [CommentsService],
})
export class CommentsModule {}
