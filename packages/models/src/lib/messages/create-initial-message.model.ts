export interface CreateInitialMessage {
    readonly name?: string;
    readonly sender: string;
    readonly recipients: string[];
    readonly body: string;
}