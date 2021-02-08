import { PaginateResult } from 'mongoose';

import { CreateInitialMessage, CreateResponse, Message, MessageThread } from '@dragonfish/models/messages';

export interface IMessages {
    /**
     * Creates a new thread with one other user.
     *
     * @param user The user creating the thread
     * @param initialMessage The first message of said thread
     */
    createNewPrivateThread(user: any, initialMessage: CreateInitialMessage): Promise<void>;

    /**
     * Creates a response for a thread.
     *
     * @param user The user responding
     * @param response Their response
     */
    createResponse(user: any, response: CreateResponse): Promise<Message>;

    /**
     * Fetches the paginated list of threads in which a user is
     * involved.
     *
     * @param user The user who's part of these threads
     * @param pageNum The current page of threads
     */
    fetchThreads(user: any, pageNum: number): Promise<PaginateResult<MessageThread>>;

    /**
     * Fetches a small subset of active conversations, sorted by update date.
     *
     * @param user The user who's part of these threads
     */
    fetchSidenavThreads(user: any): Promise<MessageThread[]>;
}
