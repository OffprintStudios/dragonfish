import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsSchema } from './ratings.schema';
import { RatingsStore } from './ratings.store';
import { ContentModule } from '../content';

@Module({
    imports: [
        ContentModule,
        MongooseModule.forFeature([
            {
                name: 'Ratings',
                schema: RatingsSchema,
            },
        ]),
    ],
    providers: [RatingsStore],
    exports: [RatingsStore],
})
export class RatingsModule {}
