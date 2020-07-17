import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { BlogsController } from './blogs/blogs.controller';
import { WorksController } from './works/works.controller';
import { BlogsModule } from 'src/db/blogs/blogs.module';
import { WorksModule } from 'src/db/works/works.module';

@Module({
  imports: [
    BlogsModule, WorksModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '3600s'},
      }),
    }),
  ],
  controllers: [BlogsController, WorksController]
})
export class ContentModule {}
