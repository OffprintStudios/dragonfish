export interface Comment {
    readonly _id: string;
    readonly user: string;
    readonly body: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly kind: string;
}

export interface BlogComment extends Comment {
    readonly blogId: string;
}

export interface WorkComment extends Comment {
    readonly workId: string;
}