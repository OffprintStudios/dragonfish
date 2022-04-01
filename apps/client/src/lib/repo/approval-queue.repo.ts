import { writable } from 'svelte/store';
import type { QueueItem } from '$lib/models/admin/approval-queue';
import { getQueue, claimContent, rejectContent, approveContent } from '$lib/services/admin.service';
import type { Decision } from '$lib/models/admin/approval-queue';
import { reject } from 'lodash';
import { browser } from '$app/env';

interface ApprovalQueueState {
    queue: QueueItem[];
    currItem: QueueItem;
}

const defaultApprovalQueueState: ApprovalQueueState = {
    queue: [],
    currItem: null,
};

const initialApprovalQueueState: ApprovalQueueState = browser
    ? JSON.parse(window.localStorage.getItem('approvalQueue')) ?? defaultApprovalQueueState
    : defaultApprovalQueueState;

export const approvalQueue = writable<ApprovalQueueState>(initialApprovalQueueState);

approvalQueue.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('approvalQueue', JSON.stringify(value));
    }
});

//#region ---HELPERS---

export async function setQueue(profileId: string): Promise<void> {
    return getQueue(profileId).then((res) => {
        approvalQueue.update((state) => ({
            ...state,
            queue: res,
            currItem: null,
        }));
        return;
    });
}

export function setCurrItem(docId: string): void {
    approvalQueue.update((state) => {
        state.currItem = state.queue.find((item) => item._id === docId);
        return state;
    });
}

export function resetCurrItem(): void {
    approvalQueue.update((state) => ({
        ...state,
        currItem: null,
    }));
}

export function removeItem(docId: string): void {
    approvalQueue.update((state) => ({
        ...state,
        queue: state.queue.filter((item) => item._id !== docId),
        currItem: null,
    }));
}

export async function claimItem(profileId: string, docId: string): Promise<void> {
    return claimContent(profileId, docId).then((res) => {
        approvalQueue.update((state) => {
            const itemIndex = state.queue.findIndex((item) => item._id === res._id);
            state.queue[itemIndex] = res;
            return state;
        });
    });
}

export async function approveItem(profileId: string, decision: Decision): Promise<void> {
    return approveContent(profileId, decision).then(() => {
        removeItem(decision.docId);
    });
}

export async function rejectItem(profileId: string, decision: Decision): Promise<void> {
    return rejectContent(profileId, decision).then(() => {
        removeItem(decision.docId);
    });
}

//#endregion
