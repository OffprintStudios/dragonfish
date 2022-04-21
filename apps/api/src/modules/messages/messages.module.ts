import { Module } from '@nestjs/common';
import * as Controllers from './controllers';
import * as Services from './services';

@Module({
    imports: [],
    exports: [],
    providers: [Services.MessagesService],
    controllers: [Controllers.MessagesController],
})
export class MessagesModule {}
