import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/blogs.controller';
import { WorksController } from './works/works.controller';
import { BlogsModule } from 'src/mongo/blogs/blogs.module';

@Module({
  imports: [
    BlogsModule
  ],
  controllers: [BlogsController, WorksController]
})
export class ContentModule {}
