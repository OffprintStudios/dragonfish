import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
    controllers: [],
    providers: [],
    imports: [
        BullModule.registerQueue({
            name: 'notifications',
        }),
    ],
    exports: [],
})
export class NotificationsModule {}
