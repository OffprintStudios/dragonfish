import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { BookshelfStore, ContentLibraryStore } from '../db/stores';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AddedToLibraryPayload, SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';
import {
    NotificationKind,
    SubscriptionEvent,
    SubscriptionKind,
} from '@dragonfish/shared/models/accounts/notifications';
import { BookshelfForm, ContentRemovalJob } from '@dragonfish/shared/models/users/content-library';
import { Queue } from 'bull';

@Injectable()
export class LibraryService {
    private logger = new Logger('LibraryService');

    constructor(
        @InjectQueue('content-library') private readonly libraryQueue: Queue,
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

            const notificationPayload: AddedToLibraryPayload = {
                contentId: contentId,
                addedById: pseudId,
            };
            this.events.emit(NotificationKind.AddedToLibrary, notificationPayload);

            return item;
        });
    }

    public async removeFromLibrary(pseudId: string, contentId: string) {
        const eventPayload = {
            userId: pseudId,
            itemId: contentId,
        };

        const jobPayload: ContentRemovalJob = {
            pseudId: pseudId,
            contentId: contentId,
        };

        this.logger.log(`Adding job to queue...`);
        await this.libraryQueue.add('remove-content', jobPayload);
        this.events.emit('subscription.delete', eventPayload);
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

    public async checkItem(pseudId: string, shelfId: string, contentId: string) {
        return await this.shelfStore.checkItem(pseudId, shelfId, contentId);
    }

    //#endregion
}
