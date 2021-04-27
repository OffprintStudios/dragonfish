import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { HookNextFunction } from 'mongoose';

import { CollectionDocument, CollectionSchema } from './collection.schema';
import { CollectionsStore } from './collections.store';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Collection',
                useFactory: () => {
                    const schema = CollectionSchema;
                    schema.index({ name: 'text' });
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    schema.pre<CollectionDocument>('save', async function (next: HookNextFunction) {
                        this.set('name', sanitizeHtml(this.name));
                        this.set('desc', sanitizeHtml(this.desc));

                        return next();
                    });
                    return schema;
                },
            },
        ]),
    ],
    providers: [CollectionsStore],
    exports: [CollectionsStore],
})
export class CollectionsModule {}
