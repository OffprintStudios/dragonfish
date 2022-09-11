<script lang="ts">
    import { page } from '$app/stores';
    import PageNav from '$lib/components/nav/PageNav.svelte';
    import { TeamLine, Group2Line, RssFill } from 'svelte-remixicon';
</script>

<div
    class="flex flex-col md:flex-row w-full h-screen overflow-y-auto md:overflow-y-hidden"
>
    <PageNav>
        <svelte:fragment slot="header">
            <h3>Social</h3>
            <TeamLine />
        </svelte:fragment>
        <svelte:fragment slot="pages">
            <a href="/social" class:active={$page.url.pathname === '/social'}>
                <span class="link-icon"><RssFill /></span>
                <span class="text">Activity feed</span>
            </a>
            <a href="/social/groups" class:active={$page.url.pathname.includes('/groups')}>
                <span class="link-icon"><Group2Line /></span>
                <span class="text">Groups</span>
            </a>
        </svelte:fragment>
    </PageNav>
    <div class="flex-1 h-screen overflow-y-auto">
        <slot />
    </div>
</div>
