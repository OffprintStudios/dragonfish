export interface NewMessageDbPayload {
    readonly recipientId: string;
    readonly threadId: string;
    readonly senderId: string;
    readonly senderScreenName: string;
    readonly senderAvatar: string;
}
