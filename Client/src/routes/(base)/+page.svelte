<script lang="ts">
    import { Jumbotron, CardCarousel, NewsPanel, GenreGrid } from '#lib/ui/content';
    import { Metatags } from '#lib/ui/misc';
    import { IconLoader, IconBuildingBroadcastTower } from "@tabler/icons-svelte";
</script>

<Metatags
    title="Home — Offprint"
    desc="For The Stories Left Untold"
    url="https://offprint.cafe/"
/>

<Jumbotron />

<div class="flex flex-col max-w-6xl mx-auto w-full md:w-11/12 my-6">
    <CardCarousel>
        <IconLoader size="30px" />
        <h3 class="text-2xl text-black! dark:text-white! mx-2">What's New</h3>
    </CardCarousel>
    <div class="my-4"><!--spacer--></div>
    <CardCarousel>
        <IconBuildingBroadcastTower size="30px" />
        <h3 class="text-2xl text-black! dark:text-white! mx-2">Recently Updated</h3>
    </CardCarousel>
    <div class="my-4"><!--spacer--></div>
    <NewsPanel />
    <GenreGrid />
</div>