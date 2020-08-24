import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

import { CommentsSchema } from './comments.schema';
import { CommentsService } from './comments.service';

import { BlogsModule } from '../blogs/blogs.module';
import { WorksModule } from '../works/works.module';

@Module({
  imports: [
    BlogsModule, WorksModule,
    MongooseModule.forFeature([
      {name: 'Comment', schema: CommentsSchema},
    ]),
  ],
  providers: [
    CommentsService,
    {
      provide: getModelToken('BlogComment'),
      useFactory: commentModel => commentModel.discriminator('BlogComment', new Schema({
        blogId: {type: String, ref: 'Blog', required: true, index: true}
      })),
      inject: [getModelToken('Comment')]
    },
    {
      provide: getModelToken('WorkComment'),
      useFactory: commentModel => commentModel.discriminator('WorkComment', new Schema({
        workId: {type: String, ref: 'Work', required: true, index: true}
      })),
      inject: [getModelToken('Comment')]
    }
  ],
  exports: [CommentsService]
})
export class CommentsModule {}
