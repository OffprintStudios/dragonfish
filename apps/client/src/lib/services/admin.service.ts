import { http } from './http';
import { baseUrl } from '$lib/util';
import type { QueueItem, Decision } from '$lib/models/admin/approval-queue';
import type { InviteCode } from '$lib/models/accounts';

//#region ---APPROVAL QUEUE---

export async function getQueue(profileId: string): Promise<QueueItem[]> {
    return http
        .get<QueueItem[]>(`${baseUrl}/approval-queue/get-queue?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function claimContent(profileId: string, docId: string): Promise<QueueItem> {
    return http
        .patch<QueueItem>(
            `${baseUrl}/approval-queue/claim-content?pseudId=${profileId}&docId=${docId}`,
            {},
        )
        .then((res) => {
            return res.data;
        });
}

export async function approveContent(profileId: string, decision: Decision): Promise<void> {
    return http
        .patch<void>(`${baseUrl}/approval-queue/approve-content?pseudId=${profileId}`, decision)
        .then(() => {
            return;
        });
}

export async function rejectContent(profileId: string, decision: Decision): Promise<void> {
    return http
        .patch<void>(`${baseUrl}/approval-queue/reject-content?pseudId=${profileId}`, decision)
        .then(() => {
            return;
        });
}

//#endregion

//#region ---USER MANAGEMENT---

export async function generateInviteCode(): Promise<InviteCode> {
    return http.get<InviteCode>(`${baseUrl}/user/generate-code`).then((res) => {
        return res.data;
    });
}

export async function sendInviteEmail(email: string): Promise<void> {
    return http.post<void>(`${baseUrl}/user/send-invite-code`, { emailAddress: email }).then(() => {
        return;
    });
}

//#endregion
