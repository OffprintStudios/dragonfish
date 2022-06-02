<script lang="ts">
    import '../app.scss';
    import { broadcastQueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
    import { SvelteToast } from '@zerodevx/svelte-toast';
    import { app } from '$lib/repo/app.repo';
    import { onMount } from 'svelte';
    import { queryClient } from '$lib/util';
    import { Popup } from '$lib/components/nav/popup';
    import { Guide } from '$lib/ui/guide';
    import { Nav } from '$lib/ui/nav';

    onMount(async () => {
        await broadcastQueryClient({
            queryClient,
            broadcastChannel: 'offprint',
        });
    });
</script>

<QueryClientProvider client={queryClient}>
    <Popup />
    <main
        class="flex flex-col md:flex-row h-screen {$app.theme}"
        class:dark={$app.darkMode === true}
        class:light={$app.darkMode === false}
        on:dragover|preventDefault
    >
        <Nav />
        <Guide>
            <slot />
        </Guide>
    </main>
    <SvelteToast />
</QueryClientProvider>

<style lang="scss">
    :global(main) {
        color: var(--text-color);
        font-family: var(--body-text);
        background: var(--background);
        position: relative;
    }
</style>
