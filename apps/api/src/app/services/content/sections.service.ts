import { Injectable, Logger } from '@nestjs/common';

import { ContentStore } from '@dragonfish/api/database/content/stores';
import { ISections } from '../../shared/content';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { Section, SectionForm, PublishSection } from '@dragonfish/shared/models/sections';

@Injectable()
export class SectionsService implements ISections {
    private readonly logger: Logger = new Logger(SectionsService.name);

    constructor(private readonly content: ContentStore) {}

    async fetchOneById(sectionId: string, published?: boolean): Promise<Section> {
        return await this.content.fetchSectionById(sectionId, published);
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

    // Tempoary method. If it's still around by 2021-08-07, delete it. -PingZing
    async migrateQuillSection(authorId: string, contentId: string, sectionId: string, sectionInfo: SectionForm): Promise<Section> {
        return await this.content.migrateQuillContent(authorId, contentId, sectionId, sectionInfo);
    }
}
