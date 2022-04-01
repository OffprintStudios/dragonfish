<script lang="ts">
    import type { Profile } from '$lib/models/accounts';
    import {
        QuillPenLine,
        CupLine,
        EyeLine,
        UserLine,
        Chat3Line,
        UserAddLine,
        Flag2Line,
    } from 'svelte-remixicon';
    import { abbreviate } from '$lib/util';
    import RoleBadge from '$lib/components/ui/user/RoleBadge.svelte';

    export let user: Profile = null;
    export let showOptions = true;
</script>

<div class="user-card rounded-lg w-64 relative">
    <div
        class="cover-pic w-full h-20 top-0 left-0 rounded-t-md pointer-events-none overflow-hidden"
        class:has-accent={!user.profile.coverPic}
        class:h-20={user.profile.coverPic}
        class:h-16={!user.profile.coverPic}
    >
        {#if user.profile.coverPic}
            <img
                class="object-cover object-top object-center w-full h-full"
                src={user.profile.coverPic}
                alt="cover"
            />
        {/if}
    </div>
    <div class="user-header p-1.5 relative z-20">
        <div class="flex flex-row items-center">
            <div class="user-avatar">
                <img src={user.profile.avatar} alt="avatar" />
            </div>
            <div class="ml-2">
                <h2 class="text-xl font-medium">
                    {user.screenName}
                </h2>
                <RoleBadge roles={user.roles} size="large" />
                {#if user.profile.tagline !== null && user.profile.tagline !== undefined && user.profile.tagline !== 'null'}
                    <h3 class="text-xs font-medium">
                        {user.profile.tagline}
                    </h3>
                {/if}
            </div>
        </div>
    </div>
    <div
        class="flex flex-row items-center justify-center border-t border-zinc-700 dark:border-white mt-0.5"
        class:border-b={showOptions}
    >
        <div class="stat-box">
            <div class="stat">
                <QuillPenLine size="18.4px" class="mr-1" />
                <span class="select-none">{abbreviate(user.stats.works)}</span>
            </div>
            <div class="stat-label">Works</div>
        </div>
        <div class="stat-box border-l border-r border-zinc-700 dark:border-white">
            <div class="stat">
                <CupLine size="18.4px" class="mr-1" />
                <span class="select-none">{abbreviate(user.stats.blogs)}</span>
            </div>
            <div class="stat-label">Blogs</div>
        </div>
        <div class="stat-box">
            <div class="stat">
                <EyeLine size="18.4px" class="mr-1" />
                <span class="select-none">{abbreviate(user.stats.followers)}</span>
            </div>
            <div class="stat-label">Follows</div>
        </div>
    </div>
    {#if showOptions}
        <div>
            <a class="button w-full" href="/profile/{user._id}">
                <UserLine class="mr-1.5" />
                <span class="uppercase font-bold text-xs tracking-wider"> View Profile </span>
            </a>
            <a class="button w-full">
                <Chat3Line class="mr-1.5" />
                <span class="uppercase font-bold text-xs tracking-wider"> Send Message </span>
            </a>
            <button class="w-full">
                <UserAddLine class="mr-1.5" />
                <span class="uppercase font-bold text-xs tracking-wider"> Follow User </span>
            </button>
            <button class="bottom w-full">
                <Flag2Line class="mr-1.5" />
                <span class="uppercase font-bold text-xs tracking-wider"> File Report </span>
            </button>
        </div>
    {/if}
</div>

<style lang="scss">
    div.user-card {
        border: 1px solid var(--borders);
        box-shadow: var(--dropshadow);
        background: var(--background);
        div.has-accent {
            background: var(--accent);
        }
        div.stat-box {
            @apply flex flex-col items-center select-none cursor-default p-4 w-1/3;
            div.stat {
                @apply flex items-center;
            }
            div.stat-label {
                @apply text-xs uppercase font-bold tracking-wider;
            }
        }
        div.user-header {
            div.user-avatar {
                align-self: center;
                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 100%;
                    border: 1px solid var(--borders);
                    box-shadow: var(--dropshadow);
                }
            }
            h2,
            h3 {
                color: var(--text-color);
            }
        }
        div.badge {
            border-color: var(--borders);
        }
        a.button,
        button {
            @apply flex items-center py-3.5 px-4 no-underline;
            color: var(--text-color);
            &.bottom {
                @apply rounded-b-lg border-b-0;
            }
            &:hover {
                @apply bg-zinc-700;
            }
        }
    }
</style>
