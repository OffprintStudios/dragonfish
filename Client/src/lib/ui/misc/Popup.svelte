<script lang="ts">
    import type { Snippet } from 'svelte';
    import { page } from '$app/state'; // Use '$app/stores' ($page) if on older SvelteKit

    interface Props {
        id: string;
        show?: boolean;
        fullWidth?: boolean;
        children: Snippet;
    }

    let {
        id,
        show = $bindable(false),
        fullWidth = false,
        children
    }: Props = $props();

    let dialogRef: HTMLDialogElement | undefined = $state();
    let containerRef: HTMLDivElement | undefined = $state();

    // Sync the `show` state with the native <dialog> element
    $effect(() => {
        if (!dialogRef) return;

        if (show && !dialogRef.open) {
          dialogRef.showModal();
        } else if (!show && dialogRef.open) {
          dialogRef.close();
        }
    });

    // Close the modal automatically when the route pathname changes
    $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _pathname = page.url.pathname;
        show = false;
    });

    // Handle clicks outside the inner container (on the dialog backdrop)
    function handleDialogClick(event: MouseEvent) {
        if (containerRef && !containerRef.contains(event.target as Node)) {
            show = false;
        }
    }
</script>

<dialog
    {id}
    bind:this={dialogRef}
    onclose={() => (show = false)}
    onclick={handleDialogClick}
    class="fixed top-[50%] left-[50%] backdrop:bg-zinc-900/50 backdrop:backdrop-blur-lg open:backdrop:animate-[modal-show_200ms_ease_normal] bg-transparent rounded-xl"
    class:w-full={fullWidth}
    style="transform: translate(-50%, -50%);"
>
    <div
        bind:this={containerRef}
        class="m-8 bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur rounded-xl border border-zinc-600/25 dark:border-zinc-300/25 overflow-hidden motion-scale-in-50 motion-duration-350 motion-ease-spring-smooth"
        style="color: var(--text-color); box-shadow: var(--dropshadow);"
    >
        {@render children()}
    </div>
</dialog>