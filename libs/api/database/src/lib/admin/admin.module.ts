import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './schemas';
import * as Stores from './stores';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'CaseFiles',
                inject: [getConnectionToken()],
                useFactory: Schemas.setupCaseFileCollection,
                discriminators: [
                    { name: 'ContentCaseFiles', schema: Schemas.ContentCaseFileSchema },
                    { name: 'CommentCaseFiles', schema: Schemas.CommentCaseFileSchema },
                    { name: 'UserCaseFiles', schema: Schemas.UserCaseFileSchema },
                ],
            },
        ]),
    ],
    providers: [Stores.CaseFilesStore],
    exports: [Stores.CaseFilesStore],
})
export class AdminModule {}
