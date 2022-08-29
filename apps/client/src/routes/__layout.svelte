<script lang="ts">
    import '../app.scss';
    import { QueryClientProvider, broadcastQueryClient } from '@sveltestack/svelte-query';
    import { SvelteToast } from '@zerodevx/svelte-toast';
    import Nav from '$lib/components/nav/Nav.svelte';
    import { app } from '$lib/repo/app.repo';
    import { onMount } from 'svelte';
    import { queryClient } from '$lib/util';
    import { Sidenav } from '$lib/components/nav/sidenav';
    import { Popup } from '$lib/components/nav/popup';

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
        <Sidenav>
            <slot />
        </Sidenav>
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
