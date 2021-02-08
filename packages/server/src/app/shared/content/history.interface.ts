import { PaginateResult } from 'mongoose';

import { ReadingHistory } from "@dragonfish/models/reading-history";
import { JwtPayload } from '@dragonfish/models/auth';

export interface IHistory {
    /**
     * Creates a new history document if, and only if, one for the existing content doesn't
     * already exist for this user. Otherwise, updates the existing document with a new
     * `viewedOn` date and resets its visibility to `true`.
     *
     * @param user The owner of this history document
     * @param contentId The content being viewed
     */
    addOrUpdateHistory(user: JwtPayload, contentId: string): Promise<ReadingHistory>;

    /**
     * Fetches all history documents belonging to one user.
     *
     * @param user The owner of these documents
     * @param pageNum The current page of results to view
     */
    fetchUserHistory(user: JwtPayload, pageNum: number): Promise<PaginateResult<ReadingHistory>>;

    /**
     * Fetches seven history documents belonging to one user for their sidenav.
     *
     * @param user The owner of these documents
     */
    fetchUserSidenavHistory(user: JwtPayload): Promise<ReadingHistory[]>;

    /**
     * Fetches one history document associated with both a user and some content.
     *
     * @param user The owner of the history document
     * @param contentId The content associated with it
     */
    fetchOneHistoryDoc(user: JwtPayload, contentId: string): Promise<ReadingHistory>;

    /**
     * Soft deletes a history document so it no longer shows up on frontend queries.
     *
     * @param user The owner of the history document
     * @param histId The history document itself
     */
    changeVisibility(user: JwtPayload, histId: string): Promise<void>;
}