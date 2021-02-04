import { MessageUser } from './message-user.model';

export interface Message {
    readonly _id: string;
    readonly threadId: string;
    readonly user: string | MessageUser;
    readonly body: string;
    readonly audit: {
        readonly isEdited: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
