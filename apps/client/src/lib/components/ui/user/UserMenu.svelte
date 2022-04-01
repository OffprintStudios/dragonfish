<script lang="ts">
    import {
        LogoutCircleRLine,
        ArrowLeftRightLine,
        ArrowLeftSLine,
        CheckLine,
        CloseLine,
    } from 'svelte-remixicon';
    import { session, logout } from '$lib/repo/session.repo';
    import { abbreviate, pluralize } from '$lib/util';
    import { close } from '$lib/components/nav/sidenav/sidenav.state';
    import RoleBadge from './RoleBadge.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import SelectProfile from '$lib/components/ui/user/SelectProfile.svelte';

    enum MenuPages {
        Main,
        SwitchProfile,
        LogOut,
    }

    let currPage = MenuPages.Main;

    async function logOut() {
        await logout().then(() => {
            close();
        });
    }
</script>

<div class="w-full h-screen">
    <div class="topbar">
        {#if currPage === MenuPages.Main}
            <Button
                kind="primary"
                title="Switch Profile"
                on:click={() => (currPage = MenuPages.SwitchProfile)}
            >
                <ArrowLeftRightLine class="button-icon no-text" size="21.2px" />
            </Button>
            <div class="flex-1 text-center uppercase text-sm font-bold tracking-widest">Menu</div>
            <Button kind="primary" title="Log Out" on:click={() => (currPage = MenuPages.LogOut)}>
                <LogoutCircleRLine class="button-icon no-text" size="21.2px" />
            </Button>
        {:else}
            <Button kind="primary" title="Go Back" on:click={() => (currPage = MenuPages.Main)}>
                <ArrowLeftSLine class="button-icon no-text" size="21.2px" />
            </Button>
        {/if}
    </div>
    <div class="flex flex-col w-full h-full relative overflow-y-auto">
        {#if currPage === MenuPages.Main}
            <div class="cover-pic" class:has-accent={!$session.currProfile.profile.coverPic}>
                {#if $session.currProfile.profile.coverPic}
                    <img src={$session.currProfile.profile.coverPic} alt="cover pic" />
                {/if}
            </div>
            <div class="user-avatar" style="background: var(--background)">
                <img src={$session.currProfile.profile.avatar} alt="avatar" />
            </div>
            <div class="user-header" class:has-cover={!!$session.currProfile.profile.coverPic}>
                <div class="text-center">
                    <h3 class="text-3xl font-medium flex items-center justify-center">
                        <RoleBadge roles={$session.currProfile.roles} />
                        <a href={`/profile/${$session.currProfile._id}`}
                            >{$session.currProfile.screenName}</a
                        >
                    </h3>
                    <h4 class="text-xl">@{$session.currProfile.userTag}</h4>
                </div>
                <div class="flex items-center justify-center font-serif mt-4 max-w-[344px] mx-auto">
                    <a
                        href={`/profile/${$session.currProfile._id}/works`}
                        class="block flex flex-col items-center w-[86px] border-r border-zinc-300 dark:border-white text-lg hover:no-underline transition transform hover:scale-105 active:scale-100 hover:bg-zinc-300 hover:dark:bg-zinc-600 rounded-l-lg"
                        style="color: var(--text-color);"
                    >
                        <span>{abbreviate($session.currProfile.stats.works)}</span>
                        <span>work{pluralize($session.currProfile.stats.works)}</span>
                    </a>
                    <a
                        href={`/profile/${$session.currProfile._id}/blogs`}
                        class="block flex flex-col items-center w-[86px] border-r border-zinc-300 dark:border-white text-lg hover:no-underline transition transform hover:scale-105 active:scale-100 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                        style="color: var(--text-color);"
                    >
                        <span>{abbreviate($session.currProfile.stats.blogs)}</span>
                        <span>blog{pluralize($session.currProfile.stats.blogs)}</span>
                    </a>
                    <a
                        href={`/profile/${$session.currProfile._id}/followers`}
                        class="block flex flex-col items-center w-[86px] border-r border-zinc-300 dark:border-white text-lg hover:no-underline transition transform hover:scale-105 active:scale-100 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                        style="color: var(--text-color);"
                    >
                        <span>{abbreviate($session.currProfile.stats.followers)}</span>
                        <span>follower{pluralize($session.currProfile.stats.followers)}</span>
                    </a>
                    <a
                        href={`/profile/${$session.currProfile._id}/following`}
                        class="block flex flex-col items-center w-[86px] text-lg hover:no-underline transition transform hover:scale-105 active:scale-100 hover:bg-zinc-300 rounded-r-lg hover:dark:bg-zinc-600"
                        style="color: var(--text-color);"
                    >
                        <span>{abbreviate($session.currProfile.stats.following)}</span>
                        <span>following</span>
                    </a>
                </div>
            </div>
        {:else if currPage === MenuPages.SwitchProfile}
            <SelectProfile on:profilesel={() => (currPage = MenuPages.Main)} />
        {:else if currPage === MenuPages.LogOut}
            <div class="mt-16">
                <div class="empty">
                    <h3 class="text-2xl">Going so soon?</h3>
                    <p class="text-sm">Are you sure you want to log out?</p>
                </div>
                <div class="flex items-center w-full justify-center mt-8">
                    <Button on:click={() => logOut()}>
                        <CheckLine class="button-icon" />
                        <span class="button-text">Yes</span>
                    </Button>
                    <div class="mx-2"><!--spacer--></div>
                    <Button on:click={() => (currPage = MenuPages.Main)}>
                        <CloseLine class="button-icon" />
                        <span class="button-text">No</span>
                    </Button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    div.topbar {
        @apply w-full p-4 flex items-center drop-shadow-xl relative z-40 text-white;
        background: var(--accent);
    }

    div.cover-pic {
        @apply w-full h-32 overflow-hidden;
        img {
            @apply object-cover h-full w-full;
        }

        &.has-accent {
            @apply h-24;
            background: var(--accent);
        }
    }

    div.user-avatar {
        @apply absolute rounded-full border-4 overflow-hidden top-12 mx-auto max-w-[8.5rem] left-0 right-0;
        border-color: var(--background);

        img {
            @apply object-cover w-full h-full w-32 h-32;
        }
    }

    div.user-header {
        @apply relative w-full;
        top: 5.5rem;

        &.has-cover {
            top: 4rem;
        }
    }
</style>
