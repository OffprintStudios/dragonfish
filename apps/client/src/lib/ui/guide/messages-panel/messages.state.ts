import { writable } from 'svelte/store';
import type { MessageThread } from '$lib/models/messages';

interface MessagesState {
    threads: MessageThread[];
    currThread: MessageThread;
}

export const messages = writable<MessagesState>({
    threads: [],
    currThread: null,
});

export function setCurrent(threadId: string) {
    messages.update((state) => {
        const index = state.threads.findIndex((item) => item._id === threadId);
        state.currThread = state.threads[index];
        return state;
    });
}

export function clearCurrent() {
    messages.update((state) => ({
        ...state,
        currThread: null,
    }));
}
