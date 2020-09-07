export interface CreateInitialMessage {
    readonly name?: string;
    readonly recipient: string;
    readonly body: string;
}