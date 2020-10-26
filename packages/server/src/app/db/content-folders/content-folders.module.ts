import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HookNextFunction, Types } from 'mongoose';

import { ContentModule } from '../content';
import { ContentFolderDocument, ContentFolderSchema } from './content-folders.schema';
import { ContentFoldersService } from './content-folders.service';

@Module({
  imports: [
    ContentModule,
    MongooseModule.forFeatureAsync([
      {
        name: 'ContentFolder',
        useFactory: () => {
          const schema = ContentFolderSchema;
          schema.index({name: 'text'});
          schema.plugin(require('mongoose-autopopulate'));
          schema.plugin(require('mongoose-paginate-v2'));
          schema.pre<ContentFolderDocument>('save', async function (next: HookNextFunction) {
            this.set('_id', new Types.ObjectId());
            this.set('createdAt', new Date());
            this.set('updatedAt', new Date());
            return next();
          });
          return schema;
        }
      }
    ])
  ],
  providers: [ContentFoldersService],
  exports: [ContentFoldersService]
})
export class ContentFoldersModule {}
