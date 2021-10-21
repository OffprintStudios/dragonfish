import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookshelfDocument, ShelfItemDocument } from '../schemas';
import { BookshelfForm } from '@dragonfish/shared/models/users/content-library';
import { isNullOrUndefined } from '@dragonfish/shared/functions';

@Injectable()
export class BookshelfStore {
    constructor(
        @InjectModel('Bookshelf') private readonly bookshelf: Model<BookshelfDocument>,
        @InjectModel('BookshelfItem') private readonly shelfItem: Model<ShelfItemDocument>,
    ) {}

    //#region ---BOOKSHELF OPERATIONS---

    /**
     * Creates a new bookshelf.
     * @param userId
     * @param formData
     */
    public async createBookshelf(userId: string, formData: BookshelfForm): Promise<BookshelfDocument> {
        const newShelf = new this.bookshelf({ userId: userId, name: formData.name, desc: formData.desc });
        return newShelf.save();
    }

    /**
     * Edits an existing bookshelf.
     * @param userId
     * @param shelfId
     * @param formData
     */
    public async editBookshelf(userId: string, shelfId: string, formData: BookshelfForm): Promise<BookshelfDocument> {
        const shelf = await this.bookshelf.findOne({ _id: shelfId, userId: userId });
        shelf.name = formData.name;
        shelf.desc = formData.desc;
        return shelf.save();
    }

    /**
     * Change a shelf's cover pic.
     * @param userId
     * @param shelfId
     * @param coverPic
     */
    public async changeCoverPic(userId: string, shelfId: string, coverPic: string): Promise<BookshelfDocument> {
        const shelf = await this.bookshelf.findOne({ _id: shelfId, userId: userId });
        shelf.coverPic = coverPic;
        return shelf.save();
    }

    /**
     * Toggles public/private visibility for shelf.
     * @param userId
     * @param shelfId
     */
    public async toggleVisibility(userId: string, shelfId: string): Promise<BookshelfDocument> {
        const shelf = await this.bookshelf.findOne({ _id: shelfId, userId: userId });
        shelf.public = !shelf.public;
        return shelf.save();
    }

    /**
     * Deletes a shelf and all associated shelf items.
     * @param userId
     * @param shelfId
     */
    public async deleteShelf(userId: string, shelfId: string): Promise<void> {
        if (await this.shelfExists(userId, shelfId)) {
            await this.bookshelf.deleteOne({ _id: shelfId, userId: userId });
            await this.removeAllItems(shelfId);
        } else {
            throw new NotFoundException(`The shelf you're trying to add to doesn't exist.`);
        }
    }

    /**
     * Fetches all public and private shelves.
     * @param userId
     */
    public async fetchShelves(userId: string) {
        return this.bookshelf.find({ userId: userId });
    }

    /**
     * Fetches all public shelves only.
     * @param userId
     */
    public async fetchPublicShelves(userId: string) {
        return this.bookshelf.find({ userId: userId, public: true });
    }

    /**
     * Fetches one shelf.
     * @param userId
     * @param shelfId
     */
    public async fetchOneShelf(userId: string, shelfId: string) {
        return this.bookshelf.find({ _id: shelfId, userId: userId });
    }

    /**
     * Fetches one public shelf.
     * @param userId
     * @param shelfId
     */
    public async fetchOnePublicShelf(userId: string, shelfId: string) {
        return this.bookshelf.find({ _id: shelfId, userId: userId, public: true });
    }

    //#endregion

    //#region ---SHELF ITEM OPERATIONS---

    /**
     * Adds an item to a bookshelf.
     * @param userId
     * @param shelfId
     * @param contentId
     */
    public async addItem(userId: string, shelfId: string, contentId: string): Promise<ShelfItemDocument> {
        if (await this.shelfExists(userId, shelfId)) {
            const newItem = new this.shelfItem({ shelfId: shelfId, content: contentId });
            return newItem.save();
        } else {
            throw new NotFoundException(`The shelf you're trying to modify doesn't exist.`);
        }
    }

    /**
     * Removes an item from a bookshelf.
     * @param userId
     * @param shelfId
     * @param contentId
     */
    public async removeItem(userId: string, shelfId: string, contentId: string): Promise<void> {
        if (await this.shelfExists(userId, shelfId)) {
            await this.shelfItem.remove({ shelfId: shelfId, content: contentId });
        } else {
            throw new NotFoundException(`The shelf you're trying to modify doesn't exist.`);
        }
    }

    /**
     * Fetches all items related to a bookshelf.
     * @param userId
     * @param shelfId
     */
    public async fetchItems(userId: string, shelfId: string) {
        if (await this.shelfExists(userId, shelfId)) {
            return this.shelfItem.find({ shelfId: shelfId });
        } else {
            throw new NotFoundException(`The shelf you're trying to fetch does not exist.`);
        }
    }

    //#endregion

    //#region ---PRIVATE---

    /**
     * Checks to see if a bookshelf exists.
     * @param userId
     * @param shelfId
     * @private
     */
    private async shelfExists(userId: string, shelfId: string): Promise<boolean> {
        const shelf = await this.bookshelf.findOne({ _id: shelfId, userId: userId });

        return !isNullOrUndefined(shelf);
    }

    /**
     * Removes all items from a bookshelf.
     * @param shelfId
     * @private
     */
    private async removeAllItems(shelfId: string) {
        await this.shelfItem.deleteMany({ shelfId: shelfId });
    }

    //#endregion
}
