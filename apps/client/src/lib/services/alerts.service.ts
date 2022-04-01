import { toast } from '@zerodevx/svelte-toast';
import Toast from '$lib/components/ui/misc/Toast.svelte';
import type { ToastProps } from '$lib/models/site';
import { ToastKind } from '$lib/models/site';

export function notify(props: ToastProps): void {
    toast.push({
        component: {
            src: Toast,
            props,
        },
        dismissable: false,
        theme: {
            '--toastPadding': '0',
            '--toastMsgPadding': '0',
            '--toastBackground': 'transparent',
            '--toastBorderRadius': '0.5rem',
            '--toastBarBackground': 'white',
            '--toastBarHeight': '4px',
        },
    });
}

export function success(message: string): void {
    notify({
        kind: ToastKind.Success,
        message,
    });
}

export function failure(message: string): void {
    notify({
        kind: ToastKind.Failure,
        message,
    });
}

export function warning(message: string): void {
    notify({
        kind: ToastKind.Warning,
        message,
    });
}

export function info(message: string): void {
    notify({
        kind: ToastKind.Info,
        message,
    });
}
