import { http } from './http';
import type { Notification, MarkAsRead } from '../models/activity';
import { baseUrl } from '../util';

export async function fetchAllUnread(profileId: string): Promise<Notification[]> {
    return http
        .get<Notification[]>(`${baseUrl}/notifications/all-unread?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function fetchAllRead(profileId: string): Promise<Notification[]> {
    return http
        .get<Notification[]>(`${baseUrl}/notifications/all-read?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function markAsRead(profileId: string, toMark: MarkAsRead): Promise<void> {
    return http
        .patch<void>(`${baseUrl}/notifications/mark-as-read?pseudId=${profileId}`, toMark)
        .then(() => {
            return;
        });
}
