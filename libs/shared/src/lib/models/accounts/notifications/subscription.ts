export interface Subscription {
    readonly _id: string;
    readonly subscriberId: string;
    readonly itemId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
