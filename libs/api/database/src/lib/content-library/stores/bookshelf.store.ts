import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookshelfDocument, ShelfItemDocument } from '../schemas';

@Injectable()
export class BookshelfStore {
    constructor(
        @InjectModel('Bookshelf') private readonly bookshelf: Model<BookshelfDocument>,
        @InjectModel('BookshelfItem') private readonly shelfItem: Model<ShelfItemDocument>,
    ) {}
}
