import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { BlogsController } from './blogs/blogs.controller';
import { WorksController } from './works/works.controller';
import { BlogsModule } from 'src/db/blogs/blogs.module';
import { WorksModule } from 'src/db/works/works.module';
import { PortfolioController } from './portfolio/portfolio.controller';
import { UsersModule } from 'src/db/users/users.module';

@Module({
  imports: [
    BlogsModule, WorksModule, UsersModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '3600s'},
      }),
    }),
  ],
  controllers: [BlogsController, WorksController, PortfolioController]
})
export class ContentModule {}
