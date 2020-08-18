import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HistorySchema, HistoryItemSchema } from './history.schema';
import { HistoryService } from './history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'History', schema: HistorySchema},
      {name: 'HistoryItem', schema: HistoryItemSchema},
    ]),
  ],
  providers: [HistoryService],
  exports: [HistoryService]
})
export class HistoryModule {}
