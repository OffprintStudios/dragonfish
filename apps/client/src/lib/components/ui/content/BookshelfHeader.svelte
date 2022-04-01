<script lang="ts">
    import { useMutation } from '@sveltestack/svelte-query';
    import { session } from '$lib/repo/session.repo';
    import { pluralize, localeDate, queryClient } from '$lib/util';
    import type { Bookshelf } from '$lib/models/content/library';
    import {
        BarChart2Fill,
        DeleteBinLine,
        Edit2Line,
        LockLine,
        LockUnlockFill,
    } from 'svelte-remixicon';
    import { toggleVisibility } from '$lib/services/content-library.service';
    import Button from '$lib/components/ui/misc/Button.svelte';

    export let shelf: Bookshelf;
    export let showTools = false;

    const changeVisibility = useMutation(
        (shelfId: string) =>
            toggleVisibility($session.currProfile ? $session.currProfile._id : '', shelfId),
        {
            onMutate: async (updatedShelf) => {
                await queryClient.cancelQueries('shelfPage');
                const previousShelf = queryClient.getQueryData<Bookshelf>('shelfPage');
                queryClient.setQueryData('shelfPage', updatedShelf);
                return { previousShelf };
            },
            onError: (err, updatedShelf, context) => {
                queryClient.setQueryData('shelfPage', context.previousShelf);
            },
            onSettled: () => {
                queryClient.invalidateQueries('shelfPage');
            },
        },
    );
</script>

<div class="shelf-header">
    <div class="shelf-cover">
        <BarChart2Fill size="36px" />
    </div>
    <div class="shelf-info">
        <h3 class="text-3xl font-medium text-white">{shelf.name}</h3>
        <span>{shelf.desc ? shelf.desc : ''}</span>
        <span class="italic">
            {localeDate(shelf.createdAt, 'mediumDate')} • {shelf.works} work{pluralize(shelf.works)}
        </span>
    </div>
</div>
{#if $session.currProfile && $session.currProfile?._id === shelf.userId && showTools}
    <div class="shelf-tools">
        <Button kind="primary">
            <Edit2Line class="button-icon" />
            <span class="button-text">Edit</span>
        </Button>
        <div class="mx-1"><!--separator--></div>
        {#if shelf.public}
            <Button kind="primary" on:click={() => $changeVisibility.mutate(shelf._id)} isActive>
                <LockUnlockFill class="button-icon" />
                <span class="button-text">Public</span>
            </Button>
        {:else}
            <Button kind="primary" on:click={() => $changeVisibility.mutate(shelf._id)}>
                <LockLine class="button-icon" />
                <span class="button-text">Private</span>
            </Button>
        {/if}
        <div class="flex-1"><!--separator--></div>
        <Button kind="primary">
            <DeleteBinLine class="button-icon" />
            <span class="button-text">Delete</span>
        </Button>
    </div>
{/if}

<style lang="scss">
    div.shelf-header {
        @apply w-full rounded-lg p-4 flex items-center relative shadow-2xl z-10;
        background: var(--accent);
        div.shelf-cover {
            @apply w-36 h-36 border-4 rounded-lg border-white flex flex-col items-center justify-center mr-4;
        }
        div.shelf-info {
            @apply flex-1 flex flex-col text-white;
        }
    }
    div.shelf-tools {
        @apply w-10/12 mx-auto rounded-b-lg p-2 flex items-center relative;
        background: var(--accent);
    }
</style>
