<script lang="ts">
    import type { MessageThread } from '$lib/models/messages';
    import { ChatSmile3Line } from 'svelte-remixicon';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';

    export let thread: MessageThread;
</script>

<div
    class="thread-card hover:bg-zinc-300 dark:hover:bg-zinc-700 group"
    on:click
>
    <div class="chat-picture bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed group-hover:bg-zinc-400 dark:group-hover:bg-zinc-600">
        <ChatSmile3Line size="24px" />
    </div>
    <div class="overflow-hidden w-full">
        <h5 class="text-xl font-medium whitespace-nowrap overflow-hidden text-ellipsis">{thread.name}</h5>
        <div class="flex items-center">
            {#each thread.participants as participant}
                <Avatar borderWidth="1px" size="24px" src={participant.profile.avatar} title={participant.screenName} />
                <span class="mx-0.5"></span>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    div.thread-card {
        @apply flex items-center h-20 w-full p-2 rounded-lg block no-underline cursor-pointer;
        color: var(--text-color);
        div.chat-picture {
            @apply rounded-full min-h-[4rem] min-w-[4rem] max-w-[4rem] max-h-[4rem] flex flex-col items-center justify-center overflow-hidden mr-2;
        }
    }
</style>