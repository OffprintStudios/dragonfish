import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PseudonymDocument } from '../schemas';

@Injectable()
export class PseudonymsStore {
    constructor(@InjectModel('Pseudonym') private readonly pseudModel: Model<PseudonymDocument>) {}
}
