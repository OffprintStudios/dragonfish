import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { HookNextFunction } from 'mongoose';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { TagsDocument, TagsSchema } from './tags.schema';
import { TagsStore } from './tags.store';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Tag',
                useFactory: () => {
                    const schema = TagsSchema;
                    schema.index({ name: 'text' });
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    schema.pre<TagsDocument>('save', async function (next: HookNextFunction) {
                        this.set('name', sanitizeHtml(this.name, sanitizeOptions));
                        this.set('desc', sanitizeHtml(this.desc, sanitizeOptions));

                        return next();
                    });
                    return schema;
                },
            },
        ]),
    ],
    providers: [TagsStore],
    exports: [TagsStore],
})
export class TagsModule {}
