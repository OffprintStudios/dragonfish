import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument } from '../schemas';

@Injectable()
export class AccountsStore {
    constructor(@InjectModel('Account') private readonly accountModel: Model<AccountDocument>) {}
}
