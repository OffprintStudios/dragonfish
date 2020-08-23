import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogsSchema } from './blogs.schema';
import { BlogsService } from './blogs.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Blog', schema: BlogsSchema}]),
    UsersModule,
  ],
  providers: [BlogsService],
  exports: [BlogsService]
})
export class BlogsModule {}
