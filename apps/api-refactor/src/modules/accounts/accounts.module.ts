import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilitiesModule } from '$modules/utilities';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import * as Services from './services';
import * as Controllers from './controllers';

@Module({
  imports: [
    UtilitiesModule,
    MongooseModule.forFeatureAsync([
      {
        name: 'Account',
        useFactory: Schemas.setupAccountCollection,
      },
      {
        name: 'Pseudonym',
        useFactory: Schemas.setupPseudonymCollection,
      },
      {
        name: 'Session',
        useFactory: Schemas.setupSessionCollection,
      },
      {
        name: 'Recovery',
        useFactory: Schemas.setupRecoveryCollection,
      },
      {
        name: 'InviteCodes',
        useFactory: Schemas.setupInviteCodesCollection,
      },
    ]),
  ],
  providers: [
    Stores.AccountsStore,
    Stores.PseudonymsStore,
    Stores.SessionsStore,
    Services.AuthService,
    Controllers.AccountGateway,
  ],
  controllers: [Controllers.AuthController],
})
export class AccountsModule {}
