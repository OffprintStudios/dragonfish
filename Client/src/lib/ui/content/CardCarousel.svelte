<script lang="ts">
    import { IconChevronRight } from "@tabler/icons-svelte";
    import WorkCard from "./WorkCard.svelte";

    let { children } = $props();
</script>

<div>
    <div class="flex items-center mx-4 md:mx-0 mb-3">
        {@render children()}
        <div class="flex-1"></div>
        <span class="all-small-caps font-semibold md:text-xl tracking-wide relative top-[-0.075rem]">More</span>
        <IconChevronRight size="30px" /> 
    </div>
    <div class="flex items-center justify-start shrink-0 w-full pb-4 md:pb-8 px-4 snap-x snap-mandatory snap-always overflow-x-scroll scrollbar-none">
        <div class="mr-2 snap-center">
            <WorkCard />
        </div>
        <div class="mr-2 snap-center">
            <WorkCard />
        </div>
        <div class="mr-2 snap-center">
            <WorkCard />
        </div>
        <div class="mr-2 snap-center">
            <WorkCard />
        </div>
        <div class="mr-2 snap-center">
            <WorkCard />
        </div>
        <div class="mr-2 snap-center">
            <WorkCard />
        </div>
        <div class="mr-2 snap-center">
            <WorkCard />
        </div>
        <div class="mr-2 snap-center">
            <WorkCard />
        </div>
        <div class="snap-center">
            <WorkCard />
        </div>
    </div>
</div>