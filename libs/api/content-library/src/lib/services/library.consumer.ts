import { Logger } from '@nestjs/common';
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { ContentRemovalJob } from '@dragonfish/shared/models/users/content-library';
import { BookshelfStore, ContentLibraryStore } from '../db/stores';
import { ShelfItemDocument } from '../db/schemas';
import { ContentModel } from '@dragonfish/shared/models/content';

@Processor('content-library')
export class LibraryConsumer {
    private logger = new Logger('LibraryQueue');

    constructor(private readonly libraryStore: ContentLibraryStore, private readonly shelfStore: BookshelfStore) {}

    //#region ---LIFECYCLE HOOKS---

    @OnQueueActive()
    onQueueActive(job: Job) {
        this.logger.log(`Processing job ${job.id}...`);
    }

    @OnQueueCompleted()
    onQueueCompleted(job: Job) {
        this.logger.log(`Job ${job.id} completed!`);
    }

    @OnQueueFailed()
    onQueueFailed(job: Job, err: Error) {
        this.logger.error(`Job ${job.id} has failed to process! Error: ${err.message}`);
    }

    @OnQueueError()
    onQueueError(error: Error) {
        this.logger.error(`Queue has experienced an error! Message: ${error.message}`);
    }

    //#endregion

    @Process('remove-content')
    async removeContent(job: Job<ContentRemovalJob>, done: DoneCallback) {
        await this.libraryStore.removeFromLibrary(job.data.pseudId, job.data.contentId);
        const shelves = await this.shelfStore.fetchShelves(job.data.pseudId);
        for (const shelf of shelves) {
            const items = await this.shelfStore.fetchItems(job.data.pseudId, shelf._id);
            const isItem: ShelfItemDocument[] = items.filter((x) => {
                return (x.content as ContentModel)._id === job.data.contentId;
            });
            if (isItem.length === 1) {
                await this.shelfStore.removeItem(job.data.pseudId, shelf._id, job.data.contentId);
            }
        }
        done();
    }
}
