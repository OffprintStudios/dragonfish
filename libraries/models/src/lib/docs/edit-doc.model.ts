export interface EditDoc {
    readonly _id: string;
    readonly docTitle: string;
    readonly docBody: string;

    // Remove this once we've migrated fully away from Quill
    readonly usesNewEditor: boolean;
}
