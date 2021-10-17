import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionDocument } from '../schemas';

@Injectable()
export class SubscriptionsStore {
    constructor(@InjectModel('Subscription') private readonly subscription: Model<SubscriptionDocument>) {}
}
