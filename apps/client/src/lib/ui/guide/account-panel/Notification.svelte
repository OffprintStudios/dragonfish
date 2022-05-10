<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Notification } from '$lib/models/activity';
    import { NotificationKind } from '$lib/models/activity';
    import {
        CheckboxCircleLine,
        DiscussLine,
        QuestionAnswerLine,
        FolderAddLine,
    } from 'svelte-remixicon';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import Time from '$lib/components/ui/misc/Time.svelte';
    import { ContentKind } from '$lib/models/content';

    export let notification: Notification;

    const dispatch = createEventDispatcher();
</script>

<div class="w-full p-2 flex flex-col rounded-lg bg-zinc-300 dark:bg-zinc-700 my-2">
    <div class="flex items-center border-b-2 border-zinc-500 pb-1">
        {#if notification.kind === NotificationKind.ContentComment}
            <span class="mr-1.5">
                <DiscussLine size="24px" />
            </span>
            <span class="text-xs uppercase font-bold tracking-wider"> New Comment </span>
        {:else if notification.kind === NotificationKind.CommentReply}
            <span class="mr-1.5">
                <QuestionAnswerLine size="24px" />
            </span>
            <span class="text-xs uppercase font-bold tracking-wider"> New Reply </span>
        {:else if notification.kind === NotificationKind.AddedToLibrary}
            <span class="mr-1.5">
                <FolderAddLine size="24px" />
            </span>
            <span class="text-xs uppercase font-bold tracking-wider"> Added To Library </span>
        {/if}
        <span class="mx-1 text-sm relative -top-[0.075rem]">•</span>
        <span class="text-xs relative"><Time timestamp={notification.createdAt} relative /></span>
        <div class="flex-1"><!--separator--></div>
        <Button
            title="Mark As Read"
            on:click={() => dispatch('markAsRead', { itemId: notification._id })}
        >
            <span class="button-icon no-text"><CheckboxCircleLine /></span>
        </Button>
    </div>
    <div class="text-sm mt-1">
        {#if notification.kind === NotificationKind.ContentComment}
            <a href="/profile/{notification.commentInfo.posterId}">
                {notification.commentInfo.posterName}
            </a>
            commented on
            {#if notification.contentInfo.contentKind === ContentKind.ProseContent}
                <a href="/prose/{notification.contentInfo.contentId}">
                    {notification.contentInfo.contentTitle}
                </a>
            {:else if notification.contentInfo.contentKind === ContentKind.PoetryContent}
                <a href="/poetry/{notification.contentInfo.contentId}">
                    {notification.contentInfo.contentTitle}
                </a>
            {:else}
                <a href="/blog/{notification.contentInfo.contentId}">
                    {notification.contentInfo.contentTitle}
                </a>
            {/if}
        {:else if notification.kind === NotificationKind.CommentReply}
            Someone replied to your comment!
        {:else if notification.kind === NotificationKind.AddedToLibrary}
            <a href="/profile/{notification.addedByInfo.userId}">
                {notification.addedByInfo.userName}
            </a>
            added
            {#if notification.contentInfo.contentKind === ContentKind.ProseContent}
                <a href="/prose/{notification.contentInfo.contentId}">
                    {notification.contentInfo.contentTitle}
                </a>
            {:else if notification.contentInfo.contentKind === ContentKind.PoetryContent}
                <a href="/poetry/{notification.contentInfo.contentId}">
                    {notification.contentInfo.contentTitle}
                </a>
            {:else}
                <a href="/blog/{notification.contentInfo.contentId}">
                    {notification.contentInfo.contentTitle}
                </a>
            {/if}
            to their library
        {/if}
    </div>
</div>
