import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from '../../db/users/users.module';
import { ContentModule } from '../../db/content';

@Module({
  imports: [
    UsersModule,
    ContentModule,
  ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
