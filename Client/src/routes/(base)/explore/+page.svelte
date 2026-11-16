<script lang="ts">
    import { WorkCard } from '#lib/ui/content';
    import { Metatags } from '#lib/ui/misc';
    import { IconBox, IconFlare, IconLayoutGrid, IconLoader } from '@tabler/icons-svelte';
</script>

<Metatags
    title="Explore — Offprint"
    desc="For The Stories Left Untold"
    url="https://offprint.cafe/explore"
/>

<div>
    <div
        class="sticky top-14 flex w-full mb-8 h-12.5 md:h-13.75 backdrop-blur-lg z-10 border-b border-opacity-25 bg-zinc-200/50 dark:bg-zinc-700/50 border-zinc-700/25 dark:border-zinc-200/25 scrollbar-none"
        style="box-shadow: var(--dropshadow);"
    >
        <div
            class="flex justify-start md:justify-center w-full max-w-7xl mx-auto overflow-y-scroll shrink-0"
            style="scrollbar-width: none; -ms-overflow-style: none;"
        >
            <div class="flex shrink-0 items-center justify-center px-3 h-full all-small-caps font-semibold tracking-wider text-lg border-r last:border-r-0 border-zinc-700/25 dark:border-zinc-200/25">
                <span class="relative top-0.5 mr-1">
                    <IconLayoutGrid />
                </span>
                <span>All Works</span>
            </div>
            <div class="flex shrink-0 items-center justify-center px-3 h-full all-small-caps font-semibold tracking-wider text-lg border-r last:border-r-0 border-zinc-700/25 dark:border-zinc-200/25">
                <span class="relative top-0.5 mr-1">
                    <IconLoader />
                </span>
                <span>Newest</span>
            </div>
            <div class="flex shrink-0 items-center justify-center px-3 h-full all-small-caps font-semibold tracking-wider text-lg border-r last:border-r-0 border-zinc-700/25 dark:border-zinc-200/25">
                <span class="relative top-0.5 mr-1">
                    <IconBox />
                </span>
                <span>All Genres</span>
            </div>
            <div class="flex shrink-0 items-center justify-center px-3 h-full all-small-caps font-semibold tracking-wider text-lg border-r last:border-r-0 border-zinc-700/25 dark:border-zinc-200/25">
                <span class="relative top-0.5 mr-1">
                    <IconFlare />
                </span>
                <span>All Ratings</span>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-11/12 mx-auto max-w-7xl mb-8">
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
        <WorkCard width="auto" />
    </div>
</div>