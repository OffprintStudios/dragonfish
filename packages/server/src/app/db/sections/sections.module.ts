import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HookNextFunction } from 'mongoose';
import { generate } from 'shortid';

import { sanitizeHtml, stripAllHtml } from '@pulp-fiction/html_sanitizer';
import { SectionsDocument, SectionsSchema } from './sections.schema';
import { SectionsService } from './sections.service';
import { countPlaintextWords, countQuillWords } from '@pulp-fiction/word_counter';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Section',
        useFactory: () => {
          const schema = SectionsSchema;
          schema.pre<SectionsDocument>('save', async function (next: HookNextFunction) {
            this.set('_id', generate());
            this.set('title', await sanitizeHtml(this.title));
            this.set('body', await sanitizeHtml(this.body));
            if (this.authorsNote) {
              this.set('authorsNote', await sanitizeHtml(this.authorsNote));
            }
            if (this.authorsNotePos) {
              this.set('authorsNotePos', this.authorsNotePos);
            }
            this.set('published', this.published);

            const wordCount = this.usesNewEditor
              ? await countPlaintextWords(await stripAllHtml(this.body))
              : await countQuillWords(await sanitizeHtml(this.body));
            this.set('stats.words', wordCount);

            return next();
          });
          return schema;
        }
      }
    ])
  ],
  providers: [SectionsService],
  exports: [SectionsService]
})
export class SectionsModule {}
