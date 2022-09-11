<script lang="ts">
    import { page } from '$app/stores';
    import { fetchAllNew } from '$lib/services/content.service';
    import { Content, ContentKind } from '$lib/models/content';
    import { app } from '$lib/repo/app.repo';
    import { Loader5Line } from 'svelte-remixicon';
    import Paginator from '$lib/components/ui/misc/Paginator.svelte';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import { updateUrlParams } from '$lib/util';
    import { onMount } from 'svelte';
    import type { PaginateResult } from '$lib/models/util';
    import { ALPHA_MESSAGE } from '$lib/util';
    import { session } from '$lib/repo/session.repo';
    import { NotifyBanner } from '$lib/components/ui/misc';

    let currPage = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;
    let contentResults: PaginateResult<Content> = null;
    let loading = false;

    onMount(async () => {
        await fetchPage(currPage);
    })

    async function fetchPage(page: number) {
        loading = true;
        currPage = page;
        updateUrlParams({
            page: currPage > 1 ? currPage.toString() : null,
        })

        contentResults = await fetchAllNew(
            currPage,
            [ContentKind.PoetryContent, ContentKind.ProseContent],
            $app.filter
        ).then((res) => {
            loading = false;
            return res;
        })
    }
</script>

<svelte:head>
    <title>New Works &mdash; Offprint</title>
</svelte:head>

<div class="w-full h-screen md:overflow-y-auto">
    {#if !$session || !$session.account }
        <NotifyBanner
            message={ALPHA_MESSAGE}
        />
    {/if}
    {#if loading}
        <div class="w-full flex flex-col items-center justify-center h-48 md:h-96">
            <div class="flex items-center">
                <Loader5Line class="animate-spin mr-2" size="24px" />
                <span class="uppercase tracking-widest font-bold">Loading...</span>
            </div>
        </div>
    {:else if contentResults && contentResults.totalDocs > 0}
        <div class="w-full">
            <div class="w-11/12 mx-auto my-6 max-w-7xl">
                <div
                    class="w-11/12 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4"
                >
                    {#each contentResults.docs.filter((work) => work.author !== null) as work}
                        <WorkCard content={work} />
                    {/each}
                </div>
                <Paginator
                    {currPage}
                    totalPages={contentResults.totalPages}
                    on:change={(e) => fetchPage(e.detail)}
                />
            </div>
        </div>
    {:else}
        <div class="w-full flex flex-col items-center justify-center h-96">
            <div class="flex items-center">
                <span class="uppercase tracking-widest font-bold">No results found</span>
            </div>
        </div>
    {/if}
</div>
