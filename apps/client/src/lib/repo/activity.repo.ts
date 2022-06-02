import { writable } from 'svelte/store';
import type { MarkAsRead, Notification } from '../models/activity';
import { markAsRead } from '../services/activity.service';

export const activity = writable<Notification[]>([]);

export function setActivity(notifications: Notification[]) {
    activity.set(notifications);
}

export async function removeAsRead(profileId: string, toMark: MarkAsRead) {
    await markAsRead(profileId, toMark).then(() => {
        activity.update((state) => {
            state = state.filter(item => item._id !== toMark.ids[0])
            return state;
        })
    })
}
