import { Injectable, Logger } from '@nestjs/common';
import { ContentStore } from '@dragonfish/api/database/content/stores';
import { Section, SectionForm, PublishSection } from '@dragonfish/shared/models/sections';

@Injectable()
export class SectionsService {
    private readonly logger: Logger = new Logger(SectionsService.name);

    constructor(private readonly content: ContentStore) {}

    async fetchOneById(sectionId: string, published?: boolean): Promise<Section> {
        return await this.content.fetchSectionById(sectionId, published);
    }

    async fetchUserContentSections(user: string, contentId: string): Promise<Section[]> {
        return await this.content.fetchUserContentSections(user, contentId);
    }

    async create(user: string, contentId: string, sectionInfo: SectionForm): Promise<Section> {
        return await this.content.createSection(user, contentId, sectionInfo);
    }

    async save(user: string, contentId: string, sectionId: string, sectionInfo: SectionForm): Promise<Section> {
        return await this.content.editSection(user, contentId, sectionId, sectionInfo);
    }

    async publish(user: string, contentId: string, sectionId: string, pubStatus: PublishSection): Promise<Section> {
        return await this.content.publishSection(user, contentId, sectionId, pubStatus);
    }

    async delete(user: string, contentId: string, sectionId: string): Promise<void> {
        return await this.content.deleteSection(user, contentId, sectionId);
    }
}
