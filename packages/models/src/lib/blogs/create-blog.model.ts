export interface CreateBlog {
    readonly title: string;
    readonly body: string;
    readonly published: boolean;

    // Remove this once we've migrated away from Quill
    readonly usesFroala: boolean;
}
 