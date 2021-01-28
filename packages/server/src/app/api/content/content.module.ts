import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { WorksController } from './works/works.controller';
import { WorksModule } from '../../db/works/works.module';
import { PortfolioController } from './portfolio/portfolio.controller';
import { UsersModule } from '../../db/users/users.module';
import { ImagesModule } from '../images/images.module';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';
import { CollectionsModule } from '../../db/collections/collections.module';
import { CollectionsController } from './collections/collections.controller';
import { HistoryController } from './history/history.controller';
import { ReadingHistoryModule } from '../../db/reading-history/reading-history.module';
import { CommentsModule } from '../../db/comments/comments.module';
import { CommentsController } from './comments/comments.controller';
import { MessagesController } from './messages/messages.controller';
import { MessagesModule } from '../../db/messages/messages.module';
import { NewsController } from './news/news.controller';
import { ContentModule as ContentCollectionModule } from '../../db/content';
import { ContentController } from './content.controller';
import { ProseController } from './prose/prose.controller';
import { PoetryController } from './poetry/poetry.controller';
import { SectionsModule } from '../../db/sections/sections.module';
import { SectionsController } from './sections/sections.controller';

@Module({
  imports: [
    WorksModule, UsersModule, ImagesModule, CollectionsModule, ReadingHistoryModule, CommentsModule,
    MessagesModule, ContentCollectionModule, SectionsModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  controllers: [
    WorksController, PortfolioController, 
    CollectionsController, HistoryController, CommentsController, 
    MessagesController, NewsController, ContentController, ProseController,
    PoetryController, SectionsController
  ]
})
export class ContentModule {}
