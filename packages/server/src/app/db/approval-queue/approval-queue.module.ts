import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApprovalQueueSchema } from './approval-queue.schema';
import { ApprovalQueueStore } from './approval-queue.store';
import { WorksModule } from '../works/works.module';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'ApprovalQueue',
                useFactory: () => {
                    const schema = ApprovalQueueSchema;
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    return schema;
                },
            },
        ]),
        WorksModule,
    ],
    providers: [ApprovalQueueStore],
    exports: [ApprovalQueueStore],
})
export class ApprovalQueueModule {}
