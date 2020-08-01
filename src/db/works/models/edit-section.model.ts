export interface EditSection {
    readonly title: string;
    readonly body: string;
    readonly authorsNote?: string;
    readonly published: boolean;
    readonly oldWords: number;
    readonly oldPublished: boolean;
}
