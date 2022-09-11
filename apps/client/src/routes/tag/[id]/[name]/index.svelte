<script lang="ts" context="module">
    import WorkCard from "$lib/components/ui/content/WorkCard.svelte";

    import Paginator from "$lib/components/ui/misc/Paginator.svelte";

    import type { Content } from "$lib/models/content";
    import type { TagsModel, TagsTree } from "$lib/models/content/works";

    import type { PaginateResult } from "$lib/models/util";
    import { app } from "$lib/repo/app.repo";
    import { search, setCurrentTag, setFilter } from "$lib/repo/search.repo";
    import { findRelatedContent, SearchOptions } from "$lib/services/search.service";
    import { fetchDescendants } from "$lib/services/tags.service";
    import { updateUrlParams } from "$lib/util";
    import type { Load } from "@sveltejs/kit";
    import { get } from "svelte/store";
    import { slugify } from '$lib/util';
    import Button from "$lib/components/ui/misc/Button.svelte";
    import { ArrowDownSLine, ArrowUpSLine } from "svelte-remixicon";
    import { fly, fade } from 'svelte/transition';

    export const load: Load = async ({ params, url }) => {
        const tagId = params.id;
        const page =  url.searchParams.has('page') ? +url.searchParams.get('page') : 1;
        setCurrentTag(tagId, page);

        return {
            props: {
                tagId,
            },
        };
    }
</script>
<script lang="ts">
    export let tagId: string;

    let contentResults: PaginateResult<Content>;
    let tagsTree: TagsTree;
    let parent: TagsModel;
    let pageTitle: string;

    let showDesc = true;

    // Calls whenever $app.filter changes
    $: setFilter($app.filter);
    // Calls whenever $search changes
    $: {
        updateContentResults($search);
    }
    // Calls whenever tagId changes
    $: {
        updateTagsTree(tagId);
    }

    async function updateContentResults(options: SearchOptions) {
        contentResults = await findRelatedContent(options);
    }

    async function updateTagsTree(id: string) {
        tagsTree = await fetchDescendants(id);
        parent = tagsTree.parent as TagsModel;
        pageTitle = parent? parent.name + " — " + tagsTree.name : tagsTree.name;
    }

    async function setNewPage(currPage: number) {
        $search.page = currPage;
        updateUrlParams({
            page: currPage > 1 ? currPage.toString() : null,
        })
        contentResults = await findRelatedContent($search);
    }
</script>

<svelte:head>
    {#if tagsTree}
        <title>{pageTitle} &mdash; Offprint</title>
        <!-- Primary Meta Tags -->
        <meta name="title" content={pageTitle} />
        <meta name="description" content={tagsTree.desc} />

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website" />
        <meta
            property="og:url"
            content="https://offprint.net/tag/{tagsTree._id}/{slugify(
                tagsTree.name,
            )}"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={tagsTree.desc} />

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta
            property="twitter:url"
            content="https://offprint.net/tag/{tagsTree._id}/{slugify(
                tagsTree.name,
            )}"
        />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={tagsTree.desc} />
    {/if}
</svelte:head>

<div class="w-full h-screen overflow-y-auto">
    {#if tagsTree}
        <div class="tag-header py-6">
            <div class="w-11/12 mx-auto">
                <div class="text-xl">
                    {#if parent}
                        <a
                            href="/tag/{parent._id}/{slugify(parent.name)}"
                            class="font-light text-white"
                        >{parent.name}</a>
                        &nbsp;— 
                    {/if}
                    <span>{tagsTree.name}</span>
                </div>
                {#if tagsTree.children && tagsTree.children.length > 0}
                    <span>Child Tags: </span>
                    {#each tagsTree.children as child, index}
                        <a
                            href="/tag/{child._id}/{slugify(child.name)}"
                            class="font-light text-white"
                        >{child.name}</a>
                        {#if index < tagsTree.children.length - 1}
                            <span>, </span>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
        {#if tagsTree.desc}
            <div class="w-11/12 mx-auto my-6">
                <div in:fade={{ delay: 0, duration: 150 }}>
                    <div
                        class="w-11/12 border-b border-zinc-700 dark:border-white flex items-center pb-1"
                    >
                        <h3 class="text-xl font-medium flex-1">Description</h3>
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
                            {@html tagsTree.desc}
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    {/if}
    {#if contentResults && contentResults.totalDocs > 0}
        <div
            class="w-11/12 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4"
        >
            {#each contentResults.docs.filter((work) => work.author !== null) as work}
                <WorkCard content={work} />
            {/each}
        </div>
        <Paginator
            currPage={$search.page}
            totalPages={contentResults.totalPages}
            on:change={(e) => setNewPage(e.detail)}
        />
    {:else}
        <div class="w-full flex flex-col items-center justify-center h-96">
            <div class="flex items-center">
                <span class="uppercase tracking-widest font-bold">No results found</span>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    div.tag-header {
        @apply w-full text-white shadow-lg mb-6;
        background: var(--accent);
    }
</style>
