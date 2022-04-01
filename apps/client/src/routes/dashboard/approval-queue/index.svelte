<script lang="ts">
    import { goto } from '$app/navigation';
    import { slugify, abbreviate, localeDate } from '$lib/util';
    import { approvalQueue, setCurrItem, claimItem } from '$lib/repo/approval-queue.repo';
    import { session } from '$lib/repo/session.repo';
    import { CheckLine, CloseLine, Loader5Line } from 'svelte-remixicon';
    import { setQueue } from '$lib/repo/approval-queue.repo';
    import TagBadge from '$lib/components/ui/content/TagBadge.svelte';
    import { TagKind } from '$lib/models/content/works';
    import type { Content } from '$lib/models/content';
    import { ContentKind } from '$lib/models/content';

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
                            <th>Title</th>
                            <th>Author</th>
                            <th>Desc</th>
                            <th>Tags</th>
                            <!--<th>Fandom Tags</th>-->
                            <th>Rating</th>
                            <th>Words</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $approvalQueue.queue as item}
                            <tr class="border-b border-zinc-700 dark:border-white">
                                <td class="p-2 border-r border-zinc-700 dark:border-white">
                                    {#if item.claimedBy && item.claimedBy._id === $session.currProfile._id}
                                        <button
                                            on:click={() => openItem(item._id, item.workToApprove)}
                                            >View >></button
                                        >
                                    {:else if item.claimedBy && item.claimedBy._id !== $session.currProfile._id}
                                        <img
                                            class="w-12 h-12 rounded-md border border-gray-600 dark:border-white"
                                            src={item.claimedBy.profile.avatar}
                                            alt="avatar"
                                        />
                                    {:else}
                                        <button
                                            on:click={() =>
                                                claimItem($session.currProfile._id, item._id)}
                                            >Claim</button
                                        >
                                    {/if}
                                </td>
                                <td class="p-2 border-r border-gray-600 dark:border-white">
                                    {item.workToApprove.title}
                                </td>
                                <td class="p-2 border-r border-gray-600 dark:border-white">
                                    <a href="/profile/{item.workToApprove.author._id}">
                                        {item.workToApprove.author.screenName}
                                    </a>
                                </td>
                                <td class="p-2 border-r border-gray-600 dark:border-white">
                                    <button>View >></button>
                                </td>
                                <td
                                    class="p-2 flex items-center flex-wrap border-r border-gray-600 dark:border-white"
                                >
                                    <TagBadge
                                        kind={TagKind.Type}
                                        type={item.workToApprove.kind}
                                        size={'large'}
                                    />
                                    <TagBadge
                                        kind={TagKind.Category}
                                        category={item.workToApprove.meta.category}
                                        size={'large'}
                                    />
                                    {#each item.workToApprove.meta.genres as genre}
                                        <TagBadge kind={TagKind.Genre} {genre} size={'large'} />
                                    {/each}
                                </td>
                                <!--<td class="p-2 flex-wrap border-r border-gray-600 dark:border-white">
                                    {#each item.workToApprove.tags as tag}
                                    <ng-container *ngFor="let tag of entry.workToApprove.tags; let i = index">
                                        <a
                                            [routerLink]="['/tag', tag._id, tag.name | slugify]"
                                            [innerHtml]="tag | displayTags | safeHtml"
                                        ></a>
                                        <ng-container *ngIf="i < entry.workToApprove.tags.length - 1">
                                            ,
                                        </ng-container>
                                    </ng-container>
                                </td>-->
                                <td class="p-2 border-r border-gray-600 dark:border-white">
                                    {item.workToApprove.meta.rating}
                                </td>
                                <td class="p-2 border-r border-gray-600 dark:border-white">
                                    {abbreviate(item.workToApprove.stats.words)}
                                </td>
                                <td class="p-2">
                                    {localeDate(item.workToApprove.createdAt, 'shortDate')}
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
