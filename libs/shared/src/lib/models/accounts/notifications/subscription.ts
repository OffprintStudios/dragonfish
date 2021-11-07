import { SubscriptionKind } from './subscription.kind';

export interface Subscription {
    readonly _id: string;
    readonly subscriberId: string;
    readonly itemId: string;
    readonly kind: SubscriptionKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
