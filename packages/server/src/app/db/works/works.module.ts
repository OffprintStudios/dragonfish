import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { WorksSchema } from './works.schema';
import { WorksService } from './works.service';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Work', schema: WorksSchema},
    ]),
    UsersModule, HistoryModule
  ],
  providers: [WorksService],
  exports: [WorksService]
})
export class WorksModule {}
