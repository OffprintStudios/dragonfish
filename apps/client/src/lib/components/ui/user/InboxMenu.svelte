<script lang="ts">
    import { useMutation, useQuery } from '@sveltestack/svelte-query';
    import { fetchAllUnread, markAsRead } from '$lib/services/activity.service';
    import { session } from '$lib/repo/session.repo';
    import { abbreviate, queryClient } from '$lib/util';
    import { CheckLine, CloseLine, Loader5Line } from 'svelte-remixicon';
    import type { Notification as NotificationModel } from '$lib/models/activity';
    import Notification from '$lib/ui/guide/account-panel/Notification.svelte';
    import MessagesMenu from '$lib/components/ui/user/MessagesMenu.svelte';

    enum InboxTabs {
        Messages,
        Activity,
    }

    let selectedTab = InboxTabs.Activity;

    const activity = useQuery('unreadActivity', () => fetchAllUnread($session.currProfile._id), {
        enabled: !!$session.currProfile,
        cacheTime: 1000 * 60 * 0.25,
    });

    const markItemAsRead = useMutation(
        (id: string) => markAsRead($session.currProfile._id, { ids: [id] }),
        {
            onMutate: async (id: string) => {
                await queryClient.cancelQueries('unreadActivity');
                const previousNotifications =
                    queryClient.getQueryData<NotificationModel[]>('unreadActivity');
                queryClient.setQueryData<NotificationModel[]>('unreadActivity', (oldData) =>
                    oldData.filter((item) => item._id !== id),
                );
                return { previousNotifications };
            },
            onError: (err, id, context) => {
                queryClient.setQueryData('unreadActivity', context.previousNotifications);
            },
            onSettled: () => {
                queryClient.invalidateQueries('unreadActivity');
            },
        },
    );
</script>

<div class="flex flex-col w-full h-screen">
    <div class="header">
        <div class="nav">
            <button
                class="rounded-l-lg border border-white border-r-0"
                on:click={() => (selectedTab = InboxTabs.Activity)}
                class:active={selectedTab === InboxTabs.Activity}
            >
                <span class="button-icon">
                    <span class="notification-badge">{abbreviate($activity.data.length)}</span>
                </span>
                <span class="button-text">Activity</span>
            </button>
            <button
                class="rounded-r-lg border border-white"
                on:click={() => (selectedTab = InboxTabs.Messages)}
                class:active={selectedTab === InboxTabs.Messages}
            >
                <span class="button-icon">
                    <span class="notification-badge">0</span>
                </span>
                <span class="button-text">Messages</span>
            </button>
        </div>
    </div>
    <div class="p-4 h-full overflow-y-auto">
        {#if selectedTab === InboxTabs.Messages}
            <MessagesMenu />
        {:else if selectedTab === InboxTabs.Activity}
            {#if $activity.isLoading}
                <div class="w-full h-96 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <Loader5Line class="animate-spin mr-2" size="24px" />
                        <span class="uppercase font-bold tracking-widest text-sm">Loading...</span>
                    </div>
                </div>
            {:else if $activity.error}
                <div class="w-full h-96 flex flex-col items-center justify-center">
                    <div class="flex items-center">
                        <CloseLine class="mr-2" size="24px" />
                        <span class="uppercase font-bold tracking-widest text-sm"
                            >An Error Has Occurred</span
                        >
                    </div>
                </div>
            {:else}
                {#each $activity.data as notification}
                    <Notification
                        {notification}
                        on:markAsRead={(e) => $markItemAsRead.mutate(e.detail.itemId)}
                    />
                {:else}
                    <div class="w-full h-96 flex flex-col items-center justify-center">
                        <div class="flex items-center">
                            <CheckLine class="mr-2" size="24px" />
                            <span class="uppercase font-bold tracking-widest text-sm"
                                >You're all caught up</span
                            >
                        </div>
                    </div>
                {/each}
            {/if}
        {/if}
    </div>
</div>

<style lang="scss">
    div.header {
        @apply px-8 py-4;
        background: var(--accent);

        div.nav {
            @apply flex items-center justify-center;
            button {
                @apply text-white flex items-center justify-center py-2 transition w-1/2;
                span.button-text {
                    @apply uppercase font-bold tracking-wider text-xs mt-0.5 ml-1;
                }

                span.button-icon {
                    @apply flex items-center;
                }

                span.notification-badge {
                    @apply py-0.5 px-2 ml-1 text-sm rounded-lg;
                    background: var(--accent-light);
                }

                &:hover,
                &.active {
                    background: var(--accent-light);

                    span.notification-badge {
                        background: var(--accent);
                    }
                }
            }
        }
    }
</style>
