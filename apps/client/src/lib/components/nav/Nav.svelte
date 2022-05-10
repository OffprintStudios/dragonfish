<script lang="ts">
    import { navigating, page } from '$app/stores';
    import {
        AddBoxLine,
        CloseLine,
        Compass3Line,
        Dashboard2Line,
        GroupLine,
        Home5Line,
        InboxLine,
        LoginCircleLine,
        MenuLine,
        SearchEyeLine,
        Settings5Line,
        TeamLine,
    } from 'svelte-remixicon';
    import { close, guide, refresh } from '$lib/ui/guide';
    import { session } from '$lib/repo/session.repo';
    import { isAllowed } from '$lib/services/auth.service';
    import { Roles } from '$lib/models/accounts';
    import { CreatePanel } from '$lib/ui/guide/create-panel';
    import { AccountPanel, ProfilePanel } from '$lib/ui/guide/account-panel';
    import { MessagesPanel } from '$lib/ui/guide/messages-panel';

    navigating.subscribe((val) => {
        if (val !== null) {
            close();
        }
    });
</script>

<div class="navbar">
    <div class="py-2 flex-col items-center h-full hidden md:flex">
        {#if $session.currProfile}
            {#if $guide.routing[0] === AccountPanel}
                <div
                    class="link select-none cursor-pointer group active"
                    on:click={close}
                    class:no-padding={$guide.routing[0] !== AccountPanel}
                >
                    <span class="link-icon"><CloseLine size="24px" /></span>
                    <span class="link-name">Close</span>
                </div>
            {:else}
                <div
                    class="link select-none cursor-pointer group"
                    on:click={() => refresh(AccountPanel)}
                    class:no-padding={$guide.routing[0] !== AccountPanel}
                >
                    <img
                        src={$session.currProfile.profile.avatar}
                        class="rounded-full"
                        alt="avatar"
                    />
                </div>
            {/if}
            {#if $guide.routing[0] === MessagesPanel}
                <div
                    class="link select-none cursor-pointer group active"
                    on:click={close}
                >
                    <span class="link-icon"><CloseLine size="24px" /></span>
                    <span class="link-name">Close</span>
                </div>
            {:else}
                <div
                    class="link select-none cursor-pointer group"
                    on:click={() => refresh(MessagesPanel)}
                >
                    <span class="link-icon"><InboxLine size="24px" /></span>
                    <span class="link-name">Inbox</span>
                </div>
            {/if}
            {#if $guide.routing[0] === CreatePanel}
                <div
                    class="link select-none cursor-pointer group active"
                    on:click={close}
                >
                    <span class="link-icon"><CloseLine size="24px" /></span>
                    <span class="link-name">Close</span>
                </div>
            {:else}
                <div
                    class="link select-none cursor-pointer group"
                    on:click={() => refresh(CreatePanel)}
                >
                    <span class="link-icon"><AddBoxLine size="24px" /></span>
                    <span class="link-name">Create</span>
                </div>
            {/if}
        {:else if $session.account}
            {#if $guide.routing[0] === ProfilePanel}
                <div
                    class="link select-none cursor-pointer group active"
                    on:click={close}
                >
                    <span class="link-icon"><CloseLine size="24px" /></span>
                    <span class="link-name">Close</span>
                </div>
            {:else}
                <div class="link select-none cursor-pointer group" on:click={() => refresh(ProfilePanel)}>
                    <span class="link-icon"><GroupLine size="24px" /></span>
                    <span class="link-name">Profiles</span>
                </div>
            {/if}
        {:else}
            <a class="link" href="/registration">
                <span class="link-icon"><LoginCircleLine size="24px" /></span>
                <span class="link-name">Log In</span>
            </a>
        {/if}
        <div class="w-10/12 mx-auto border-b border-white my-2"><!--separator--></div>
        <a
            class="link"
            href="/"
            class:active={$page.url.pathname === '/' && $guide.routing.length === 0}
        >
            <span class="link-icon"><Home5Line size="24px" /></span>
            <span class="link-name">Home</span>
        </a>
        <a
            class="link"
            href="/search"
            class:active={$page.url.pathname.startsWith('/search') && $guide.routing.length === 0}
        >
            <span class="link-icon"><SearchEyeLine size="24px" /></span>
            <span class="link-name">Search</span>
        </a>
        <a
            class="link"
            href="/explore"
            class:active={$page.url.pathname.startsWith('/explore') &&
                $guide.routing.length === 0}
        >
            <span class="link-icon"><Compass3Line size="24px" /></span>
            <span class="link-name">Explore</span>
        </a>
        <a
            class="link"
            href="/social"
            class:active={$page.url.pathname.startsWith('/social') &&
                $guide.routing.length === 0}
        >
            <span class="link-icon"><TeamLine size="24px" /></span>
            <span class="link-name">Social</span>
        </a>
        {#if $session.account && isAllowed( $session.account.roles, [Roles.Moderator, Roles.WorkApprover, Roles.Admin], )}
            <a
                class="link"
                href="/dashboard"
                class:active={$page.url.pathname.startsWith('/dashboard') &&
                    $guide.routing.length === 0}
            >
                <span class="link-icon"><Dashboard2Line size="24px" /></span>
                <span class="link-name">Dash</span>
            </a>
        {/if}
        <div class="flex-1"><!--fill space--></div>
        <div class="w-10/12 mx-auto border-b border-white my-2"><!--separator--></div>
        <a
            class="link"
            href="/settings"
            class:active={$page.url.pathname.startsWith('/settings') &&
                $guide.routing.length === 0}
        >
            <span class="link-icon"><Settings5Line size="24px" /></span>
            <span class="link-name">Settings</span>
        </a>
    </div>
    <div class="p-1 flex items-center block md:hidden">
        {#if $guide.routing.length === 0}
            <div
                class="link-mobile select-none cursor-pointer group"
                class:active={$guide.routing.length === 0}
            >
                <span class="link-icon"><CloseLine size="24px" /></span>
            </div>
        {:else}
            <div
                class="link-mobile select-none cursor-pointer group"
                class:active={$guide.routing.length === 0}
            >
                <span class="link-icon"><MenuLine size="24px" /></span>
            </div>
        {/if}
        <a href="/" class="flex-1">
            <img
                src="/images/logo.png"
                alt="logo"
                style="max-width: 8rem; margin: 0 auto;"
                class="relative z-30"
            />
        </a>
        <a href="/search" class="link-mobile select-none cursor-pointer group">
            <span class="link-icon"><SearchEyeLine size="24px" /></span>
        </a>
    </div>
</div>

<style lang="scss">
    div.navbar {
        @apply w-full md:h-screen md:w-[75px] z-50 relative;
        background: var(--accent);
        box-shadow: var(--dropshadow);
    }

    a.link,
    div.link {
        @apply p-2 mx-2 mb-1 border-2 border-transparent rounded-lg transition transform text-white flex flex-col items-center justify-center w-[61px] h-[61px] relative;
        &:hover {
            @apply no-underline scale-105;
            box-shadow: var(--dropshadow);
            background: var(--accent-light);
            color: white;
            border-color: white;
        }

        &:active {
            @apply scale-105;
        }

        &.active {
            @apply no-underline shadow-xl;
            background: var(--accent-light);
            color: white;
            border-color: white;
        }

        span.link-name {
            @apply text-[0.6rem] uppercase font-bold tracking-wider;
        }
    }

    div.link {
        img {
            @apply block object-cover;
            width: 57px;
            height: 57px;
        }
    }

    a.link-mobile,
    div.link-mobile {
        @apply block p-2 rounded-lg text-white transition transform flex flex-col items-center justify-center w-[50px] h-[50px] relative;
    }
</style>
