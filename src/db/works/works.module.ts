import { Module } from '@nestjs/common';
import { WorksService } from './works.service';

@Module({
  providers: [WorksService]
})
export class WorksModule {}
