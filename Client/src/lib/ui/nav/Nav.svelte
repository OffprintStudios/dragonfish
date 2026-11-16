<script lang="ts">
    import SearchBar from "./SearchBar.svelte";
    import { IconTree, IconLogin2, IconLoader, IconSearch, IconFeather, IconCoffee, IconMoodHappy } from "@tabler/icons-svelte";
    import { resolve } from "$app/paths";
    import { page } from "$app/state";
	import { AuthState } from "#lib/state/auth.svelte";
    import { Guide } from "./guide";
    import { Popup } from "#lib/ui/misc";
	import { slugify } from "#lib/util/functions.ts";
    
    let auth = AuthState.useState();
    let showCreateMenu = $state(false);
</script>

<div class="sticky top-0 w-full z-50 border-b border-white/25 backdrop-blur-lg bg-accent">
    <div class="flex items-center h-13.75 mx-4 relative">
        <div class="flex items-center w-1/3">
            <a
                class="flex items-center"
                href={resolve("/(base)")}
            >
                <span class="mr-0.5 text-white!"><IconTree color="white" size="2.25rem" /></span>
                <h3 class="text-2xl font-bold tracking-tighter text-white!">Offprint</h3>
            </a>
            <div class="mx-2"></div>
            <a
                class="hidden md:flex items-center text-white p-2 border-b-2 border-transparent transition hover:border-zinc-300/50 [&[aria-current=page]]:border-zinc-300/75"
                href={resolve("/(base)/explore")}
                aria-current={page.url.pathname.startsWith('/explore') ? 'page' : undefined}
            >
                <span class="relative font-header font-semibold text-xs top-1">EXPLORE</span>
            </a>
            <div class="mx-0.5"></div>
            <a
                class="hidden md:flex items-center text-white p-2 border-b-2 border-transparent transition hover:border-zinc-300/50 [&[aria-current=page]]:border-zinc-300/75"
                href={resolve("/(base)/social")}
                aria-current={page.url.pathname.startsWith('/social') ? 'page' : undefined}
            >
                <span class="relative font-header font-semibold text-xs top-1">SOCIAL</span>
            </a>
        </div>
        <div class="w-1/3">
            <SearchBar />
        </div>
        <div class="w-1/3 flex items-center relative font-header">
            <div class="flex-1"></div>
            {#if auth.currProfile}
                <button
                    class="hidden md:flex items-center text-white px-3 py-2 firefox:text-sm rounded-xl transition hover:bg-zinc-300/25 hover:backdrop-blur"
                    onclick={() => showCreateMenu = true}
                >
                    <span class="relative mr-1.5"><IconLoader size="22px" /></span>
                    <span class="text-xs tracking-wide font-semibold relative top-0.5">CREATE</span>
                </button>
                <Popup
                    id="create-menu"
                    bind:show={showCreateMenu}
                >
                    <div class="flex flex-col items-center justify-center p-8">
                        <h1 class="text-4xl mb-4">Create Something New</h1>
                        <span class="text-zinc-500 dark:text-zinc-400 font-semibold font-header text-center">
                            A whole slew of worlds bristle at your fingertips—<br/>Where should we begin?
                        </span>
                        <div class="flex items-center mt-8">
                            <a 
                                href={resolve("/(base)/profile/[id]/[[username]]/works", { id: auth.currProfile!.id, username: slugify(auth.currProfile!.username) })}
                                class="flex flex-col items-center justify-center min-w-49 min-h-41.75 p-8 rounded-xl bg-zinc-300/50 dark:bg-zinc-600/50 transition hover:bg-zinc-500/50 dark:hover:bg-zinc-400/50"
                            >
                                <span><IconFeather size="75px" /></span>
                                <span class="text-lg font-semibold tracking-wide all-small-caps">Original Work</span>
                            </a>
                            <div class="mx-1"></div>
                            <a
                                href={resolve("/(base)/profile/[id]/[[username]]/works", { id: auth.currProfile!.id, username: slugify(auth.currProfile!.username) })}
                                class="flex flex-col items-center justify-center min-w-49 min-h-41.75 p-8 rounded-xl bg-zinc-300/50 dark:bg-zinc-600/50 transition hover:bg-zinc-500/50 dark:hover:bg-zinc-400/50"
                            >
                                <span><IconMoodHappy size="75px" /></span>
                                <span class="text-lg font-semibold tracking-wide all-small-caps">Fan Work</span>
                            </a>
                            <div class="mx-1"></div>
                            <a
                                href={resolve("/(base)/profile/[id]/[[username]]/blogs", { id: auth.currProfile!.id, username: slugify(auth.currProfile!.username) })}
                                class="flex flex-col items-center justify-center min-w-49 min-h-41.75 p-8 rounded-xl bg-zinc-300/50 dark:bg-zinc-600/50 transition hover:bg-zinc-500/50 dark:hover:bg-zinc-400/50"
                            >
                                <span class="relative left-1.5"><IconCoffee size="75px" /></span>
                                <span class="text-lg font-semibold tracking-wide all-small-caps">Blog</span>
                            </a>
                        </div>
                        <a 
                            class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" 
                            href={resolve("/(base)/profile/[id]/[[username]]", { id: auth.currProfile!.id, username: slugify(auth.currProfile!.username) })}
                        >
                            See Overview
                        </a>
                    </div>
                </Popup>
                <Guide />
            {:else}
                <a
                    class="flex lg:hidden items-center text-white px-3 py-2 firefox:text-sm rounded-xl transition hover:bg-zinc-300/25 hover:backdrop-blur"
                    href={resolve("/(base)/search")}
                >
                    <span class="relative"><IconSearch size="20px" /></span>
                </a>
                <div class="mx-0.5"></div>
                <a
                    class="flex items-center text-white px-3 py-2 firefox:text-sm rounded-xl transition hover:bg-zinc-300/25 hover:backdrop-blur"
                    href={resolve("/(auth)/log-in")}
                >
                    <span class="relative"><IconLogin2 size="20px" /></span>
                    <span class="hidden md:block all-small-caps font-bold tracking-wider ml-1.5">Log In</span>
                </a>
            {/if}
        </div>
    </div>
</div>
