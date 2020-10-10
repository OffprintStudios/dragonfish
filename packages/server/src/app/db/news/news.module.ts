import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HookNextFunction } from 'mongoose';
import { generate } from 'shortid';

import { NewsDocument, NewsSchema } from './news.schema';
import { NewsService } from './news.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Newspost',
        useFactory: () => {
          const schema = NewsSchema;
          schema.plugin(require('mongoose-autopopulate'));
          schema.plugin(require('mongoose-paginate-v2'));
          schema.pre<NewsDocument>('save', async function (next: HookNextFunction) {
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
  providers: [NewsService],
  exports: [NewsService]
})
export class NewsModule {}
