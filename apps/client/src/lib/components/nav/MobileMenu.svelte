<script lang="ts">
    import { Home5Line, Compass3Line, TeamLine, Settings5Line, AddBoxLine, InboxLine } from 'svelte-remixicon';
    import { session } from '$lib/repo/session.repo';
    import UserMenu from '$lib/components/ui/user/UserMenu.svelte';
    import InboxMenu from '$lib/components/ui/user/InboxMenu.svelte';
    import ContentMenu from '../ui/user/ContentMenu.svelte';
    import { open, close } from '$lib/components/nav/sidenav/sidenav.state';

    enum MenuOptions {
        NoMenu,
        UserMenu,
        CreateMenu,
        InboxMenu,
    }

    function toggleMenu(menuOption: MenuOptions) {
        switch (menuOption) {
            case MenuOptions.UserMenu:
                open(UserMenu);
                break;
            case MenuOptions.CreateMenu:
                open(ContentMenu);
                break;
            case MenuOptions.InboxMenu:
                open(InboxMenu);
                break;
            default:
                close();
                break;
        }
    }
</script>

<div class="flex flex-col w-full h-screen overflow-y-auto">
    <div class="menu-header">
        {#if $session.currProfile}
            <a href={`/profile/${$session.currProfile._id}`} class="login-link">
                {$session.currProfile.screenName}
            </a>
        {:else}
            <a href="/registration" class="login-link">Log In / Sign Up</a>
        {/if}
    </div>
    <div class="my-4 flex-1 w-full px-4">
        {#if $session.currProfile}
            <div
                class="menu-link border-zinc-600 dark:border-white"
                on:click={() => toggleMenu(MenuOptions.UserMenu)}
            >
                <span>User Menu</span>
            </div>
            <div
                class="menu-link border-zinc-600 dark:border-white"
                on:click={() => toggleMenu(MenuOptions.CreateMenu)}
            >
                <span><AddBoxLine size="24px" class="mr-1" /></span>
                <span>Create</span>
            </div>
            <div
                class="menu-link border-zinc-600 dark:border-white"
                on:click={() => toggleMenu(MenuOptions.InboxMenu)}
            >
                <span><InboxLine size="24px" class="mr-1" /></span>
                <span>Inbox</span>
            </div>
            <div class="w-10/12 mx-auto border-b border-white my-4"><!--separator--></div>
        {/if}
        <a href="/" class="menu-link border-zinc-600 dark:border-white">
            <span><Home5Line size="24px" class="mr-1" /></span>
            <span>Home</span>
        </a>
        <a href="/explore" class="menu-link border-zinc-600 dark:border-white">
            <span><Compass3Line size="24px" class="mr-1" /></span>
            <span>Explore</span>
        </a>
        <a href="/social" class="menu-link border-zinc-600 dark:border-white">
            <span><TeamLine size="24px" class="mr-1" /></span>
            <span>Social</span>
        </a>
        <a href="/settings" class="menu-link border-zinc-600 dark:border-white">
            <span><Settings5Line size="24px" class="mr-1" /></span>
            <span>Settings</span>
        </a>
    </div>
</div>

<style lang="scss">
    div.menu-header {
        @apply px-4 py-6 flex items-center w-full mb-4;
        background: var(--accent);
        a.login-link {
            @apply text-white text-center text-lg uppercase font-bold tracking-widest w-full;
        }
    }
    div.menu-link {
        @apply flex text-lg items-center justify-center p-6 w-full border rounded-lg w-full mb-4 no-underline;
        color: var(--text-color);
        &:hover {
            @apply text-white;
            background: var(--accent);
        }
    }
    a.menu-link {
        @apply flex text-lg items-center justify-center p-6 w-full border rounded-lg w-full mb-4 no-underline;
        color: var(--text-color);
        &:hover {
            @apply text-white;
            background: var(--accent);
        }
    }
</style>
