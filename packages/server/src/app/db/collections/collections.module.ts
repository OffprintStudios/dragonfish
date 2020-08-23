import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CollectionsSchema } from './collections.schema';
import { CollectionsService } from './collections.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Collection', schema: CollectionsSchema},
    ]),
  ],
  providers: [CollectionsService],
  exports: [CollectionsService]
})
export class CollectionsModule {}
