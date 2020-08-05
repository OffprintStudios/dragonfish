import { Module } from '@nestjs/common';
import { ContribService } from './contrib.service';
import { WorksModule } from '../works/works.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    WorksModule,
  ],
  providers: [ContribService]
})
export class ContribModule {}
