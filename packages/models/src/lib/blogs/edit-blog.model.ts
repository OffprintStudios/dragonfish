export interface EditBlog {
    readonly _id: string;
    readonly title: string;
    readonly body: string;
    readonly published: boolean;

    // Remove this once we've migrated fully away from Quill
    readonly usesNewEditor: boolean;
}
