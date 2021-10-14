import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument } from '../schemas';

@Injectable()
export class NotificationStore {
    constructor(@InjectModel('Notification') private readonly notifications: Model<NotificationDocument>) {}
}
