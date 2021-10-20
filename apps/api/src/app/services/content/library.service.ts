import { Injectable } from '@nestjs/common';
import { ContentLibraryStore } from '@dragonfish/api/database/content-library/stores';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscriptionPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';
import { SubscriptionEvent, SubscriptionKind } from '@dragonfish/shared/models/accounts/notifications';

@Injectable()
export class LibraryService {
    constructor(private readonly libraryStore: ContentLibraryStore, private readonly events: EventEmitter2) {}

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
}
