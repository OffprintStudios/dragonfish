<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit';
    import { fetchShelf } from '$lib/services/content-library.service';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';

    export const load: Load = async ({ params }) => {
        const profileId: string = params.id;
        const shelfId: string = params.shelfId;

        return {
            props: {
                profileId,
                shelfId,
            },
        };
    };
</script>

<script lang="ts">
    import { useQuery } from '@sveltestack/svelte-query';
    import { CloseLine, InformationLine, Loader5Line } from 'svelte-remixicon';
    import BookshelfHeader from '$lib/components/ui/content/BookshelfHeader.svelte';
    import { fetchShelfItems } from '$lib/services/content-library.service';

    export let profileId: string;
    export let shelfId: string;

    const thisShelf = useQuery('shelfPage', () => fetchShelf(profileId, shelfId),);

    const shelfItems = useQuery('shelfItems', () => fetchShelfItems(profileId, shelfId), {
        keepPreviousData: true,
    });
</script>

{#if $thisShelf.isLoading}
    <div class="min-h-screen md:h-screen flex flex-col items-center justify-center">
        <div class="flex items-center">
            <Loader5Line class="mr-2 animate-spin" size="24px" />
            <span class="text-lg uppercase font-bold tracking-widest">Loading...</span>
        </div>
    </div>
{:else if $thisShelf.isError}
    <div class="min-h-screen md:h-screen flex flex-col items-center justify-center">
        <div class="flex items-center">
            <CloseLine class="mr-2" size="24px" />
            <span class="text-lg uppercase font-bold tracking-widest">
                Error fetching this shelf!
            </span>
        </div>
    </div>
{:else}
    <div class="min-h-screen md:h-screen w-11/12 mx-auto md:max-w-4xl mb-6">
        <BookshelfHeader shelf={$thisShelf.data} />
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
                    <WorkCard content={work} />
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
{/if}
