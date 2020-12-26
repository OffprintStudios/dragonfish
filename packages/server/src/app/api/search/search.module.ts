import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from '../../db/users/users.module';

@Module({
  imports: [
    UsersModule,
  ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
