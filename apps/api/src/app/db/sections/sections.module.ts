import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HookNextFunction } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { countWords, stripTags } from 'voca';
import { sanitizeOptions } from '@dragonfish/shared/models/util';
import { SectionsDocument, SectionsSchema } from './sections.schema';
import { SectionsStore } from './sections.store';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Section',
                useFactory: () => {
                    const schema = SectionsSchema;
                    schema.pre<SectionsDocument>('save', async function (next: HookNextFunction) {
                        this.set('title', sanitizeHtml(this.title, sanitizeOptions));
                        this.set('body', sanitizeHtml(this.body, sanitizeOptions));
                        if (this.authorsNote) {
                            this.set('authorsNote', sanitizeHtml(this.authorsNote, sanitizeOptions));
                        }
                        if (this.authorsNotePos) {
                            this.set('authorsNotePos', this.authorsNotePos);
                        }
                        this.set('published', this.published);

                        const wordCount = countWords(stripTags(sanitizeHtml(this.body, sanitizeOptions)));
                        this.set('stats.words', Number(wordCount));

                        return next();
                    });
                    return schema;
                },
            },
        ]),
    ],
    providers: [SectionsStore],
    exports: [SectionsStore],
})
export class SectionsModule {}
