import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { getJwtSecretKey, JWT_EXPIRATION } from '$shared/util';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import * as Services from './services';
import * as Controllers from './controllers';
import { UtilitiesModule } from '$modules/utilities';

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
                name: 'InviteCodes',
                useFactory: Schemas.setupInviteCodesCollection,
            },
        ]),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    exports: [Services.AuthService, Services.UserService, Stores.PseudonymsStore],
    controllers: [
        Controllers.AuthController,
        Controllers.UserController,
        Controllers.AccountController,
    ],
    providers: [
        Stores.AccountsStore,
        Stores.PseudonymsStore,
        Services.AuthService,
        Services.UserService,
        Services.AccountService,
    ],
})
export class AccountsModule {}
