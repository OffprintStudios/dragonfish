import { JwtPayload } from '@dragonfish/models/auth';
import { PublishSection, Section, SectionForm } from '@dragonfish/models/sections';

export interface ISections {
    /**
     * Fetches a section by ID. Performs an extra check to only fetch a published section.
     *
     * @param sectionId The second ID
     * @param published (Optional) Whether or not the section needs to be published
     */
    fetchOneById(sectionId: string, published?: boolean): Promise<Section>;

    /**
     * Fetches all sections, published and unpublished, associated with the provided content belonging to the specified user.
     *
     * @param user The author of the content
     * @param contentId The content ID
     */
    fetchUserContentSections(user: JwtPayload, contentId: string): Promise<Section[]>;

    /**
     * Adds a section to some content. Only applicable to Prose, Poetry, and Scripts.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param sectionInfo The new section's info
     */
    create(user: JwtPayload, contentId: string, sectionInfo: SectionForm): Promise<Section>;

    /**
     * Updates a given section with the new info. If the section is published, subtract the old word count and then add the new word count.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param sectionId The section ID
     * @param sectionInfo The new section info
     */
    save(user: JwtPayload, contentId: string, sectionId: string, sectionInfo: SectionForm): Promise<Section>;

    /**
     * Publishes a section. If any change occurred in said section's publishing status, then it updates the parent content's wordcount accordingly.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param sectionId The section ID
     * @param pubStatus The publishing status for this section
     */
    publish(user: JwtPayload, contentId: string, sectionId: string, pubStatus: PublishSection): Promise<Section>;

    /**
     * Deletes a section and updates the parent wordcount accordingly if that section was published.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param sectionId The section ID
     */
    delete(user: JwtPayload, contentId: string, sectionId: string): Promise<void>;
}
