import { get, writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';

interface PopupState {
    isOpen: boolean;
    showBackdrop: boolean;
    component: SvelteComponent;
    onConfirm: PopupOnConfirm;
}

export interface PopupOnConfirm {
    onConfirm(): void
}

export const popup = writable<PopupState>({
    isOpen: false,
    showBackdrop: true,
    component: null,
    onConfirm: null,
});

export function openPopup(component: SvelteComponent, onConfirm: PopupOnConfirm = null): void {
    if (onConfirm) {
        popup.update((state) => ({
            ...state,
            isOpen: true,
            component,
            onConfirm,
        }));
    } else {
        popup.update((state) => ({
            ...state,
            isOpen: true,
            component,
        }));
    }
}

export function closePopup(): void {
    popup.update((state) => ({
        ...state,
        isOpen: false,
        component: null,
    }));
}

export function closePopupAndConfirm(): void {
    closePopup();
    if (get(popup).onConfirm) {
        get(popup).onConfirm.onConfirm();
    }
}

export function togglePopup(component: SvelteComponent): void {
    popup.update((state) => ({
        ...state,
        isOpen: !state.isOpen,
        component: state.isOpen ? null : component,
    }));
}
