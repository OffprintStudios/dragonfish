export interface NewMessagePayload {
    readonly recipients: string[];
    readonly threadId: string;
    readonly senderId: string;
}
