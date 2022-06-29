<script lang="ts" context="module">
    import { get } from 'svelte/store';
    import type { Load } from '@sveltejs/kit';
    import { session } from '$lib/repo/session.repo';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';

    export const load: Load = async ({ params }) => {
        const shelfId: string = params.id;

        return {
            props: {
                shelfId,
            },
        };
    };
</script>

<script lang="ts">
    import { useQuery } from '@sveltestack/svelte-query';
    import type { Bookshelf } from '$lib/models/content/library';
    import { CloseLine, InformationLine, Loader5Line } from 'svelte-remixicon';
    import BookshelfHeader from '$lib/components/ui/content/BookshelfHeader.svelte';
    import { fetchShelfItems } from '$lib/services/content-library.service';
    import { onMount } from 'svelte';
    import { fetchShelf } from '$lib/services/content-library.service';

    export let shelfId: string;
    let shelf: Bookshelf;

    onMount(async () => {
        shelf = await fetchShelf($session.currProfile._id, shelfId);
    })

    const thisShelf = useQuery('shelfPage', () => fetchShelf($session.currProfile._id, shelf._id), {
        initialData: shelf,
        enabled: !!$session.currProfile && !!shelf,
    });

    const shelfItems = useQuery(
        'shelfItems',
        () => fetchShelfItems($session.currProfile._id, shelf._id),
        {
            enabled: !!$session.currProfile && !!shelf,
            keepPreviousData: true,
        },
    );
</script>

{#if $thisShelf.isLoading}
    <div class="h-screen flex flex-col items-center justify-center">
        <div class="flex items-center">
            <Loader5Line class="mr-2 animate-spin" size="24px" />
            <span class="text-lg uppercase font-bold tracking-widest">Loading...</span>
        </div>
    </div>
{:else if $thisShelf.isError}
    <div class="h-screen flex flex-col items-center justify-center">
        <div class="flex items-center">
            <CloseLine class="mr-2" size="24px" />
            <span class="text-lg uppercase font-bold tracking-widest">
                Error fetching this shelf!
            </span>
        </div>
    </div>
{:else}
    <div class="flex-1 h-screen overflow-y-auto">
        <div class="w-11/12 mx-auto md:max-w-4xl my-6">
            <BookshelfHeader shelf={$thisShelf.data} showTools={true} />
            {#if $shelfItems.isLoading}
                <div class="h-96 w-full flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line class="mr-2 animate-spin" size="24px" />
                        <span class="text-lg uppercase font-bold tracking-widest">Loading...</span>
                    </div>
                </div>
            {:else if $shelfItems.isError}
                <div class="h-96 w-full flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <CloseLine class="mr-2" size="24px" />
                        <span class="text-lg uppercase font-bold tracking-widest"
                            >Error fetching shelf items!</span
                        >
                    </div>
                </div>
            {:else if $shelfItems.data.length > 0}
                <div
                    class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 w-11/12 mx-auto my-8"
                >
                    {#each $shelfItems.data as work}
                        <WorkCard content={work.content} />
                    {/each}
                </div>
            {:else}
                <div class="h-96 w-full flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <InformationLine class="mr-2" size="24px" />
                        <span class="text-lg uppercase font-bold tracking-widest"
                            >You haven't added anything here yet</span
                        >
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}
