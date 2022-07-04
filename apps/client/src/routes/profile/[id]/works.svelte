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
    import { page } from '$app/stores';
    import { profile } from '$lib/repo/profile.repo';
    import { session } from '$lib/repo/session.repo';
    import { app } from '$lib/repo/app.repo';
    import { CheckLine, DraftLine, Loader5Line, TimeLine, CloseLine } from 'svelte-remixicon';
    import { fetchAllByKind, fetchUserContent } from '$lib/services/content.service';
    import { ContentKind } from '$lib/models/content';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import { NotifyBanner, Paginator } from '$lib/components/ui/misc';
    import { updateUrlParams, ALPHA_MESSAGE } from '$lib/util';

    enum WorkTabs {
        Published,
        Drafts,
        Rejected,
        Pending,
    }

    export let profileId: string;
    let currentTab = WorkTabs.Published;
    let currPage = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;

    function changeTab(tab: WorkTabs) {
        currentTab = tab;
        currPage = 1;
        updateUrlParams({
            page: null,
        })
    }

    function changePage(page: number) {
        currPage = page;
        updateUrlParams({
            page: currPage > 1 ? currPage.toString() : null,
        })
    }
</script>

<svelte:head>
    {#if $profile}
        <title>{$profile.screenName}'s Works &mdash; Offprint</title>
        <!-- Primary Meta Tags -->
        <meta name="title" content="{$profile.screenName}'s Works on Offprint" />
        <meta name="description" content="Taking a look at {$profile.screenName}'s works" />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://offprint.net/profile/{$profile._id}" />
        <meta property="og:title" content="{$profile.screenName}'s Works on Offprint" />
        <meta property="og:description" content="Taking a look at {$profile.screenName}'s works" />
        <meta property="og:image" content={$profile.profile.avatar} />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://offprint.net/profile/{$profile._id}" />
        <meta property="twitter:title" content="{$profile.screenName}'s Works on Offprint" />
        <meta property="twitter:description" content="Taking a look at {$profile.screenName}'s works" />
        <meta property="twitter:image" content={$profile.profile.avatar} />
    {/if}
</svelte:head>

{#if $session && $session.currProfile && $profile && $session.currProfile._id === $profile._id}
    <div class="w-11/12 mx-auto lg:max-w-7xl mb-6">
        <div
            class="flex items-center justify-center border-t border-b border-zinc-700 dark:border-white py-1 w-full mb-6 max-w-3xl mx-auto"
        >
            <Button
                on:click={() => (changeTab(WorkTabs.Published))}
                isActive={currentTab === WorkTabs.Published}
            >
                <CheckLine class="button-icon" />
                <span class="button-text">Published</span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button
                on:click={() => (changeTab(WorkTabs.Drafts))}
                isActive={currentTab === WorkTabs.Drafts}
            >
                <DraftLine class="button-icon" />
                <span class="button-text">Drafts</span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button
                on:click={() => (changeTab(WorkTabs.Pending))}
                isActive={currentTab === WorkTabs.Pending}
            >
                <TimeLine class="button-icon" />
                <span class="button-text">Pending</span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button
                on:click={() => (changeTab(WorkTabs.Rejected))}
                isActive={currentTab === WorkTabs.Rejected}
            >
                <CloseLine class="button-icon" />
                <span class="button-text">Rejected</span>
            </Button>
        </div>
        {#if currentTab === WorkTabs.Published}
            {#await fetchAllByKind( $profile._id, [ContentKind.ProseContent, ContentKind.PoetryContent], )}
                <div class="w-full h-96 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line size="24px" class="animate-spin" />
                        <span class="text-sm uppercase tracking-widest font-bold">Loading...</span>
                    </div>
                </div>
            {:then works}
                {#if works.docs.filter((item) => item.audit.published === 'Published').length === 0}
                    <div class="empty">
                        <h3>You haven't published anything yet</h3>
                        <p>Head over to the Drafts tab to submit a work to the queue!</p>
                    </div>
                {:else}
                    <div
                        class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 w-11/12 mx-auto my-8"
                    >
                        {#each works.docs.filter((item) => item.audit.published === 'Published') as work}
                            <WorkCard content={work} />
                        {/each}
                    </div>
                {/if}
            {:catch error}
                <div class="empty">
                    <h3>Oops! Something went wrong!</h3>
                    <p>Something went wrong trying to fetch your blogs!</p>
                </div>
            {/await}
        {:else if currentTab === WorkTabs.Drafts}
            {#await fetchAllByKind( $profile._id, [ContentKind.ProseContent, ContentKind.PoetryContent], )}
                <div class="w-full h-96 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line size="24px" class="animate-spin" />
                        <span class="text-sm uppercase tracking-widest font-bold">Loading...</span>
                    </div>
                </div>
            {:then works}
                {#if works.docs.filter((item) => item.audit.published === 'Unpublished').length === 0}
                    <div class="empty">
                        <h3>You haven't published anything yet</h3>
                        <p>Head over to the Drafts tab to submit a work to the queue!</p>
                    </div>
                {:else}
                    <div
                        class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 w-11/12 mx-auto my-8"
                    >
                        {#each works.docs.filter((item) => item.audit.published === 'Unpublished') as work}
                            <WorkCard content={work} />
                        {/each}
                    </div>
                {/if}
            {:catch error}
                <div class="empty">
                    <h3>Oops! Something went wrong!</h3>
                    <p>Something went wrong trying to fetch your works!</p>
                </div>
            {/await}
        {:else if currentTab === WorkTabs.Pending}
            {#await fetchAllByKind( $profile._id, [ContentKind.ProseContent, ContentKind.PoetryContent], )}
                <div class="w-full h-96 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line size="24px" class="animate-spin" />
                        <span class="text-sm uppercase tracking-widest font-bold">Loading...</span>
                    </div>
                </div>
            {:then works}
                {#if works.docs.filter((item) => item.audit.published === 'Pending').length === 0}
                    <div class="empty">
                        <h3>You haven't published anything yet</h3>
                        <p>Head over to the Drafts tab to submit a work to the queue!</p>
                    </div>
                {:else}
                    <div
                        class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 w-11/12 mx-auto my-8"
                    >
                        {#each works.docs.filter((item) => item.audit.published === 'Pending') as work}
                            <WorkCard content={work} />
                        {/each}
                    </div>
                {/if}
            {:catch error}
                <div class="empty">
                    <h3>Oops! Something went wrong!</h3>
                    <p>Something went wrong trying to fetch your works!</p>
                </div>
            {/await}
        {:else if currentTab === WorkTabs.Rejected}
            {#await fetchAllByKind( $profile._id, [ContentKind.ProseContent, ContentKind.PoetryContent], )}
                <div class="w-full h-96 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line size="24px" class="animate-spin" />
                        <span class="text-sm uppercase tracking-widest font-bold">Loading...</span>
                    </div>
                </div>
            {:then works}
                {#if works.docs.filter((item) => item.audit.published === 'Rejected').length === 0}
                    <div class="empty">
                        <h3>Nothing's been rejected</h3>
                        <p>Keep up the good work!</p>
                    </div>
                {:else}
                    <div
                        class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 w-11/12 mx-auto my-8"
                    >
                        {#each works.docs.filter((item) => item.audit.published === 'Rejected') as work}
                            <WorkCard content={work} />
                        {/each}
                    </div>
                {/if}
            {:catch error}
                <div class="empty">
                    <h3>Oops! Something went wrong!</h3>
                    <p>Something went wrong trying to fetch your works!</p>
                </div>
            {/await}
        {/if}
    </div>
{:else}
    <div class="w-11/12 mx-auto lg:max-w-7xl mb-6">
        {#if !$session || !$session.account }
            <NotifyBanner
                message={ALPHA_MESSAGE}
            />
        {/if}
        {#await fetchUserContent(profileId, $app.filter, [ContentKind.ProseContent, ContentKind.PoetryContent], currPage)}
            <div class="w-full h-96 flex flex-col items-center justify-center">
                <div class="flex items-center">
                    <Loader5Line size="24px" class="animate-spin" />
                    <span class="text-sm uppercase tracking-widest font-bold">Loading...</span>
                </div>
            </div>
        {:then works}
            {#if works.docs.length === 0}
                <div class="empty">
                    <h3>Nothing's been published yet...</h3>
                    <p>Check back when this user has published a work!</p>
                </div>
            {:else}
                <div class="w-full overflow-y-auto">
                    <div class="w-11/12 mx-auto my-8 max-w-7xl">
                        <div
                            class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2"
                        >
                            {#each works.docs as work}
                                <WorkCard content={work} />
                            {/each}
                        </div>
                        <Paginator
                            {currPage}
                            totalPages={works.totalPages}
                            on:change={(e) => changePage(e.detail)}
                        />
                    </div>
                </div>
            {/if}
        {:catch error}
            <div class="empty">
                <h3>Oops! Something went wrong!</h3>
                <p>Something went wrong trying to fetch this user's works!</p>
            </div>
        {/await}
    </div>
{/if}
