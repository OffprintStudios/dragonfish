import { SubscriptionKind } from '../subscription.kind';

export interface SubscriptionPayload {
    readonly itemId: string;
    readonly subscriberId: string;
    readonly kind: SubscriptionKind;
}
