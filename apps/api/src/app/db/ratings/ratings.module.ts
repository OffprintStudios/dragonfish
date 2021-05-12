import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsSchema } from './ratings.schema';
import { RatingsStore } from './ratings.store';

@Module({
    imports: [
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
