import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { NewsService } from './news/news.service';
import { WorksService } from './works/works.service';
import { BlogsService } from './blogs/blogs.service';

@Module({
  providers: [ContentService, NewsService, WorksService, BlogsService]
})
export class ContentModule {}
