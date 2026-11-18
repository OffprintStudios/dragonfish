export interface BlogObject {
    id: string;
    authorID: string;
    authorName: string;
    authorAvatar: string;
    title: string;
    body: string;
    words: number;
    views: number;
    likes: number;
    dislikes: number;
    nsfw: boolean;
    license: string;
    allowComments: boolean;
    editedOn?: Date
    publishedOn?: Date
    createdAt: Date
    updatedAt: Date
}