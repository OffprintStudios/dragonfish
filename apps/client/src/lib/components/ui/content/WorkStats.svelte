<script lang="ts">
    import { session } from '$lib/repo/session.repo';
    import type { Content } from '$lib/models/content';
    import {
        CloseLine,
        Edit2Line,
        CheckboxCircleLine,
        CheckboxBlankCircleLine,
        TimeLine,
        CloseCircleLine,
        DeleteBinLine,
        CheckboxLine,
        AddBoxLine,
        ShareBoxLine,
        FlagLine,
    } from 'svelte-remixicon';
    import { pluralize, localeDate, abbreviate } from '$lib/util';
    import { Button } from '$lib/components/ui/misc';
    import type { ContentLibrary } from '$lib/models/content/library';
    import { ContentKind } from '$lib/models/content';
    import { submitToQueue, updateLibraryDoc } from '$lib/repo/content.repo';
    import { addToLibrary } from '$lib/services/content-library.service';

    export let content: Content;
    export let libraryDoc: ContentLibrary = null;
    export let editMode = false;

    async function processSubmission() {
        if (content.stats.words < 750 && content.kind === ContentKind.ProseContent) {
            alert(`You must have at least 750 words in your work in order to submit to the queue`);
            return;
        }

        await submitToQueue($session.currProfile._id, content._id);
    }

    async function addContentToLibrary() {
        if ($session.currProfile) {
            const newDoc = await addToLibrary($session.currProfile._id, content._id);
            updateLibraryDoc(newDoc);
        }
    }

    async function removeContentFromLibrary() {
        if ($session.currProfile) {
            await addToLibrary($session.currProfile._id, content._id);
            updateLibraryDoc(null);
        }
    }
</script>

<div
    class="flex flex-col w-full md:mr-6 md:max-w-[128px] md:max-h-[35.875rem] md:mb-0 rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed mb-6"
>
    <div class="flex items-center md:flex-col p-2 border-b-2 border-zinc-500">
        {#if $session.currProfile && $session.currProfile._id === content.author._id}
            {#if editMode}
                <Button
                    classes="md:w-full md:justify-center"
                    on:click={() => (editMode = !editMode)}
                >
                    <CloseLine class="button-icon" />
                    <span class="button-text">Cancel</span>
                </Button>
            {:else}
                <Button
                    classes="md:w-full md:justify-center"
                    on:click={() => (editMode = !editMode)}
                >
                    <Edit2Line class="button-icon" />
                    <span class="button-text">Edit</span>
                </Button>
            {/if}
            <div class="mx-0.5 md:mx-0 md:my-0.5" />
            {#if content.audit.published === 'Published'}
                <Button classes="md:w-full md:justify-center" disabled={editMode}>
                    <CheckboxCircleLine class="button-icon" />
                    <span class="button-text">Published</span>
                </Button>
            {:else if content.audit.published === 'Unpublished'}
                <Button
                    classes="md:w-full md:justify-center"
                    disabled={editMode}
                    on:click={processSubmission}
                >
                    <CheckboxBlankCircleLine class="button-icon" />
                    <span class="button-text">Draft</span>
                </Button>
            {:else if content.audit.published === 'Pending'}
                <Button classes="md:w-full md:justify-center" disabled={editMode}>
                    <TimeLine class="button-icon" />
                    <span class="button-text">Pending</span>
                </Button>
            {:else if content.audit.published === 'Rejected'}
                <Button classes="md:w-full md:justify-center" disabled={editMode}>
                    <CloseCircleLine class="button-icon" />
                    <span class="button-text">Rejected</span>
                </Button>
            {/if}
            <div class="flex-1 md:flex-auto md:my-0.5" />
            <Button
                classes="md:w-full md:justify-center"
                disabled={editMode}
                on:click={() => console.log(`Delete button hit!`)}
            >
                <DeleteBinLine class="button-icon" />
                <span class="button-text">Delete</span>
            </Button>
        {:else}
            {#if libraryDoc && $session.currProfile}
                <Button classes="md:w-full md:justify-center" on:click={removeContentFromLibrary}>
                    <CheckboxLine class="button-icon" />
                    <span class="button-text">Added</span>
                </Button>
            {:else if $session.currProfile}
                <Button classes="md:w-full md:justify-center" on:click={addContentToLibrary}>
                    <AddBoxLine class="button-icon" />
                    <span class="button-text">Library</span>
                </Button>
            {/if}
            <div class="mx-0.5 md:mx-0 md:my-0.5" />
            <Button classes="md:w-full md:justify-center">
                <ShareBoxLine class="button-icon" />
                <span class="button-text">Share</span>
            </Button>
            <div class="flex-1 md:flex-auto md:my-0.5" />
            <Button classes="md:w-full md:justify-center">
                <FlagLine class="button-icon" />
                <span class="button-text">Report</span>
            </Button>
        {/if}
    </div>
    <div class="flex items-center justify-center overflow-y-auto md:overflow-y-hidden md:flex-col">
        <div class="stat-box border-r-2 md:border-r-0 md:border-b-2 border-zinc-500">
            {#if content.audit.publishedOn}
                <span class="text text-zinc-500 dark:text-zinc-400">Published</span>
                <span class="stat">
                    {localeDate(content.audit.publishedOn, 'mediumDate')}
                </span>
            {:else}
                <span class="text text-zinc-500 dark:text-zinc-400">Created</span>
                <span class="stat">
                    {localeDate(content.createdAt, 'mediumDate')}
                </span>
            {/if}
        </div>
        <div class="stat-box border-r-2 md:border-r-0 md:border-b-2 border-zinc-500">
            <span class="text text-zinc-500 dark:text-zinc-400">
                View{pluralize(content.stats.views)}
            </span>
            <span class="stat">{abbreviate(content.stats.views)}</span>
        </div>
        <div class="stat-box border-r-2 md:border-r-0 md:border-b-2 border-zinc-500">
            <span class="text text-zinc-500 dark:text-zinc-400">
                Word{pluralize(content.stats.words)}
            </span>
            <span class="stat">{abbreviate(content.stats.words)}</span>
        </div>
        <div class="stat-box border-r-2 md:border-r-0 md:border-b-2 border-zinc-500">
            <span class="text text-zinc-500 dark:text-zinc-400">
                Comment{pluralize(content.stats.comments)}
            </span>
            <span class="stat">{abbreviate(content.stats.comments)}</span>
        </div>
        <div class="stat-box">
            <span class="text text-zinc-500 dark:text-zinc-400">Status</span>
            <span class="stat">{content.meta.status}</span>
        </div>
    </div>
</div>

<style lang="scss">
    div.stat-box {
        @apply flex flex-col items-center justify-center w-[8rem] h-[4.5rem] md:h-[5.5rem];
        span.text {
            @apply font-semibold uppercase mb-2 text-[0.7rem] md:text-xs tracking-widest;
        }
        span.stat {
            @apply md:text-base text-sm font-serif;
        }
    }
</style>
