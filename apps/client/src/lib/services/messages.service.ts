import { http } from './http';
import { baseUrl } from '$lib/util';
import type { PaginateResult } from '$lib/models/util';
import type { MessageThread, NewMessageForm } from '$lib/models/messages';

export async function fetchThreads(profileId: string) {
    return http.get<PaginateResult<MessageThread>>(`${baseUrl}/messages/fetch-threads?pseudId=${profileId}`).then(res => {
        return res.data;
    })
}

export async function fetchThread(threadId: string, profileId: string) {
    return http.get<MessageThread>(`${baseUrl}/messages/fetch-thread?pseudId=${profileId}&threadId=${threadId}`).then(res => {
        return res.data;
    });
}

export async function sendPrivateMessage(newMessage: NewMessageForm) {
    return http.post<void>(`${baseUrl}/messages/send-message?pseudId=${newMessage.senderId}`, newMessage).then(() => {
        return;
    });
}
