import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@dragonfish/api/database/users';
import { WorksSchema } from './works.schema';
import { WorksService } from './works.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Work', schema: WorksSchema }]), UsersModule],
    providers: [WorksService],
    exports: [WorksService],
})
export class WorksModule {}
