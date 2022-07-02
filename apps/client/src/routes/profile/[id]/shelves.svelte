<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';

    export const load: Load = async ({ params }) => {
        const profileId: string = params.id;

        return {
            props: {
                profileId,
            },
        };
    };
</script>

<script lang="ts">
    import { useQuery } from '@sveltestack/svelte-query';
    import { localeDate, abbreviate, pluralize, ALPHA_MESSAGE } from '$lib/util';
    import { profile } from '$lib/repo/profile.repo';
    import { fetchPublicShelves } from '$lib/services/content-library.service';
    import { Loader5Line, CloseLine, InformationLine, BarChart2Fill } from 'svelte-remixicon';
    import { NotifyBanner } from '$lib/components/ui/misc';
    import { session } from '$lib/repo/session.repo';

    export let profileId: string;

    const profileShelves = useQuery('profileShelves', () => fetchPublicShelves(profileId));
</script>

<svelte:head>
    {#if $profile}
        <title>{$profile.screenName}'s Shelves &mdash; Offprint</title>
        <!-- Primary Meta Tags -->
        <meta name="title" content="{$profile.screenName}'s Shelves on Offprint" />
        <meta name="description" content="Taking a look at {$profile.screenName}'s shelves" />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://offprint.net/profile/{$profile._id}" />
        <meta property="og:title" content="{$profile.screenName}'s Shelves on Offprint" />
        <meta property="og:description" content="Taking a look at {$profile.screenName}'s shelves" />
        <meta property="og:image" content={$profile.profile.avatar} />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://offprint.net/profile/{$profile._id}" />
        <meta property="twitter:title" content="{$profile.screenName}'s Shelves on Offprint" />
        <meta
            property="twitter:description"
            content="Taking a look at {$profile.screenName}'s shelves"
        />
        <meta property="twitter:image" content={$profile.profile.avatar} />
    {/if}
</svelte:head>

<div class="w-11/12 mx-auto">
    {#if !$session || !$session.account }
        <NotifyBanner
            message={ALPHA_MESSAGE}
        />
    {/if}
    {#if $session && $session.currProfile && $session.currProfile._id === profileId }
        <NotifyBanner
            message="This page only shows <b>public</b> bookshelves. To see all your bookshelves and
                        make any changes, head over to the Explore page!"
        />
    {/if}
    {#if $profileShelves.isLoading}
        <div class="h-96 w-full flex flex-col items-center justify-center">
            <div class="flex items-center">
                <Loader5Line class="mr-2 animate-spin" size="24px" />
                <span class="text-lg uppercase font-bold tracking-widest">Loading...</span>
            </div>
        </div>
    {:else if $profileShelves.isError}
        <div class="h-96 w-full flex flex-col items-center justify-center">
            <div class="flex items-center">
                <CloseLine class="mr-2" size="24px" />
                <span class="text-lg uppercase font-bold tracking-widest"
                    >Error fetching bookshelves!</span
                >
            </div>
        </div>
    {:else if $profileShelves.data.length > 0}
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full md:max-w-7xl mx-auto gap-2 my-6"
        >
            {#each $profileShelves.data as shelf}
                <a
                    class="shelf-box border-gray-600 dark:border-white"
                    href="/profile/{profileId}/shelf/{shelf._id}"
                >
                    <div
                        class="h-24 w-24 flex flex-col items-center justify-center border-4 rounded-md mr-4"
                    >
                        <BarChart2Fill class="24px" />
                    </div>
                    <div class="flex-1">
                        <h3
                            class="text-xl font-medium overflow-ellipsis overflow-hidden whitespace-nowrap"
                        >
                            {shelf.name}
                        </h3>
                        <div class="text-sm">
                            {shelf.desc ? shelf.desc : ''}
                        </div>
                        <div class="flex items-center">
                            <span class="italic text-xs"
                                >{localeDate(shelf.createdAt, 'mediumDate')}</span
                            >
                            <span class="text-base mr-1 ml-1.5 relative -top-0.5">•</span>
                            <span class="italic text-xs"
                                >{abbreviate(shelf.works)} work{pluralize(shelf.works)}</span
                            >
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {:else}
        <div class="h-96 w-full flex flex-col items-center justify-center">
            <div class="flex items-center">
                <InformationLine class="mr-2" size="24px" />
                <span class="text-lg uppercase font-bold tracking-widest"
                    >Nothing's been made public yet...</span
                >
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    a.shelf-box {
        @apply block p-2 border rounded-md flex items-center transition transform cursor-pointer select-none no-underline;
        &:hover {
            @apply scale-105 text-white;
            background: var(--accent);
            h3 {
                @apply text-white;
            }
        }
    }
</style>
