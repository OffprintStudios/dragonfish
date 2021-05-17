import { PaginateResult } from 'mongoose';

import {
    FormType,
    ContentFilter,
    ContentKind,
    ContentModel,
    PubChange,
} from '@dragonfish/shared/models/content';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { RatingsModel } from '@dragonfish/shared/models/ratings';

export interface IContent {
    /**
     * Fetches a single piece of content from the database regardless of its publishing status.
     *
     * @param contentId The content ID
     * @param kind The content kind
     * @param user The author of the content
     */
    fetchOne(contentId: string, kind: ContentKind, user?: JwtPayload): Promise<ContentModel>;

    /**
     * Fetches one published item from the content collection via its ID and ContentKind. If a
     * user is making this request, update the relevant reading history document.
     *
     * @param contentId — A content's ID
     * @param kind — A content's Kind
     * @param user — (Optional) The user making the request
     */
    fetchOnePublished(contentId: string, kind: ContentKind, user?: JwtPayload): Promise<[ContentModel, RatingsModel]>;

    /**
     * Finds a bunch of content documents belonging to a user, per that user's request.
     *
     * @param user — The user making the request
     */
    fetchAll(user: JwtPayload): Promise<ContentModel[]>;

    /**
     * Fetches all published documents based on kind, limited by page number.
     *
     * @param pageNum The current page
     * @param kinds The kind of document to fetch
     * @param filter What rating of content to fetch
     * @param userId (Optional) The author this content belongs to
     */
    fetchAllPublished(
        pageNum: number,
        kinds: ContentKind[],
        filter: ContentFilter,
        userId?: string
    ): Promise<PaginateResult<ContentModel>>;

    /**
     * Routes a request for creating some content to the appropriate API functions, given the specified
     * `ContentKind`.
     *
     * @param user The author of the content
     * @param kind The content kind
     * @param formInfo The form information
     */
    createOne(user: JwtPayload, kind: ContentKind, formInfo: FormType): Promise<ContentModel>;

    /**
     * Checks to see if a piece of content exists with the correct user and content ID. If so, routes
     * the function to dedicated editing functions across the API. If not, throws an `UnauthorizedException`.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param formInfo The form information
     */
    saveOne(user: JwtPayload, contentId: string, formInfo: FormType): Promise<ContentModel>;

    /**
     * Sets the `isDeleted` flag of a piece of content belonging to the specified user to `true`.
     *
     * @param user The owner of this content
     * @param contentId The content's ID
     */
    deleteOne(user: JwtPayload, contentId: string): Promise<void>;

    /**
     * Checks to see if a piece of content exists with the correct user and content ID. If so, routes
     * the function to dedicated publishing functions across the API. If not, throw an `UnauthorizedException`.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param pubChange (Optional) Publishing status updates for Blogs and Newsposts
     */
    publishOne(user: JwtPayload, contentId: string, pubChange?: PubChange): Promise<ContentModel>;

    /**
     * Updates a content's cover art URL, based on its contentKind.
     *
     * @param user The author of the content
     * @param contentId The content ID
     * @param kind The content kind
     * @param coverArt The new cover art URL
     */
    updateCoverArt(user: JwtPayload, contentId: string, kind: ContentKind, coverArt: string): Promise<ContentModel>;
}
