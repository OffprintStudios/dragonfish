import { Injectable, Logger } from '@nestjs/common';

import { ContentStore } from '../../db/content';
import { SectionsStore } from '../../db/sections/sections.store';
import { ISections } from '../../shared/content';
import { JwtPayload } from '@dragonfish/models/auth';
import { Section, SectionForm, PublishSection } from '@dragonfish/models/sections';

@Injectable()
export class SectionsService implements ISections {
    private readonly logger: Logger = new Logger(SectionsService.name);

    constructor(private readonly sections: SectionsStore, private readonly content: ContentStore) {}

    async fetchOneById(sectionId: string, published?: boolean): Promise<Section> {
        return await this.sections.fetchSectionById(sectionId, published);
    }

    async fetchUserContentSections(user: JwtPayload, contentId: string): Promise<Section[]> {
        return await this.content.fetchUserContentSections(user, contentId);
    }

    async create(user: JwtPayload, contentId: string, sectionInfo: SectionForm): Promise<Section> {
        return await this.content.createSection(user, contentId, sectionInfo);
    }

    async save(user: JwtPayload, contentId: string, sectionId: string, sectionInfo: SectionForm): Promise<Section> {
        return await this.content.editSection(user, contentId, sectionId, sectionInfo);
    }

    async publish(user: JwtPayload, contentId: string, sectionId: string, pubStatus: PublishSection): Promise<Section> {
        return await this.content.publishSection(user, contentId, sectionId, pubStatus);
    }

    async delete(user: JwtPayload, contentId: string, sectionId: string): Promise<void> {
        return await this.content.deleteSection(user, contentId, sectionId);
    }
}
