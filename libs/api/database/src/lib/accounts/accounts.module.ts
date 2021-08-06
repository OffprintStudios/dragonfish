import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './schemas';
import * as Stores from './stores';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Account',
                useFactory: Schemas.setupAccountCollection,
            },
            {
                name: 'Pseudonym',
                useFactory: Schemas.setupPseudonymCollection,
            },
        ]),
    ],
    exports: [Stores.AccountsStore, Stores.PseudonymsStore],
    providers: [Stores.AccountsStore, Stores.PseudonymsStore],
})
export class AccountsModule {}
