import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MessagesDocument } from '$modules/messages/db/schemas';
import { Model } from 'mongoose';

@Injectable()
export class MessagesStore {
    constructor(@InjectModel('Message') private readonly messages: Model<MessagesDocument>) {}
}
