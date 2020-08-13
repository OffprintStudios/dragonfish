export interface Section {
    readonly _id: string;
    readonly title: string;
    readonly body: string;
    readonly authorsNote?: string;
    readonly published: boolean;
    readonly stats: {
        readonly words: number;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
