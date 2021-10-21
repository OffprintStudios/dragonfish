import { Injectable } from '@nestjs/common';
import { BookshelfStore, ContentLibraryStore } from '@dragonfish/api/database/content-library/stores';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';
import { SubscriptionEvent, SubscriptionKind } from '@dragonfish/shared/models/accounts/notifications';
import { BookshelfForm } from '@dragonfish/shared/models/users/content-library';

@Injectable()
export class LibraryService {
    constructor(
        private readonly libraryStore: ContentLibraryStore,
        private readonly shelfStore: BookshelfStore,
        private readonly events: EventEmitter2,
    ) {}

    //#region ---LIBRARY---

    public async fetchLibrary(pseudId: string) {
        return await this.libraryStore.fetchLibrary(pseudId);
    }

    public async addToLibrary(pseudId: string, contentId: string) {
        return await this.libraryStore.addToLibrary(pseudId, contentId).then((item) => {
            const subPayload: SubscriptionPayload = {
                itemId: contentId,
                subscriberId: pseudId,
                kind: SubscriptionKind.ContentLibrary,
            };
            this.events.emit(SubscriptionEvent.ContentLibrary, subPayload);
            return item;
        });
    }

    public async removeFromLibrary(pseudId: string, contentId: string) {
        await this.libraryStore.removeFromLibrary(pseudId, contentId).then(() => {
            const payload = {
                userId: pseudId,
                itemId: contentId,
            };
            this.events.emit('subscription.delete', payload);
        });
    }

    //#endregion

    //#region ---BOOKSHELVES---

    public async fetchShelves(pseudId: string) {
        return await this.shelfStore.fetchShelves(pseudId);
    }

    public async fetchPublicShelves(pseudId: string) {
        return await this.shelfStore.fetchPublicShelves(pseudId);
    }

    public async fetchOneShelf(pseudId: string, shelfId: string) {
        return await this.shelfStore.fetchOneShelf(pseudId, shelfId);
    }

    public async createShelf(pseudId: string, formInfo: BookshelfForm) {
        return await this.shelfStore.createBookshelf(pseudId, formInfo);
    }

    public async editShelf(pseudId: string, shelfId: string, formInfo: BookshelfForm) {
        return await this.shelfStore.editBookshelf(pseudId, shelfId, formInfo);
    }

    public async toggleVisibility(pseudId: string, shelfId: string) {
        return await this.shelfStore.toggleVisibility(pseudId, shelfId);
    }

    public async deleteShelf(pseudId: string, shelfId: string) {
        return await this.shelfStore.deleteShelf(pseudId, shelfId);
    }

    public async changeCover(pseudId: string, shelfId: string, url: string) {
        return await this.shelfStore.changeCoverPic(pseudId, shelfId, url);
    }

    //#endregion

    //#region ---SHELF ITEMS---

    public async fetchItems(pseudId: string, shelfId: string) {
        return await this.shelfStore.fetchItems(pseudId, shelfId);
    }

    public async addItem(pseudId: string, shelfId: string, contentId: string) {
        return await this.shelfStore.addItem(pseudId, shelfId, contentId);
    }

    public async removeItem(pseudId: string, shelfId: string, contentId: string) {
        return await this.shelfStore.removeItem(pseudId, shelfId, contentId);
    }

    //#endregion
}
