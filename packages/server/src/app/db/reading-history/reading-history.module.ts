import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReadingHistorySchema } from './reading-history.schema';
import { ReadingHistoryStore } from './reading-history.store';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'ReadingHistory',
                useFactory: () => {
                    const schema = ReadingHistorySchema;
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    return schema;
                },
            },
        ]),
    ],
    exports: [ReadingHistoryStore],
    providers: [ReadingHistoryStore],
})
export class ReadingHistoryModule {}
