<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    import { session } from '$lib/repo/session.repo';

    export const load: Load = async () => {
        const currProfile = get(session).currProfile;

        if (currProfile === null || currProfile === undefined) {
            return {
                status: 307,
                redirect: '/explore'
            }
        } else {
            return;
        }
    }
</script>

<script lang="ts">
    import type { FollowingUser } from '$lib/models/activity';
    import { useQuery } from '@sveltestack/svelte-query';
    import { Loader5Line, CloseLine, Apps2Line, InformationLine } from 'svelte-remixicon';
    import { onMount } from 'svelte';
    import { fetchFollowing } from '$lib/services/profile.service';

    let following: FollowingUser[] = [];

    onMount(async () => {
        following = await fetchFollowing($session.currProfile._id);
    })

    const followsList = useQuery('followsList', () => fetchFollowing($session.currProfile?._id), {
        enabled: !!$session.currProfile && !!$session.account,
        initialData: following,
    });
</script>

<div class="w-full min-h-screen md:h-screen overflow-y-auto flex flex-col">
    <div class="w-full">
        {#if $followsList.isLoading}
            <div class="h-32 flex flex-col items-center justify-center">
                <div class="flex items-center justify-center">
                    <Loader5Line class="mr-2 animate-spin" size="24px" />
                    <span class="font-bold tracking-widest uppercase text-sm">Loading...</span>
                </div>
            </div>
        {:else if $followsList.isError}
            <div class="h-32 flex flex-col items-center justify-center">
                <div class="flex items-center justify-center">
                    <CloseLine class="mr-2" size="24px" />
                    <span class="font-bold tracking-widest uppercase text-sm">Error fetching follows</span>
                </div>
            </div>
        {:else if $followsList.data.length === 0}
            <div class="h-32 flex flex-col items-center justify-center">
                <div class="flex items-center justify-center">
                    <InformationLine class="mr-2" size="24px" />
                    <span class="font-bold tracking-widest uppercase text-sm">You haven't followed anyone yet</span>
                </div>
            </div>
        {:else}
            <div class="flex items-center overflow-x-auto px-12 py-12">
                <a
                    href="/explore/following"
                    class="follow bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed"
                    class:active={$page.url.pathname === '/explore/following'}
                >
                    <Apps2Line size="40px" />
                </a>
                {#each $followsList.data as follow}
                    <a
                        href="/explore/following/{follow.itemId._id}"
                        class="follow bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed"
                        class:active={$page.url.pathname === `/explore/following/${follow.itemId._id}`}
                    >
                        <img src={follow.itemId.profile.avatar} class="object-cover w-full h-full">
                    </a>
                {/each}
            </div>
        {/if}
    </div>

    <slot />
</div>

<style lang="scss">
    a.follow {
        @apply rounded-full w-24 h-24 flex items-center justify-center border-2 border-transparent transition transform overflow-hidden mx-4;
        color: var(--text-color);
        &:hover {
            border-color: var(--accent);
            color: var(--accent);
        }
        &.active {
            @apply text-white;
            background-color: var(--accent) !important;
        }
    }
</style>
