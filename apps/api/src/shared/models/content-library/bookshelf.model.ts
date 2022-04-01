export interface Bookshelf {
    readonly _id: string;
    readonly userId: string;
    name: string;
    desc: string;
    coverPic: string;
    public: boolean;
    works: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
