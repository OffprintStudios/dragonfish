import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
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
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    schema.plugin(require('mongoose-autopopulate'));
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    schema.plugin(require('mongoose-paginate-v2'));
                    schema.pre<CollectionDocument>('save', async function (next) {
                        this.set('name', sanitizeHtml(this.name, sanitizeOptions));
                        this.set('desc', sanitizeHtml(this.desc, sanitizeOptions));

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
