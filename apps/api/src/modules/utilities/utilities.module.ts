import { Module } from '@nestjs/common';
import * as Services from './services';

@Module({
    imports: [],
    exports: [Services.ImagesService],
    providers: [Services.ImagesService],
})
export class UtilitiesModule {}
