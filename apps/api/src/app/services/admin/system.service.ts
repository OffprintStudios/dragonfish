import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';

@Injectable()
export class SystemService implements OnApplicationBootstrap {
    private logger = new Logger('System');

    async onApplicationBootstrap(): Promise<void> {
        this.logger.log(`Initializing application bootstrapping...`);
        this.logger.log(`Bootstrapping complete!`);
    }
}
