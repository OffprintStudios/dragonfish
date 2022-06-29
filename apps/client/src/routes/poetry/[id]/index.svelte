<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import { setContent } from '$lib/repo/content.repo';

    export const load: Load = async ({ params }) => {
        const poetryId: string = params.id;

        setContent(null);
        return {
            props: {
                poetryId,
            },
        };
    };
</script>

<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { ALPHA_MESSAGE, slugify } from '$lib/util';
    import { content } from '$lib/repo/content.repo';
    import WorkBanner from '$lib/components/ui/content/WorkBanner.svelte';
    import { ArrowDownSLine, ArrowUpSLine } from 'svelte-remixicon';
    import SectionList from '$lib/components/ui/content/SectionList.svelte';
    import Comments from '$lib/components/comments/Comments.svelte';
    import ApprovalOptions from '$lib/components/ui/content/ApprovalOptions.svelte';
    import WorkStats from '$lib/components/ui/content/WorkStats.svelte';
    import EditForm from './_forms/EditForm.svelte';
    import { NotifyBanner, Button } from '$lib/components/ui/misc';
    import { Content, PubStatus } from '$lib/models/content';
    import { session } from '$lib/repo/session.repo';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchOne } from '$lib/services/content.service';
    import { Comment, CommentKind } from '$lib/models/comments';
    import { getPage } from '$lib/repo/comments.repo';
    import type { PaginateResult } from '$lib/models/util';

    export let poetryId: string;

    let showDesc = true;
    let editMode = false;
    let currPage = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;
    let poetry: Content;
    let comments: PaginateResult<Comment>;

    onMount(async () => {
        poetry = await fetchOne(
            poetryId,
            $session.currProfile ? $session.currProfile._id : undefined,
        );
        setContent(poetry);
        comments = await getPage(poetryId, CommentKind.ContentComment, currPage);
    })
</script>

<svelte:head>
    {#if $content && $content.content}
        <title>{$content.content.title} &mdash; Offprint</title>
        <!-- Primary Meta Tags -->
        <meta name="title" content={$content.content.title} />
        <meta name="description" content={$content.content.desc} />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta
            property="og:url"
            content="https://offprint.net/prose/{$content.content._id}/{slugify(
                $content.content.title,
            )}"
        />
        <meta property="og:title" content={$content.content.title} />
        <meta property="og:description" content={$content.content.desc} />
        <meta
            property="og:image"
            content={$content.content.meta.coverArt
                ? $content.content.meta.coverArt
                : $content.content.author.profile.avatar}
        />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta
            property="twitter:url"
            content="https://offprint.net/prose/{$content.content._id}/{slugify(
                $content.content.title,
            )}"
        />
        <meta property="twitter:title" content={$content.content.title} />
        <meta property="twitter:description" content={$content.content.desc} />
        <meta
            property="twitter:image"
            content={$content.content.meta.coverArt
                ? $content.content.meta.coverArt
                : $content.content.author.profile.avatar}
        />
    {/if}
</svelte:head>

{#if $content && $content.content}
    <div class="w-full h-screen overflow-y-auto">
        <WorkBanner />
        {#if !$session || !$session.account }
            <NotifyBanner
                message={ALPHA_MESSAGE}
            />
        {/if}
        {#if $content.content.audit.published === PubStatus.Unpublished}
            <NotifyBanner
                message="<b>This work is a draft.</b> No views will be counted when navigating to
                                this page, and comments and upvotes/downvotes are disabled."
            />
        {/if}
        <ApprovalOptions />
        <div class="w-11/12 mx-auto md:max-w-4xl my-6 flex flex-col md:flex-row">
            <WorkStats
                content={$content.content}
                libraryDoc={$content.libraryDoc}
                bind:editMode
                on:save={() => console.log('save hit!')}
            />
            <div class="w-full">
                {#if editMode}
                    <EditForm on:saved={() => (editMode = false)} />
                {:else}
                    <div in:fade={{ delay: 0, duration: 150 }}>
                        <div class="mb-6">
                            <div
                                class="w-full border-b border-zinc-700 dark:border-white flex items-center pb-1"
                            >
                                <h3 class="text-2xl font-medium flex-1">Description</h3>
                                <Button on:click={() => (showDesc = !showDesc)}>
                                    {#if showDesc}
                                        <ArrowUpSLine class="button-icon no-text" />
                                    {:else}
                                        <ArrowDownSLine class="button-icon no-text" />
                                    {/if}
                                </Button>
                            </div>
                            {#if showDesc}
                                <div
                                    class="html-description"
                                    transition:fly|local={{ delay: 0, duration: 150, y: -25 }}
                                >
                                    {@html $content.content.body}
                                </div>
                            {/if}
                        </div>
                        <SectionList baseUrl="/prose/{$content.content._id}" />
                    </div>
                {/if}
            </div>
        </div>
        {#if $content.content.audit.published === 'Published'}
            <div class="w-11/12 md:w-full max-w-3xl mx-auto mt-6">
                <Comments />
            </div>
        {/if}
    </div>
{/if}
