import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookshelfDocument, ShelfItemDocument } from '../schemas';
import { JwtPayload } from '@dragonfish/shared/models/auth';
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
     * @param user
     * @param formData
     */
    public async createBookshelf(user: JwtPayload, formData: BookshelfForm): Promise<BookshelfDocument> {
        const newShelf = new this.bookshelf({ userId: user.sub, name: formData.name, desc: formData.desc });
        return newShelf.save();
    }

    /**
     * Edits an existing bookshelf.
     * @param user
     * @param shelfId
     * @param formData
     */
    public async editBookshelf(user: JwtPayload, shelfId: string, formData: BookshelfForm): Promise<BookshelfDocument> {
        const shelf = await this.bookshelf.findOne({ _id: shelfId, userId: user.sub });
        shelf.name = formData.name;
        shelf.desc = formData.desc;
        return shelf.save();
    }

    /**
     * Change a shelf's cover pic.
     * @param user
     * @param shelfId
     * @param coverPic
     */
    public async changeCoverPic(user: JwtPayload, shelfId: string, coverPic: string): Promise<BookshelfDocument> {
        const shelf = await this.bookshelf.findOne({ _id: shelfId, userId: user.sub });
        shelf.coverPic = coverPic;
        return shelf.save();
    }

    /**
     * Toggles public/private visibility for shelf.
     * @param user
     * @param shelfId
     */
    public async toggleVisibility(user: JwtPayload, shelfId: string): Promise<BookshelfDocument> {
        const shelf = await this.bookshelf.findOne({ _id: shelfId, userId: user.sub });
        shelf.public = !shelf.public;
        return shelf.save();
    }

    /**
     * Deletes a shelf and all associated shelf items.
     * @param user
     * @param shelfId
     */
    public async deleteShelf(user: JwtPayload, shelfId: string): Promise<void> {
        if (await this.shelfExists(user.sub, shelfId)) {
            await this.bookshelf.remove({ _id: shelfId }).then(async () => {
                await this.shelfItem.remove({ shelfId: shelfId });
            });
        } else {
            throw new NotFoundException(`The shelf you're trying to add to doesn't exist.`);
        }
    }

    /**
     * Fetches all public and private shelves.
     * @param user
     */
    public async fetchShelves(user: JwtPayload) {
        return this.bookshelf.find({ userId: user.sub });
    }

    /**
     * Fetches all public shelves only.
     * @param user
     */
    public async fetchPublicShelves(user: JwtPayload) {
        return this.bookshelf.find({ userId: user.sub, public: true });
    }

    //#endregion

    //#region ---SHELF ITEM OPERATIONS---

    /**
     * Adds an item to a bookshelf.
     * @param user
     * @param shelfId
     * @param contentId
     */
    public async addItem(user: JwtPayload, shelfId: string, contentId: string): Promise<ShelfItemDocument> {
        if (await this.shelfExists(user.sub, shelfId)) {
            const newItem = new this.shelfItem({ shelfId: shelfId, content: contentId });
            return newItem.save();
        } else {
            throw new NotFoundException(`The shelf you're trying to modify doesn't exist.`);
        }
    }

    /**
     * Removes an item from a bookshelf.
     * @param user
     * @param shelfId
     * @param contentId
     */
    public async removeItem(user: JwtPayload, shelfId: string, contentId: string): Promise<void> {
        if (await this.shelfExists(user.sub, shelfId)) {
            await this.shelfItem.remove({ shelfId: shelfId, content: contentId });
        } else {
            throw new NotFoundException(`The shelf you're trying to modify doesn't exist.`);
        }
    }

    /**
     * Fetches all items related to a bookshelf.
     * @param user
     * @param shelfId
     */
    public async fetchItems(user: JwtPayload, shelfId: string) {
        if (await this.shelfExists(user.sub, shelfId)) {
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
     * @param user
     * @param shelfId
     * @private
     */
    private async removeAllItems(user: JwtPayload, shelfId: string) {
        if (await this.shelfExists(user.sub, shelfId)) {
            await this.shelfItem.remove({ shelfId: shelfId });
        } else {
            throw new NotFoundException(`The shelf you're trying to add to doesn't exist.`);
        }
    }

    //#endregion
}
