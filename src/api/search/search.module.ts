import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from 'src/db/users/users.module';
import { WorksModule } from 'src/db/works/works.module';
import { BlogsModule } from 'src/db/blogs/blogs.module';

@Module({
  imports: [
    UsersModule, WorksModule, BlogsModule
  ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
