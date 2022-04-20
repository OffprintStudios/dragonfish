<script lang="ts">
    import { page } from '$app/stores';
    import { useMutation, useQuery } from '@sveltestack/svelte-query';
    import { fetchFollowing, unfollowUser } from '$lib/services/profile.service';
    import { session } from '$lib/repo/session.repo';
    import type { Profile } from '$lib/models/accounts';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CloseLine, Loader5Line, UserUnfollowLine } from 'svelte-remixicon';
    import { queryClient, updateUrlParams } from '$lib/util';
    import { goto } from '$app/navigation';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import { Paginator } from '$lib/components/ui/misc';
    import { PaginateResult } from '$lib/models/util';
    import { Content, ContentKind, ContentSorting } from '$lib/models/content';
    import { fetchUserContent } from '$lib/services/content.service';
    import { app } from '$lib/repo/app.repo';

    const userId = $page.params.userId;
    let currPage = $page.url.searchParams.has('page') ? +$page.url.searchParams.get('page') : 1;
    let loading = false;

    async function fetchPage(page: number) {
        loading = true;
        currPage = page;
        updateUrlParams({
            page: currPage > 1 ? currPage.toString() : null,
        })

        return await fetchUserContent(
            currFollow.itemId._id,
            $app.filter,
            [ContentKind.PoetryContent, ContentKind.ProseContent],
            currPage,
            ContentSorting.UpdatedFirst,
        ).then((res) => {
            loading = false;
            return res;
        })
    }

    const followsList = useQuery('followsList', () => fetchFollowing($session.currProfile?._id), {
        enabled: !!$session.currProfile && !!$session.account,
    });

    $: currFollow =
        $followsList.data && $followsList.data.length > 0 ?
            $followsList.data.find(follow => (follow.itemId as Profile)._id === userId)
            : null;

    const unfollowUserMutation = useMutation(
        () => unfollowUser($session.currProfile._id, currFollow.itemId._id),
        {
            onSuccess: () => {
                queryClient.refetchQueries('followsList');
                goto('/explore');
            },
        },
    );
</script>

<div class="w-11/12 mx-auto max-w-7xl">
    {#if $followsList.data && currFollow !== null}
        <div class="flex items-center mb-6">
            <h1 class="font-medium text-2xl md:text-4xl flex-1">{currFollow.itemId.screenName}'s Latest</h1>
            <Button on:click={$unfollowUserMutation.mutateAsync} loading={$unfollowUserMutation.isLoading}>
                <span class="button-icon"><UserUnfollowLine /></span>
                <span class="button-text">Unfollow</span>
            </Button>
        </div>
    {/if}
    {#await fetchPage(currPage)}
        <div class="w-full flex flex-col items-center justify-center h-48 md:h-96">
            <div class="flex items-center">
                <Loader5Line class="animate-spin mr-2" size="24px" />
                <span class="uppercase tracking-widest font-bold">Loading...</span>
            </div>
        </div>
    {:then data}
        {#if data.totalDocs > 0}
            <div class="w-full">
                <div class="w-11/12 mx-auto my-6 max-w-7xl">
                    <div
                        class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
                    >
                        {#each data.docs.filter((work) => work.author !== null) as work}
                            <WorkCard content={work} />
                        {/each}
                    </div>
                    <Paginator
                        {currPage}
                        totalPages={data.totalPages}
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
    {:catch error}
        <div class="w-full flex flex-col items-center justify-center h-48 md:h-96">
            <div class="flex items-center">
                <CloseLine class="mr-2" size="24px" />
                <span class="uppercase tracking-widest font-bold">Error fetching content</span>
            </div>
        </div>
    {/await}
</div>