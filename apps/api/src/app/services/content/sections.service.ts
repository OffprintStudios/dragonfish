import { Injectable, Logger } from '@nestjs/common';
import { ContentStore, SectionsStore } from '@dragonfish/api/database/content/stores';
import { PublishSection, Section, SectionForm } from '@dragonfish/shared/models/sections';
import { PseudonymsStore } from '@dragonfish/api/database/accounts/stores';
import { ContentKind, ContentModel, PubStatus } from '@dragonfish/shared/models/content';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { ContentUpdatedPayload } from '@dragonfish/shared/models/accounts/notifications/payloads';

@Injectable()
export class SectionsService {
    private readonly logger: Logger = new Logger(SectionsService.name);

    constructor(
        private readonly content: ContentStore,
        private readonly sections: SectionsStore,
        private readonly pseudonyms: PseudonymsStore,
        private readonly events: EventEmitter2,
    ) {}

    async fetchOneById(sectionId: string, published?: boolean): Promise<Section> {
        return await this.content.fetchSectionById(sectionId, published);
    }

    async fetchUserContentSections(user: string, contentId: string): Promise<Section[]> {
        return await this.content.fetchUserContentSections(user, contentId);
    }

    async create(user: string, contentId: string, sectionInfo: SectionForm): Promise<Section> {
        await this.updateCounts(user);
        return await this.content.createSection(user, contentId, sectionInfo);
    }

    async save(user: string, contentId: string, sectionId: string, sectionInfo: SectionForm): Promise<Section> {
        await this.updateCounts(user);
        return await this.content.editSection(user, contentId, sectionId, sectionInfo);
    }

    async publish(user: string, contentId: string, sectionId: string, pubStatus: PublishSection): Promise<Section> {
        await this.updateCounts(user);
        const content: ContentModel = await this.content.fetchOne(contentId);
        const section: Section = await this.content.publishSection(user, contentId, sectionId, pubStatus);
        if (content.audit.published === PubStatus.Published) {
            if (pubStatus.newPub === true && section.audit.publishedOn === null) {
                await this.sections.updatePublishedOnDate(section._id, new Date());
                const payload: ContentUpdatedPayload = {
                    contentId: content._id,
                };
                this.events.emit(NotificationKind.ContentUpdate, payload);
            }
        }
        return section;
    }

    async delete(user: string, contentId: string, sectionId: string): Promise<void> {
        await this.updateCounts(user);
        return await this.content.deleteSection(user, contentId, sectionId);
    }

    /**
     * Updates user's counts of both blogs and works
     * @param user
     */
    private async updateCounts(user: string) {
        await this.pseudonyms.updateBlogCount(user, await this.content.countContent(user, [ContentKind.BlogContent]));
        await this.pseudonyms.updateWorkCount(
            user,
            await this.content.countContent(user, [ContentKind.ProseContent, ContentKind.PoetryContent]),
        );
    }
}
