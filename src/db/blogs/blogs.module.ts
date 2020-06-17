import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogsSchema } from './blogs.schema';
import { BlogsService } from './blogs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Blog', schema: BlogsSchema}]),
  ],
  providers: [BlogsService],
  exports: [BlogsService]
})
export class BlogsModule {}
