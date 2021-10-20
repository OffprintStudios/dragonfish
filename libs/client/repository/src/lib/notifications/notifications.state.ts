import { EntityState, MultiActiveState } from '@datorama/akita';
import { Notification } from '@dragonfish/shared/models/accounts/notifications';

export interface NotificationsState extends EntityState<Notification, string>, MultiActiveState {}
