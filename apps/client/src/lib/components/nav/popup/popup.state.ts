import { writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';

interface PopupState {
    isOpen: boolean;
    showBackdrop: boolean;
    component: SvelteComponent;
}

export const popup = writable<PopupState>({
    isOpen: false,
    showBackdrop: true,
    component: null,
});

export function openPopup(component: SvelteComponent): void {
    popup.update((state) => ({
        ...state,
        isOpen: true,
        component,
    }));
}

export function closePopup(): void {
    popup.update((state) => ({
        ...state,
        isOpen: false,
        component: null,
    }));
}

export function togglePopup(component: SvelteComponent): void {
    popup.update((state) => ({
        ...state,
        isOpen: !state.isOpen,
        component: state.isOpen ? null : component,
    }));
}
