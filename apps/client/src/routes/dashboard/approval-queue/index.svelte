<script lang="ts">
    import { goto } from '$app/navigation';
    import { slugify } from '$lib/util';
    import { approvalQueue, setCurrItem, claimItem } from '$lib/repo/approval-queue.repo';
    import { session } from '$lib/repo/session.repo';
    import { CheckLine, CloseLine, Loader5Line } from 'svelte-remixicon';
    import { setQueue } from '$lib/repo/approval-queue.repo';
    import type { Content } from '$lib/models/content';
    import { ContentKind } from '$lib/models/content';
    import WorkCard from '$lib/components/ui/content/WorkCard.svelte';
    import { Button } from '$lib/components/ui/misc';

    function openItem(docId: string, content: Content) {
        setCurrItem(docId);
        if (content.kind === ContentKind.ProseContent) {
            goto(`/prose/${content._id}/${slugify(content.title)}`);
        } else if (content.kind === ContentKind.PoetryContent) {
            goto(`/poetry/${content._id}/${slugify(content.title)}`);
        }
    }
</script>

{#if $session.account && $session.currProfile}
    {#await setQueue($session.currProfile._id)}
        <div class="flex flex-col items-center justify-center h-96 w-full">
            <div class="flex items-center">
                <Loader5Line class="animate-spin mr-2" size="32px" />
                <span class="uppercase font-bold tracking-widest">Loading queue...</span>
            </div>
        </div>
    {:then items}
        {#if $approvalQueue.queue.length === 0}
            <div class="flex flex-col items-center justify-center h-96 w-full">
                <div class="flex items-center">
                    <CheckLine class="mr-2" size="32px" />
                    <span class="uppercase font-bold tracking-widest">The queue is clear!</span>
                </div>
            </div>
        {:else}
            <div class="w-11/12 mx-auto md:max-w-7xl">
                <table class="table-auto my-6 border-collapse">
                    <thead class="border-b border-zinc-700 dark:border-white">
                        <tr>
                            <th>Claims</th>
                            <th>Works</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $approvalQueue.queue as item}
                            <tr class="border-b border-zinc-700 dark:border-white">
                                <td class="p-2 border-r border-zinc-700 dark:border-white">
                                    {#if item.claimedBy && item.claimedBy._id === $session.currProfile._id}
                                        <Button
                                            on:click={() => openItem(item._id, item.workToApprove)}
                                            >View >></Button
                                        >
                                    {:else if item.claimedBy && item.claimedBy._id !== $session.currProfile._id}
                                        <img
                                            class="w-12 h-12 rounded-md border border-gray-600 dark:border-white"
                                            src={item.claimedBy.profile.avatar}
                                            alt="avatar"
                                        />
                                    {:else}
                                        <Button
                                            on:click={() =>
                                                claimItem($session.currProfile._id, item._id)}
                                            >Claim</Button
                                        >
                                    {/if}
                                </td>
                                <td class="p-2">
                                    <WorkCard content={item.workToApprove}/>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    {:catch error}
        <div class="flex flex-col items-center justify-center h-96 w-full">
            <div class="flex items-center">
                <CloseLine class="mr-2" size="32px" />
                <span class="uppercase font-bold tracking-widest">An error has occurred!</span>
            </div>
        </div>
    {/await}
{:else}
    <div class="flex flex-col items-center justify-center h-96 w-full">
        <div class="flex items-center">
            <CloseLine class="mr-2" size="32px" />
            <span class="uppercase font-bold tracking-widest"
                >Please select a profile before viewing this page</span
            >
        </div>
    </div>
{/if}
