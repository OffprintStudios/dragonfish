import { MessageThreadUser } from './message-thread-user.model';

export interface MessageThread {
    readonly _id: string;
    readonly name: string;
    readonly users: string[] | MessageThreadUser[];
    readonly meta: {
        readonly threadPicture: string;
        readonly numMessages: number;
        readonly userWhoRepliedLast: string;
        readonly lastMessage: string;
    };
    readonly audit: {
        readonly isDeleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
