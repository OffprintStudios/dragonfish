export interface CommentHistory {
    readonly _id: string;
    readonly oldBody: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
