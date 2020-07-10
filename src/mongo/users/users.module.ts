import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UsersSchema}])
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
