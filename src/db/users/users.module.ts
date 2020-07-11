import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersSchema } from './users.schema';
import { UsersService } from './users.service';
import { InviteCodesSchema } from './invite-codes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UsersSchema}, {name: 'InviteCodes', schema: InviteCodesSchema}])
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
