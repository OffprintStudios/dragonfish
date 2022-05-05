<script lang="ts">
    import { session } from '$lib/repo/session.repo';
    import { useQuery } from '@sveltestack/svelte-query';
    import { fetchThreads } from '$lib/services/messages.service';
    import { ChatSmile3Line } from 'svelte-remixicon';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';

    const messageThreads = useQuery('messageThreads', () => fetchThreads(
        $session.account && $session.currProfile ? $session.currProfile._id : null
    ));
</script>

{#each [...Array(10).keys()] as num}
    <div class="thread-card border-zinc-700 dark:border-white">
        <div class="rounded-full h-16 w-16 flex flex-col items-center justify-center overflow-hidden bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed mr-2">
            <ChatSmile3Line size="24px" />
        </div>
        <div>
            <h5 class="text-2xl font-medium">A Chat Thread</h5>
            <div class="flex items-center">
                <Avatar borderWidth="1px" size="24px" src="https://images.offprint.net/avatars/avatar.png" />
                <span class="mx-0.5"></span>
                <Avatar borderWidth="1px" size="24px" src="https://images.offprint.net/avatars/avatar.png" />
                <span class="mx-0.5"></span>
                <Avatar borderWidth="1px" size="24px" src="https://images.offprint.net/avatars/avatar.png" />
                <span class="mx-0.5"></span>
                <span>+3</span>
            </div>
        </div>
    </div>
{/each}

<style lang="scss">
    div.thread-card {
        @apply flex items-center h-20 w-full border-b last:border-0;
    }
</style>