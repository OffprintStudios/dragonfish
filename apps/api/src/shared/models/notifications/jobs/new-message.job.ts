export interface NewMessageJob {
    readonly recipients: string[];
    readonly threadId: string;
    readonly senderId: string;
    readonly senderScreenName: string;
    readonly senderAvatar: string;
}
