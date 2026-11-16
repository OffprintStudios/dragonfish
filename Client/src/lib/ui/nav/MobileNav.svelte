<script lang="ts">
	import { resolve } from "$app/paths";
    import { page } from "$app/state";
    import { IconCompass, IconUsersGroup, IconLoader, IconBooks, IconSearch } from "@tabler/icons-svelte";
</script>

<div class="fixed md:hidden w-full bottom-0 z-100 text-black dark:text-white">
    <div class="flex items-center justify-between w-11/12 mx-auto mb-8 rounded-full h-16.75 px-2.5 pb-2.5 pt-3 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg z-50 border default-shadow border-white/25">
        <a
            class="flex flex-col items-center justify-center h-12.5 w-12.5 mb-0.5 rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
            href={resolve("/(base)")}
            aria-current={page.url.pathname === "/" ? 'page' : undefined}
        >
            <span class="relative"><IconCompass size="2rem" style="stroke-width: 1.5;" /></span>
        </a>
        <a
            class="flex flex-col items-center justify-center h-12.5 w-12.5 mb-0.5 rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
            href={resolve("/(base)/social")}
            aria-current={page.url.pathname.startsWith('/social') ? 'page' : undefined}
        >
            <span class="relative"><IconUsersGroup size="2rem" style="stroke-width: 1.5;" /></span>
        </a>
        <a
            class="flex flex-col items-center justify-center h-12.5 w-12.5 mb-0.5 rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            href="/create"
            aria-current={page.url.pathname.startsWith('/create') ? 'page' : undefined}
        >
            <span class="relative"><IconLoader size="2rem" style="stroke-width: 1.5;" /></span>
        </a>
        <a
            class="flex flex-col items-center justify-center h-12.5 w-12.5 mb-0.5  rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
            href={resolve("/(base)/library")}
            aria-current={page.url.pathname.startsWith('/library') ? 'page' : undefined}
        >
            <span class="relative"><IconBooks size="2rem" style="stroke-width: 1.5;" /></span>
        </a>
        <a
            class="flex flex-col items-center justify-center h-12.5 w-12.5 mb-0.5 rounded-full transition hover:scale-110 [&[aria-current=page]]:bg-[whitesmoke] [&[aria-current=page]]:text-zinc-700 [&[aria-current=page]]:default-shadow [&[aria-current=page]]:hover:scale-100"
            href={resolve("/(base)/search")}
            aria-current={page.url.pathname.startsWith('/search') ? 'page' : undefined}
        >
            <span class="relative"><IconSearch size="2rem" style="stroke-width: 1.5;" /></span>
        </a>
    </div>
</div>