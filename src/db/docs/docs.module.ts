import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocsSchema } from './docs.schema';
import { DocsService } from './docs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Doc', schema: DocsSchema},
    ]),
  ],
  providers: [DocsService],
  exports: [DocsService],
})
export class DocsModule {}
