import type { ToastKind } from '$lib/models/site/toast-kind';

export interface ToastProps {
    kind: ToastKind;
    message: string;
}
