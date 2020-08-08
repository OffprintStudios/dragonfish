import { Module } from '@nestjs/common';
import { BrowseController } from './browse.controller';
import { BrowseService } from './browse.service';
import { WorksModule } from 'src/db/works/works.module';

@Module({
  imports: [
    WorksModule
  ],
  controllers: [BrowseController],
  providers: [BrowseService]
})
export class BrowseModule {}
