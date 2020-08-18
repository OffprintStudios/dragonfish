import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { BlogsController } from './blogs/blogs.controller';
import { WorksController } from './works/works.controller';
import { BlogsModule } from 'src/db/blogs/blogs.module';
import { WorksModule } from 'src/db/works/works.module';
import { PortfolioController } from './portfolio/portfolio.controller';
import { UsersModule } from 'src/db/users/users.module';
import { ImagesModule } from '../images/images.module';
import { getJwtSecretKey, JWT_EXPIRATION } from 'src/util';
import { CollectionsModule } from 'src/db/collections/collections.module';
import { CollectionsController } from './collections/collections.controller';
import { HistoryController } from './history/history.controller';
import { HistoryModule } from 'src/db/history/history.module';

@Module({
  imports: [
    BlogsModule, WorksModule, UsersModule, ImagesModule, CollectionsModule,
    HistoryModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  controllers: [BlogsController, WorksController, PortfolioController, CollectionsController, HistoryController]
})
export class ContentModule {}
