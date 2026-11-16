<script lang="ts">
    import { AuthState } from "#lib/state/auth.svelte";
    import type { LayoutProps } from "./$types";
    import { page } from "$app/state";
    import { Metatags, Button, LinkBlock, RoleBadge } from "#lib/ui/misc";
    import { slugify, abbreviate, localeDate, pluralize } from "#lib/util/functions";
    import { IconSettings, IconUserHeart, IconDotsVertical, IconMailShare, IconMessageReport, IconCake, IconCoffee, IconFeather, IconBooks, IconHome } from "@tabler/icons-svelte";
	import { resolve } from "$app/paths";

    let { data, children }: LayoutProps = $props();
    let auth = AuthState.useState();

    const isAuthor = () => data.profile?.id === auth.currProfile?.id;
    const hasToolbar = () => page.url.pathname.endsWith("/works") || page.url.pathname.endsWith("/blogs");

    console.log(page.url.pathname);
</script>

<Metatags
    title={`${data.profile!.username}'s Profile — Offprint`}
    desc={data.profile!.bio}
    username={data.profile!.username}
    url={`/profile/${data.profile!.id}/${slugify(data.profile!.username)}`}
    image={data.profile!.avatar}
/>

<div class="w-full">
    <div class="relative w-full h-40 md:h-80 bg-accent-dark">
        {#if data.profile!.bannerArt}
            <img src={data.profile!.bannerArt} class="object-cover w-full h-full" alt={`${data.profile!.username}'s banner'`} />
        {/if}
    </div>

    <!--Mobile header-->
    <div class="flex items-end relative z-10 px-4 md:hidden bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg max-h-[62.5px]">
        <div class="w-31.25 h-31.25 rounded-full overflow-hidden border-4 border-zinc-300 dark:border-zinc-600">
            <img src={data.profile!.avatar} class="w-full h-full object-cover" alt={`${data.profile!.username}'s avatar'`} />
        </div>
        <div class="flex-1"></div>
        <div class="flex items-center bg-zinc-200 dark:bg-zinc-600 p-1 rounded-xl">
            {#if isAuthor()}
                <LinkBlock
                    id="profile-settings-button"
                    title="Profile Settings"
                    href="/settings"
                >
                    <span class="button-icon no-text"><IconSettings size="18px" /></span>
                </LinkBlock>
            {:else}
                <Button
                    id="follow-profile-button"
                    title="Follow"
                >
                    <span class="button-icon no-text"><IconUserHeart size="18px" /></span>
                </Button>
                <div class="mx-0.5"></div>
                <Button
                    id="more-options-button"
                    title="More Options"
                >
                    <span class="button-icon no-text"><IconDotsVertical size="18px" /></span>
                </Button>
            {/if}
        </div>
    </div>

    <!--Desktop header-->
    <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 max-w-7xl md:w-11/12 mx-auto">
        <div class="flex flex-col bg-zinc-200/50 dark:bg-zinc-700/50 md:h-fit md:rounded-xl px-4 pt-2 md:py-4 relative md:bottom-24 col-span-1 backdrop-blur-lg border-b md:border border-zinc-600/25 dark:border-zinc-300/25 @container" style="box-shadow: var(--dropshadow);">
            <div class="self-center hidden md:block max-w-65 max-h-65 rounded-full overflow-hidden border-4 border-zinc-300 dark:border-zinc-600 mb-4">
                <img src={data.profile!.avatar} class="w-full h-full object-cover" alt={`${data.profile!.username}'s avatar'`} />
            </div>
            <h1 class="whitespace-nowrap text-[clamp(0.75rem,10cqi,2.25rem)]">{data.profile!.username}</h1>
            <div class="my-1"><RoleBadge allRoles={['User']} /></div>
            <div class="flex items-center text-zinc-500 dark:text-zinc-400 text-xs md:text-sm">
                <a href={resolve("/(base)/profile/[id]/[[username]]/followers", { id: data.profile!.id, username: data.profile!.username })}>
                    {`${abbreviate(data.profile!.followers)} follow${pluralize(data.profile!.followers)}`}
                </a>
                <span class="mx-1">•</span>
                <a href={resolve("/(base)/profile/[id]/[[username]]/following", { id: data.profile!.id, username: data.profile!.username })}>
                    {`${abbreviate(data.profile!.following)} following`}
                </a>
                <span class="flex-1"></span>
                <span class="block md:hidden">
                    {`Joined ${localeDate(data.profile!.createdAt, 'longDate')}`}
                </span>
            </div>
            <div class="my-2"></div>
            <span class="text-sm">{data.profile!.bio}</span>
            <div class="hidden md:block my-2"></div>
            {#if isAuthor()}
                <div class="hidden md:flex items-center w-full bg-zinc-300/50 dark:bg-zinc-600/50 backdrop-blur-sm rounded-xl overflow-hidden">
                    <LinkBlock
                        id="profile-settings-link"
                        title="Profile Settings"
                        href="/settings"
                        fullWidth
                    >
                        <span class="button-icon"><IconSettings /></span>
                        <span class="button-text">Settings</span>
                    </LinkBlock>
                </div>
            {:else}
                <div class="hidden md:flex items-center w-full">
                    <Button
                        id="follow-button"
                        title="Follow"
                        fullWidth
                        primary
                    >
                        <span class="button-icon"><IconUserHeart /></span>
                        <span class="button-text">Follow</span>
                    </Button>
                    <div class="mx-0.5"></div>
                    <Button
                        id="message-button"
                        title="Message"
                    >
                        <span class="button-icon no-text"><IconMailShare /></span>
                    </Button>
                    <div class="mx-0.5"></div>
                    <Button
                        id="report-button"
                        title="Report"
                    >
                        <span class="button-icon no-text"><IconMessageReport /></span>
                    </Button>
                </div>
            {/if}
            <div class="hidden md:block my-2"></div>
            <div class="hidden md:flex items-center text-sm">
                <span class="mr-2 relative top-0.5"><IconCake size="22px" /></span>
                <span>
                    {`Joined ${localeDate(data.profile!.createdAt, 'longDate')}`}
                </span>
            </div>
            <div class="flex md:flex-col items-center md:items-baseline mt-4 md:mt-0">
                <!--TODO: links-->
            </div>

            <!--Mobile Nav-->
            <div class="md:hidden my-1"></div>
            <div class="flex md:hidden items-center justify-center w-full">
                <a
                    href={resolve("/(base)/profile/[id]/[[username]]", { id: data.profile!.id, username: slugify(data.profile!.username) })}
                    class="w-1/4 text-center py-2 mx-0.5 all-small-caps font-semibold tracking-wide border-b-2 border-transparent transition [&[aria-current=page]]:border-zinc-700 dark:[&[aria-current=page]]:border-zinc-300"
                    aria-current={(page.url.pathname === `/profile/${data.profile!.id}/${slugify(data.profile!.username)}` || page.url.pathname === `/profile/${data.profile!.id}}`) ? 'page' : undefined}
                >
                    <span>Home</span>
                </a>
                <a
                    href={resolve("/(base)/profile/[id]/[[username]]/works", { id: data.profile!.id, username: slugify(data.profile!.username) })}
                    class="w-1/4 text-center py-2 mx-0.5 all-small-caps font-semibold tracking-wide border-b-2 border-transparent transition [&[aria-current=page]]:border-zinc-700 dark:[&[aria-current=page]]:border-zinc-300"
                    aria-current={page.url.pathname.endsWith('/works') ? 'page' : undefined}
                >
                    <span>Works</span>
                </a>
                <a
                    href={resolve("/(base)/profile/[id]/[[username]]/blogs", { id: data.profile!.id, username: slugify(data.profile!.username) })}
                    class="w-1/4 text-center py-2 mx-0.5 all-small-caps font-semibold tracking-wide border-b-2 border-transparent transition [&[aria-current=page]]:border-zinc-700 dark:[&[aria-current=page]]:border-zinc-300"
                    aria-current={page.url.pathname.endsWith('/blogs') ? 'page' : undefined}
                >
                    <span>Blogs</span>
                </a>
                <a
                    href={resolve("/(base)/profile/[id]/[[username]]/shelves", { id: data.profile!.id, username: slugify(data.profile!.username) })}
                    class="w-1/4 text-center py-2 mx-0.5 all-small-caps font-semibold tracking-wide border-b-2 border-transparent transition [&[aria-current=page]]:border-zinc-700 dark:[&[aria-current=page]]:border-zinc-300"
                    aria-current={page.url.pathname.endsWith('/shelves') ? 'page' : undefined}
                >
                    <span>Shelves</span>
                </a>
            </div>
        </div>

        <div class="mb-6 md:my-6 col-span-3">
            <div
                class="hidden md:flex items-center justify-center w-full py-2 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg rounded-xl border border-zinc-600/25 dark:border-zinc-300/25 transition"
                class:no-bottom-border={hasToolbar()}
                style="box-shadow: var(--dropshadow);"
            >
                <a
                    href={resolve("/(base)/profile/[id]/[[username]]", { id: data.profile!.id, username: slugify(data.profile!.username) })}
                    class="flex items-center justify-center px-6 py-3 mx-1 rounded-xl all-small-caps text-sm font-bold tracking-wide transition [&[aria-current=page]]:bg-zinc-300/50 dark:[&[aria-current=page]]:bg-zinc-600/50 [&[aria-current=page]]:backdrop-blur-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 hover:backdrop-blur-sm"
                    aria-current={(page.url.pathname === `/profile/${data.profile!.id}/${slugify(data.profile!.username)}` || page.url.pathname === `/profile/${data.profile!.id}}`) ? 'page' : undefined}
                >
                    <span class="relative mr-2"><IconHome size="20px" /></span>
                    <span>Home</span>
                </a>
                <a
                    href={resolve("/(base)/profile/[id]/[[username]]/works", { id: data.profile!.id, username: slugify(data.profile!.username) })}
                    class="flex items-center justify-center px-6 py-3 mx-1 rounded-xl all-small-caps text-sm font-bold tracking-wide transition [&[aria-current=page]]:bg-zinc-300/50 dark:[&[aria-current=page]]:bg-zinc-600/50 [&[aria-current=page]]:backdrop-blur-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 hover:backdrop-blur-sm"
                    aria-current={page.url.pathname.endsWith('/works') ? 'page' : undefined}
                >
                    <span class="relative mr-2"><IconFeather size="20px" /></span>
                    <span>{`${abbreviate(data.profile!.works)} Work${pluralize(data.profile!.works)}`}</span>
                </a>
                <a
                    href={resolve("/(base)/profile/[id]/[[username]]/blogs", { id: data.profile!.id, username: slugify(data.profile!.username) })}
                    class="flex items-center justify-center px-6 py-3 mx-1 rounded-xl all-small-caps text-sm font-bold tracking-wide transition [&[aria-current=page]]:bg-zinc-300/50 dark:[&[aria-current=page]]:bg-zinc-600/50 [&[aria-current=page]]:backdrop-blur-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 hover:backdrop-blur-sm"
                    aria-current={page.url.pathname.endsWith('/blogs') ? 'page' : undefined}
                >
                    <span class="relative mr-2"><IconCoffee size="20px" /></span>
                    <span>{`${abbreviate(data.profile!.blogs)} Blog${pluralize(data.profile!.blogs)}`}</span>
                </a>
                <a
                    href={resolve("/(base)/profile/[id]/[[username]]/shelves", { id: data.profile!.id, username: slugify(data.profile!.username) })}
                    class="flex items-center justify-center px-6 py-3 mx-1 rounded-xl all-small-caps text-sm font-bold tracking-wide transition [&[aria-current=page]]:bg-zinc-300/50 dark:[&[aria-current=page]]:bg-zinc-600/50 [&[aria-current=page]]:backdrop-blur-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 hover:backdrop-blur-sm"
                    aria-current={page.url.pathname.endsWith('/shelves') ? 'page' : undefined}
                >
                    <span class="relative mr-2"><IconBooks size="20px" /></span>
                    <span>Shelves</span>
                </a>
            </div>
            <div class="w-full mx-auto">
                {@render children()}
            </div>
        </div>
    </div>
</div>