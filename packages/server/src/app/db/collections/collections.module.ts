import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';
import { HookNextFunction } from 'mongoose';
import { generate } from 'shortid';

import { CollectionDocument, CollectionSchema } from './collection.schema';
import { CollectionsService } from './collections.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Collection',
        useFactory: () => {
          const schema = CollectionSchema;
          schema.index({name: 'text'});
          schema.plugin(require('mongoose-autopopulate'));
          schema.plugin(require('mongoose-paginate-v2'));
          schema.pre<CollectionDocument>('save', async function (next: HookNextFunction) {
            if (!this._id) {
              this.set('_id', generate());
            }

            this.set('name', await sanitizeHtml(this.name));
            this.set('desc', await sanitizeHtml(this.name));

            return next();
          });
          return schema;
        }
      }
    ])
  ],
  providers: [CollectionsService],
  exports: [CollectionsService]
})
export class CollectionsModule {}
