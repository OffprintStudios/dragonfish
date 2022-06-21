<script lang="ts">
    import { socket } from '$lib/socket';
    import { session } from '$lib/repo/session.repo';
    import type { Notification } from '$lib/models/activity';
    import type { MessageThread } from '$lib/models/messages';
    import { messages, setCurrent } from './messages.state';
    import { nextPage } from '$lib/ui/guide';
    import ThreadPanel from './ThreadPanel.svelte';
    import ThreadBox from './ThreadBox.svelte';

    $: {
        if ($socket !== null && $session.currProfile !== null) {
            $socket.volatile.emit('messages:get-feed', { data: { pseudId: $session.currProfile._id }});
            $socket.volatile.on(`messages:feed`, (data: MessageThread[]) => {
                $messages.threads = data;
            });
            $socket.volatile.on(`messages:update-feed`, (data: { threads: MessageThread[], activity: Notification }) => {
                $messages.threads = data.threads;
            });
        }
    }

    function switchToThread(threadId: string) {
        setCurrent(threadId);
        nextPage(ThreadPanel);
    }
</script>

<div class="h-screen max-w-[24rem] flex flex-col overflow-y-auto">
    <div class="sticky flex items-center px-4 h-16 place-content-between" style="background: var(--accent);">
        <div class="w-1/4">
            <!--spacer-->
        </div>
        <div class="text-center w-2/4 font-bold tracking-widest uppercase text-xs text-white">
            inbox
        </div>
        <div class="w-1/4">
            <!--spacer-->
        </div>
    </div>
    <div class="w-11/12 mx-auto my-2">
        {#each $messages.threads as thread}
            <ThreadBox {thread} on:click={() => switchToThread(thread._id)} />
            <div class="my-0.5 border-b border-zinc-700 dark:border-white w-full last:border-0"></div>
        {:else}
            <div class="empty">
                <h3>No Threads Yet</h3>
                <p>Start a conversation with someone and the thread will show up here!</p>
            </div>
        {/each}
    </div>
</div>