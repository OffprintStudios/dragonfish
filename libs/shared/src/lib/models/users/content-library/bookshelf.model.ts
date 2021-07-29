export interface Bookshelf {
    readonly _id: string;
    readonly userId: string;
    name: string;
    desc: string;
    coverPic: string;
    public: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
