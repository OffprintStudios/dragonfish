import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { WorksSchema } from './works.schema';
import { SectionsSchema } from './sections.schema';
import { WorksService } from './works.service';
import { HistoryModule } from '../history/history.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Work', schema: WorksSchema},
      {name: 'Section', schema: SectionsSchema},
    ]),
    UsersModule, HistoryModule, NotificationsModule
  ],
  providers: [WorksService],
  exports: [WorksService]
})
export class WorksModule {}
