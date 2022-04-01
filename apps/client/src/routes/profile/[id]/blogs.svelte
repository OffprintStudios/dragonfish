<script lang="ts">
    import { page } from '$app/stores';
    import { profile } from '$lib/repo/profile.repo';
    import { session } from '$lib/repo/session.repo';
    import { slugify } from '$lib/util';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CheckLine, DraftLine, Loader5Line, TimeLine } from 'svelte-remixicon';
    import { fetchAllByKind, fetchUserContent } from '$lib/services/content.service';
    import { ContentKind } from '$lib/models/content';
    import BlogCard from '$lib/components/ui/content/BlogCard.svelte';
    import { app } from '$lib/repo/app.repo';

    enum BlogTabs {
        Published,
        Drafts,
        Scheduled,
    }

    let currentTab = BlogTabs.Published;

    const pageNum = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;
</script>

<svelte:head>
    <title>{$profile.screenName}'s Blogs &mdash; Offprint</title>
    <!-- Primary Meta Tags -->
    <meta name="title" content="{$profile.screenName}'s Blogs on Offprint" />
    <meta name="description" content="Taking a look at {$profile.screenName}'s blogs" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://offprint.net/profile/{$profile._id}" />
    <meta property="og:title" content="{$profile.screenName}'s Blogs on Offprint" />
    <meta property="og:description" content="Taking a look at {$profile.screenName}'s blogs" />
    <meta property="og:image" content={$profile.profile.avatar} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://offprint.net/profile/{$profile._id}" />
    <meta property="twitter:title" content="{$profile.screenName}'s Blogs on Offprint" />
    <meta property="twitter:description" content="Taking a look at {$profile.screenName}'s blogs" />
    <meta property="twitter:image" content={$profile.profile.avatar} />
</svelte:head>

{#if $session.currProfile && $session.currProfile._id === $profile._id}
    <div class="w-11/12 lg:max-w-3xl mx-auto flex flex-col mb-6">
        <div
            class="flex items-center justify-center border-t border-b border-zinc-700 dark:border-white py-1 w-full mb-6"
        >
            <Button
                on:click={() => (currentTab = BlogTabs.Published)}
                isActive={currentTab === BlogTabs.Published}
            >
                <CheckLine class="button-icon" />
                <span class="button-text">Published</span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button
                on:click={() => (currentTab = BlogTabs.Drafts)}
                isActive={currentTab === BlogTabs.Drafts}
            >
                <DraftLine class="button-icon" />
                <span class="button-text">Drafts</span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button
                on:click={() => (currentTab = BlogTabs.Scheduled)}
                isActive={currentTab === BlogTabs.Scheduled}
            >
                <TimeLine class="button-icon" />
                <span class="button-text">Scheduled</span>
            </Button>
        </div>
        {#if currentTab === BlogTabs.Published}
            {#await fetchAllByKind($profile._id, [ContentKind.BlogContent])}
                <div class="w-full h-96 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line size="24px" class="animate-spin" />
                        <span class="text-sm uppercase tracking-widest font-bold">Loading...</span>
                    </div>
                </div>
            {:then blogs}
                {#if blogs.docs.filter((item) => item.audit.published === 'Published').length === 0}
                    <div class="empty">
                        <h3>You haven't published anything yet</h3>
                        <p>Head over to the Drafts tab to publish a blog!</p>
                    </div>
                {:else}
                    {#each blogs.docs.filter((item) => item.audit.published === 'Published') as blog}
                        <div class="my-3">
                            <BlogCard {blog} />
                        </div>
                    {/each}
                {/if}
            {:catch error}
                <div class="empty">
                    <h3>Oops! Something went wrong!</h3>
                    <p>Something went wrong trying to fetch your blogs!</p>
                </div>
            {/await}
        {:else if currentTab === BlogTabs.Drafts}
            {#await fetchAllByKind($profile._id, [ContentKind.BlogContent])}
                <div class="w-full h-96 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line size="24px" class="animate-spin" />
                        <span class="text-sm uppercase tracking-widest font-bold">Loading...</span>
                    </div>
                </div>
            {:then blogs}
                {#if blogs.docs.filter((item) => item.audit.published === 'Unpublished').length === 0}
                    <div class="empty">
                        <h3>You haven't posted anything yet</h3>
                        <p>Head over to the Create menu to make a blog!</p>
                    </div>
                {:else}
                    {#each blogs.docs.filter((item) => item.audit.published === 'Unpublished') as blog}
                        <div class="my-3">
                            <BlogCard {blog} />
                        </div>
                    {/each}
                {/if}
            {:catch error}
                <div class="empty">
                    <h3>Oops! Something went wrong!</h3>
                    <p>Something went wrong trying to fetch your blogs!</p>
                </div>
            {/await}
        {:else if currentTab === BlogTabs.Scheduled}
            <div class="empty">
                <h3>Pardon our dust—</h3>
                <p>This feature is not yet available!</p>
            </div>
        {/if}
    </div>
{:else}
    <div class="w-11/12 lg:max-w-3xl mx-auto flex flex-col mb-6">
        {#await fetchUserContent($profile._id, $app.filter, [ContentKind.BlogContent], pageNum)}
            <div class="w-full h-96 flex flex-col items-center justify-center">
                <div class="flex items-center">
                    <Loader5Line size="24px" class="animate-spin" />
                    <span class="text-sm uppercase tracking-widest font-bold">Loading...</span>
                </div>
            </div>
        {:then blogs}
            {#if blogs.docs.length === 0}
                <div class="empty">
                    <h3>Nothing's been posted yet...</h3>
                    <p>Check back when this user has posted a blog!</p>
                </div>
            {:else}
                {#each blogs.docs as blog}
                    <div class="my-3">
                        <BlogCard {blog} />
                    </div>
                {/each}
            {/if}
        {:catch error}
            <div class="empty">
                <h3>Oops! Something went wrong!</h3>
                <p>Something went wrong trying to fetch this user's blogs!</p>
            </div>
        {/await}
    </div>
{/if}
