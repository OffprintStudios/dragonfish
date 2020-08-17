import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as documents from './models';

@Injectable()
export class HistoryService {
    constructor() {}
}
