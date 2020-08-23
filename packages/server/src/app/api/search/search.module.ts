import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from '../../db/users/users.module';
import { WorksModule } from '../../db/works/works.module';
import { BlogsModule } from '../../db/blogs/blogs.module';

@Module({
  imports: [
    UsersModule, WorksModule, BlogsModule
  ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
