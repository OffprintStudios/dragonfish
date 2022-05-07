<script lang="ts">
    import { useQuery } from '@sveltestack/svelte-query';
    import { fetchThreads } from '$lib/services/messages.service';
    import { session } from '$lib/repo/session.repo';
    import { ChatSmile3Line, CloseLine, InformationLine, Loader5Line } from 'svelte-remixicon';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import { page } from '$app/stores';

    const messageThreads = useQuery('messageThreads', () => fetchThreads(
        $session.account && $session.currProfile ? $session.currProfile._id : null
    ));
</script>

<div class="flex h-screen">
    <div class="flex flex-col w-1/4 overflow-y-auto p-4 border-r">
        {#if $messageThreads.isLoading}
            <div class="flex flex-col items-center justify-center h-full">
                <div class="flex items-center">
                    <Loader5Line class="mr-2 animate-spin" />
                    <span class="font-bold text-sm uppercase tracking-widest">Loading...</span>
                </div>
            </div>
        {:else if $messageThreads.isError}
            <div class="flex flex-col items-center justify-center h-full">
                <div class="flex items-center">
                    <CloseLine class="mr-2" />
                    <span class="font-bold text-sm uppercase tracking-widest">Error loading threads</span>
                </div>
            </div>
        {:else}
            {#each $messageThreads.data.docs as thread}
                <a
                    class="thread-card border-zinc-700 dark:border-white hover:bg-zinc-300 dark:hover:bg-zinc-700 group"
                    href="/messages/{thread._id}"
                    class:active={$page.url.pathname === `/messages/${thread._id}`}
                >
                    <div class="chat-picture bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed group-hover:bg-zinc-400 dark:group-hover:bg-zinc-600">
                        <ChatSmile3Line size="24px" />
                    </div>
                    <div class="w-full overflow-hidden">
                        <h5 class="text-2xl font-medium whitespace-nowrap text-ellipsis">{thread.name}</h5>
                        <div class="flex items-center">
                            {#each thread.participants as participant}
                                <Avatar borderWidth="1px" size="24px" src={participant.profile.avatar} title={participant.screenName} />
                                <span class="mx-0.5"></span>
                            {/each}
                        </div>
                    </div>
                </a>
            {:else}
                <div class="flex flex-col items-center justify-center h-full">
                    <div class="flex items-center">
                        <InformationLine class="mr-2" />
                        <span class="font-bold text-sm uppercase tracking-widest">No chats yet</span>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
    <div class="flex-1 w-3/4">
        <slot />
    </div>
</div>

<style lang="scss">
    a.thread-card {
        @apply flex items-center h-20 w-full border-b last:border-0 p-2 rounded-lg block no-underline;
        color: var(--text-color);
        div.chat-picture {
            @apply rounded-full min-h-[4rem] min-w-[4rem] max-w-[4rem] max-h-[4rem] flex flex-col items-center justify-center overflow-hidden mr-2;
        }
        &.active {
            @apply text-white;
            background: var(--accent);
            h5 {
                @apply text-white;
            }
            div.chat-picture {
                @apply text-white;
                background: var(--accent-light) !important;
            }
        }
    }
</style>
