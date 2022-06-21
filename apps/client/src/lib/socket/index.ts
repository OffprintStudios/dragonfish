import { io, Socket } from 'socket.io-client';
import { baseUrl } from '$lib/util';
import { session } from '$lib/repo/session.repo';
import { writable } from 'svelte/store';

export const socket = writable<Socket>(null);

session.subscribe((state) => {
    if (state.account === null && state.currProfile === null && state.token === null) {
        socket.set(null);
    } else {
        socket.set(io(`${baseUrl}`, {
            auth: {
                token: state.token,
                pseudId: state.currProfile?._id,
            },
            transports: ['websocket'],
        }));
    }
});
