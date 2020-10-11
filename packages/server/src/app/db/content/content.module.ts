import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Schema, HookNextFunction } from 'mongoose';
import { generate } from 'shortid';

import { ContentService } from './content.service';
import { NewsService } from './news/news.service';
import { WorksService } from './works/works.service';
import { BlogsService } from './blogs/blogs.service';
import { ContentDocument, ContentSchema } from './content.schema';
import { NewsCategory } from '@pulp-fiction/models/content';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Content',
        useFactory: () => {
          const schema = ContentSchema;
          schema.index({title: 'text'});
          schema.plugin(require('mongoose-autopopulate'));
          schema.plugin(require('mongoose-paginate-v2'));
          schema.pre<ContentDocument>('save', async function (next: HookNextFunction) {
            this.set('_id', generate());
            this.set('createdAt', new Date());
            this.set('updatedAt', new Date());
            return next();
          });
          return schema;
        }
      }
    ])
  ],
  providers: [
    ContentService, NewsService, WorksService, BlogsService,
    {
      provide: getModelToken('NewsContent'),
      useFactory: contentModel => contentModel.discriminator('NewsContent', new Schema({
        meta: {
          category: {type: String, enum: Object.keys(NewsCategory), required: true, index: true},
          coverPic: {type: String, trim: true, default: null},
        },
        audit: {
          featured: {type: Boolean, default: false},
          published: {type: Boolean, default: false},
          publishedOn: {type: Date, default: null},
          isDeleted: {type: Boolean, default: false}
        }
      })),
      inject: [getModelToken('Content')]
    }
  ],
  exports: [ContentService, NewsService, WorksService, BlogsService]
})
export class ContentModule {}
