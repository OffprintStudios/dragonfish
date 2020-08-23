import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { BlogsController } from './blogs/blogs.controller';
import { WorksController } from './works/works.controller';
import { BlogsModule } from '../../db/blogs/blogs.module';
import { WorksModule } from '../../db/works/works.module';
import { PortfolioController } from './portfolio/portfolio.controller';
import { UsersModule } from '../../db/users/users.module';
import { ImagesModule } from '../images/images.module';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';
import { CollectionsModule } from '../../db/collections/collections.module';
import { CollectionsController } from './collections/collections.controller';
import { HistoryController } from './history/history.controller';
import { HistoryModule } from '../../db/history/history.module';
import { CommentsModule } from '../../db/comments/comments.module';
import { CommentsController } from './comments/comments.controller';

@Module({
  imports: [
    BlogsModule, WorksModule, UsersModule, ImagesModule, CollectionsModule,
    HistoryModule, CommentsModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  controllers: [BlogsController, WorksController, PortfolioController, CollectionsController, HistoryController, CommentsController]
})
export class ContentModule {}
