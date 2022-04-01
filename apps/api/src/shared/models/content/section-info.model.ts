export interface SectionInfo {
    readonly _id: string;
    readonly title: string;
    readonly published: boolean;
    readonly stats: {
        readonly words: number;
    };
    readonly audit: {
        readonly publishedOn: Date;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
