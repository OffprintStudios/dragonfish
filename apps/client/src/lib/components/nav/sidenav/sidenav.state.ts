import { writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';

interface SidenavState {
    isOpen: boolean;
    component: SvelteComponent;
}

export const sidenav = writable<SidenavState>({ isOpen: false, component: null });

export function open(component: SvelteComponent): void {
    sidenav.update((state) => ({
        ...state,
        isOpen: true,
        component,
    }));
}

export function close(): void {
    sidenav.update((state) => ({
        ...state,
        isOpen: false,
        component: null,
    }));
}

export function toggle(component: SvelteComponent): void {
    sidenav.update((state) => ({
        ...state,
        isOpen: !state.isOpen,
        component: state.isOpen ? null : component,
    }));
}
