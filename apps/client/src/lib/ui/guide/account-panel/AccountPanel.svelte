<script lang="ts">
    import { flip } from 'svelte/animate';
    import { crossfade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { session } from '$lib/repo/session.repo';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';
    import RoleBadge from '$lib/components/ui/user/RoleBadge.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import {
        ArrowLeftRightLine,
        CheckLine,
        CupLine,
        EyeLine,
        LogoutCircleRLine,
        QuillPenLine,
    } from 'svelte-remixicon';
    import { nextPage } from '$lib/ui/guide';
    import { LogOutPanel, Notification, ProfilePanel } from '$lib/ui/guide/account-panel';
    import { abbreviate } from '$lib/util';
    import { activity, removeAsRead } from '$lib/repo/activity.repo';

    async function markAsRead(id: string) {
        await removeAsRead($session.currProfile._id, { ids: [id] });
    }

    const [send, receive] = crossfade({
        duration: 1500,
        easing: quintOut,
    });
</script>

<div class="h-screen max-w-[24rem] flex flex-col overflow-y-auto">
    <div class="max-h-[6rem] min-h-[6rem] overflow-hidden w-full">
        {#if $session.currProfile.profile.coverPic}
            <img src={$session.currProfile.profile.coverPic} class="h-full w-full object-cover" alt="avatar" />
        {:else}
            <div class="h-full w-full" style="background: var(--accent);"></div>
        {/if}
    </div>
    <div class="py-2 px-4 flex items-center">
        <Avatar src={$session.currProfile.profile.avatar} borderWidth="1px" size="72px" />
        <div class="ml-2 flex-1">
            <h3 class="text-2xl font-medium ">
                <a class="text-ellipsis overflow-hidden" href="/profile/{$session.currProfile._id}">
                    {$session.currProfile.screenName}
                </a>
            </h3>
            <RoleBadge roles={$session.currProfile.roles} size="large" />
        </div>
        <div>
            <Button title="Switch Profile" on:click={() => nextPage(ProfilePanel)}>
                <ArrowLeftRightLine class="button-icon no-text" size="20px" />
            </Button>
            <div class="my-0.5"><!--spacer--></div>
            <Button title="Log Out" on:click={() => nextPage(LogOutPanel)}>
                <LogoutCircleRLine class="button-icon no-text" size="20px" />
            </Button>
        </div>
    </div>
    <div class="w-full flex items-center justify-center border-t border-b border-zinc-700 dark:border-white mt-0.5">
        <a
            class="stat-box hover:bg-zinc-200 dark:hover:bg-zinc-600"
            href="/profile/{$session.currProfile._id}/works"
        >
            <div class="stat">
                <QuillPenLine size="18.4px" class="mr-1" />
                <span class="select-none">{abbreviate($session.currProfile.stats.works)}</span>
            </div>
            <div class="stat-label">Works</div>
        </a>
        <a
            class="stat-box border-l border-r border-zinc-700 dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-600"
            href="/profile/{$session.currProfile._id}/blogs"
        >
            <div class="stat">
                <CupLine size="18.4px" class="mr-1" />
                <span class="select-none">{abbreviate($session.currProfile.stats.blogs)}</span>
            </div>
            <div class="stat-label">Blogs</div>
        </a>
        <a
            class="stat-box hover:bg-zinc-200 dark:hover:bg-zinc-600"
            href="/profile/{$session.currProfile._id}/following"
        >
            <div class="stat">
                <EyeLine size="18.4px" class="mr-1" />
                <span class="select-none">{abbreviate($session.currProfile.stats.followers)}</span>
            </div>
            <div class="stat-label">Follows</div>
        </a>
    </div>
    <div class="w-11/12 my-4 mx-auto flex flex-col-reverse">
        {#each $activity as notification (notification._id)}
            <div in:receive={{ key: notification._id }} out:send={{ key: notification._id }} animate:flip={{ duration: 250 }}>
                <Notification
                    {notification}
                    on:markAsRead={(e) => markAsRead(e.detail.itemId)}
                />
            </div>
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
    </div>
</div>

<style lang="scss">
    a.stat-box {
        @apply block cursor-pointer flex flex-col items-center select-none no-underline p-4 w-1/3 transition transform;
        color: var(--text-color);
        div.stat {
            @apply flex items-center;
        }
        div.stat-label {
            @apply text-xs uppercase font-bold tracking-wider;
        }
    }
</style>
