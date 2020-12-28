import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HookNextFunction } from 'mongoose';
import { generate } from 'shortid';

import { ReadingHistoryDocument, ReadingHistorySchema } from './reading-history.schema';
import { ReadingHistoryService } from './reading-history.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'ReadingHistory',
                useFactory: () => {
                    const schema = ReadingHistorySchema;
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    schema.pre<ReadingHistoryDocument>('save', async function (next: HookNextFunction) {
                        this.set('_id', generate());
                        return next();
                    });
                    return schema;
                }
            }
        ])
    ],
    exports: [ReadingHistoryService],
    providers: [ReadingHistoryService]
})
export class ReadingHistoryModule {}