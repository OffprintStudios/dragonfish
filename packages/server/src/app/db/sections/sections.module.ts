import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';

@Module({
  providers: [SectionsService]
})
export class SectionsModule {}
