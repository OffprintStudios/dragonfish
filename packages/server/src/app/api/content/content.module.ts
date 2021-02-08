import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { WorksModule } from '../../db/works/works.module';
import { UsersModule } from '../../db/users/users.module';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';
import { CollectionsModule } from '../../db/collections/collections.module';
import { ReadingHistoryModule } from '../../db/reading-history/reading-history.module';
import { CommentsModule } from '../../db/comments/comments.module';
import { MessagesModule } from '../../db/messages/messages.module';
import { NewsController } from './news/news.controller';
import { ContentModule as ContentCollectionModule } from '../../db/content';
import { ProseController } from './prose/prose.controller';
import { PoetryController } from './poetry/poetry.controller';
import { SectionsModule } from '../../db/sections/sections.module';

@Module({
    imports: [
        WorksModule,
        UsersModule,
        CollectionsModule,
        ReadingHistoryModule,
        CommentsModule,
        MessagesModule,
        ContentCollectionModule,
        SectionsModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    controllers: [
        NewsController,
        ProseController,
        PoetryController,
    ],
})
export class ContentModule {}
