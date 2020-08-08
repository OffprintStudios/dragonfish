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

@Module({
  imports: [
    BlogsModule, WorksModule, UsersModule, ImagesModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecretKey(),
        signOptions: {expiresIn: JWT_EXPIRATION},
      }),
    }),
  ],
  controllers: [BlogsController, WorksController, PortfolioController]
})
export class ContentModule {}
