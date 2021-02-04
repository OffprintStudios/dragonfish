import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HookNextFunction } from 'mongoose';
import { generate } from 'shortid';

import { ApprovalQueueDocument, ApprovalQueueSchema } from './approval-queue.schema';
import { ApprovalQueueService } from './approval-queue.service';
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
                    schema.pre<ApprovalQueueDocument>('save', async function (next: HookNextFunction) {
                        this.set('_id', generate());
                        return next();
                    });
                    return schema;
                },
            },
        ]),
        WorksModule,
    ],
    providers: [ApprovalQueueService],
    exports: [ApprovalQueueService],
})
export class ApprovalQueueModule {}
