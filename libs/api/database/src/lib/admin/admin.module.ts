import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './schemas';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'CaseFiles',
                useFactory: Schemas.setupCaseFileCollection,
                discriminators: [
                    { name: 'ContentCaseFiles', schema: Schemas.ContentCaseFileSchema },
                    { name: 'CommentCaseFiles', schema: Schemas.CommentCaseFileSchema },
                    { name: 'UserCaseFiles', schema: Schemas.UserCaseFileSchema },
                ],
            },
        ]),
    ],
    providers: [],
    exports: [],
})
export class AdminModule {}
