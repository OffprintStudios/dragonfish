export interface EditSection {
    readonly title: string;
    readonly body: string;
    readonly authorsNote?: string;
    readonly oldWords: number;

    // Remove this once we've migrated all sections from Quill
    readonly usesFroala: boolean;
}
