import { Module } from '@nestjs/common';

import { ContentService } from './content.service';
import { BlogsModule } from 'src/db/blogs/blogs.module';
import { BlogsController } from './blogs/blogs.controller';
import { WorksController } from './works/works.controller';

@Module({
  imports: [
    BlogsModule,
  ],
  providers: [ContentService],
  controllers: [BlogsController, WorksController]
})
export class ContentModule {}
