<script lang="ts">
    import { AuthState } from "#lib/state/auth.svelte";
    import { LinkBlock, RoleBadge } from "#lib/ui/misc";
    import { IconWriting, IconCoffee, IconBooks, IconMailbox, IconBellExclamation, IconLink, IconSwitch3, IconChevronRight, IconLogout2, IconSettings } from "@tabler/icons-svelte";
    import ashtreeLane from "#lib/assets/images/ashtree-lane.jpg";
	import { resolve } from "$app/paths";
    import { slugify } from "#lib/util/functions.ts";

    let { logout, settings }: {
        logout: () => void;
        settings: () => void;
    } = $props();

    let auth = AuthState.useState();
</script>

<div class="flex flex-col items-center justify-center w-full pb-4">
    <div class="h-16 w-full">
        {#if auth.currProfile?.bannerArt}
            <img src={auth.currProfile?.bannerArt} class="w-full h-16 object-cover" alt={auth.currProfile?.username} />
        {:else}
            <div class="w-full h-28 bg-linear-to-b from-accent to-transparent"></div>
        {/if}
    </div>
    <div class="flex items-center w-full px-4">
        <img src={auth.currProfile?.avatar} class="block w-20 h-20 object-cover rounded-full mr-2" alt={auth.currProfile?.username} />
        <div>
            <a href={resolve("/(base)/profile/[id]/[[username]]", { id: auth.currProfile!.id, username: slugify(auth.currProfile!.username) })}><h3 class="text-3xl relative top-1.5 mb-4">{auth.currProfile?.username}</h3></a>
            <RoleBadge allRoles={['User']} />
        </div>
    </div>
    <div class="flex items-center w-full px-4 py-4 border-b border-zinc-300/75 dark:border-zinc-600/75">
        <LinkBlock
            id="view-works"
            title="View Works"
            href="/"
            primary
            fullWidth
        >
            <span class="button-icon"><IconWriting /></span>
            <span class="button-text">View Works</span>
        </LinkBlock>
        <div class="mx-1"></div>
        <LinkBlock
            id="view-blogs"
            title="View Blogs"
            href="/"
            primary
            fullWidth
        >
            <span class="button-icon"><IconCoffee /></span>
            <span class="button-text">View Blogs</span>
        </LinkBlock>
    </div>
    <div class="flex flex-col w-full px-4 pt-4">
        <div class="flex flex-col w-full rounded-xl bg-zinc-300/75 dark:bg-zinc-600/75 overflow-hidden">
            <div class="flex items-center w-full px-2 pt-2 pb-3 border-b border-zinc-500/50 dark:border-zinc-400/50">
                <img src={ashtreeLane} class="max-w-12.5 object-contain rounded-md mr-2" alt="story cover art" />
                <div class="flex flex-col w-full">
                    <div class="flex items-center">
                        <span class="all-small-caps font-semibold tracking-wide text-sm">Continue Reading</span>
                        <span class="mx-1 relative">•</span>
                        <span class="text-xs text-zinc-500 dark:text-zinc-400 font-default relative top-[0.075rem]">3 chapters left</span>
                    </div>
                    <h6 class="text-lg relative -top-0.5 pt-1 pb-2">The Chronicles of Ashtree Lane</h6>
                    <span class="text-sm text-zinc-500 dark:text-zinc-400 relative -top-1.5">by Figments</span>
                    <progress id="reading-progress" value="73" max="100" class="w-full h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-zinc-500 dark:[&::-webkit-progress-bar]:bg-zinc-400 [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent">73%</progress>
                </div>
            </div>
            <a href={resolve("/(base)/library")} class="flex items-center px-4 py-2.5 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition">
                <span class="all-small-caps tracking-wide font-semibold text-sm">View Library</span>
                <span class="flex-1"></span>
                <span class="text-xs font-default text-zinc-500 dark:text-zinc-400">27 updates</span>
                <span class="ml-0.5 text-zinc-500 dark:text-zinc-400 "><IconBooks size="1.25rem" /></span>
            </a>
        </div>
        <div class="my-1"></div>
        <div class="flex flex-col w-full rounded-xl bg-zinc-300/75 dark:bg-zinc-600/75 overflow-hidden">
            <a href={resolve("/(base)/activity/messages")} class="flex items-center px-4 py-2.5 border-b border-zinc-500/50 dark:border-zinc-400/50 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition">
                <span class="mr-1"><IconMailbox size="1.25rem" /></span>
                <span class="relative -0.5 text-sm">1.2k messages</span>
                <span class="flex-1"></span>
                <span class="text-xs font-default text-zinc-500 dark:text-zinc-400">8 unread</span>
            </a>
            <a href={resolve("/(base)/activity/notifications")} class="flex items-center px-4 py-2.5 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition">
                <span class="mr-1"><IconBellExclamation size="1.25rem" /></span>
                <span class="relative text-sm">18 notes</span>
                <span class="flex-1"></span>
                <span class="text-xs font-default text-zinc-500 dark:text-zinc-400">3 unchecked</span>
            </a>
        </div>
        <div class="my-1"></div>
        <div class="flex flex-col w-full rounded-xl bg-zinc-300/75 dark:bg-zinc-600/75 overflow-hidden">
            <a href={resolve("/(auth)/switch-profile")} class="flex items-center px-4 py-2.5 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition">
                <span class="mr-1"><IconSwitch3 size="1.25rem" /></span>
                <span class="relative text-sm">Switch Profile</span>
                <span class="flex-1"></span>
                <span class="text-zinc-500 dark:text-zinc-400"><IconLink size="1.25rem" /></span>
            </a>
        </div>
        <div class="my-1"></div>
        <div class="flex flex-col w-full rounded-xl bg-zinc-300/75 dark:bg-zinc-600/75 overflow-hidden">
            <button
                class="flex items-center px-4 py-2.5 border-b border-zinc-500/50 dark:border-zinc-400/50 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition cursor-pointer"
                onclick={settings}
            >
                <span class="mr-1"><IconSettings size="1.25rem" /></span>
                <span class="relative text-sm">Settings</span>
                <span class="flex-1"></span>
                <span class="text-zinc-500 dark:text-zinc-400"><IconChevronRight size="1.25rem" /></span>
            </button>
            <button
                class="flex items-center px-4 py-2.5 hover:bg-zinc-400/50 dark:hover:bg-zinc-500/50 transition cursor-pointer"
                onclick={logout}
            >
                <span class="mr-1"><IconLogout2 size="1.25rem" /></span>
                <span class="relative text-sm">Log Out</span>
                <span class="flex-1"></span>
                <span class="text-zinc-500 dark:text-zinc-400"><IconChevronRight size="1.25rem" /></span>
            </button>
        </div>
    </div>
</div>