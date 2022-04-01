<script lang="ts">
    import { ToastKind } from '$lib/models/site';
    import {
        CheckboxCircleLine,
        CloseCircleLine,
        InformationLine,
        AlarmWarningLine,
    } from 'svelte-remixicon';

    export let kind: ToastKind = ToastKind.Info;
    export let message = 'Toast created!';
</script>

<div
    class="toast"
    class:success={kind === ToastKind.Success}
    class:failure={kind === ToastKind.Failure}
    class:warning={kind === ToastKind.Warning}
    class:info={kind === ToastKind.Info}
>
    <span class="mr-2">
        {#if kind === ToastKind.Success}
            <CheckboxCircleLine size="24px" />
        {:else if kind === ToastKind.Failure}
            <CloseCircleLine size="24px" />
        {:else if kind === ToastKind.Warning}
            <AlarmWarningLine size="24px" />
        {:else}
            <InformationLine size="24px" />
        {/if}
    </span>
    <span>
        {message}
    </span>
</div>

<style lang="scss">
    div.toast {
        @apply flex items-center rounded-lg p-4 text-white;
        &.success {
            @apply bg-green-600;
        }
        &.failure {
            @apply bg-red-700;
        }
        &.warning {
            @apply bg-amber-500;
        }
        &.info {
            @apply bg-indigo-600;
        }
    }
</style>
