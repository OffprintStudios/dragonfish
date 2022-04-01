<script lang="ts">
    import { session } from '$lib/repo/session.repo';
    import { fetchLibrary } from '$lib/services/content-library.service';
    import { Loader5Line } from 'svelte-remixicon';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import { useQuery } from '@sveltestack/svelte-query';

    const library = useQuery('library', () => fetchLibrary($session.currProfile?._id), {
        enabled: !!$session.currProfile,
    });
</script>

{#if $session.currProfile}
    {#if $library.isLoading}
        <div class="h-screen flex-1 flex flex-col items-center justify-center">
            <div class="flex items-center">
                <Loader5Line class="mr-2" size="24px" />
                <span class="uppercase font-bold tracking-widest">Loading...</span>
            </div>
        </div>
    {:else if $library.isError}
        <div class="empty">
            <h3>Oops! Something went wrong!</h3>
            <p>
                There was an error fetching your library.<br />Please contact site administration
                for assistance.
            </p>
        </div>
    {:else if $library.data.length > 0}
        <div class="w-full overflow-y-auto">
            <div class="w-11/12 mx-auto my-6 max-w-7xl">
                <div
                    class="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mb-6"
                >
                    {#each $library.data as item}
                        <WorkCard content={item.content} />
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <div class="empty">
            <h3>You haven't added anything yet...</h3>
            <p>Add some content by hitting the "Add To Library" button on any work on Offprint</p>
        </div>
    {/if}
{:else}
    <div class="empty">
        <h3>You haven't selected a profile...</h3>
        <p>Please select a profile to view this page.</p>
    </div>
{/if}
