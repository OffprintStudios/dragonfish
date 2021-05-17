import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { JwtPayload } from '@dragonfish/shared/models/auth';

export interface IHistory {
    /**
     * Fetches all history documents belonging to one user.
     *
     * @param user The owner of these documents
     */
    fetchUserHistory(user: JwtPayload): Promise<ReadingHistory[]>;

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
     * @param histIds The history document itself
     */
    changeVisibility(user: JwtPayload, histIds: string[]): Promise<void>;
}
