import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/db/users/users.module';
import { WorksSchema } from './works.schema';
import { SectionsSchema } from './sections.schema';
import { WorksService } from './works.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Work', schema: WorksSchema},
      {name: 'Section', schema: SectionsSchema},
    ]),
    UsersModule
  ],
  providers: [WorksService],
  exports: [WorksService]
})
export class WorksModule {}
