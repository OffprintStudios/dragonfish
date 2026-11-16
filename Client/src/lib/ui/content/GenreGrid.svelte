<script lang="ts">
    import { IconBox, IconDoor, IconGhost2, IconHazeMoon, IconHearts, IconHome, IconMasksTheater, IconMeteor, IconMoodHappy, IconMoodSad, IconSkull, IconSpy, IconSwords, IconUfo, IconWand, IconZoomExclamation } from '@tabler/icons-svelte';

    let genres = [
        {name: "Action/Adventure", icon: IconSwords},
        {name: "Comedy", icon: IconMoodHappy},
        {name: "Dark", icon: IconHazeMoon},
        {name: "Drama", icon: IconMasksTheater},
        {name: "Erotica", icon: IconDoor},
        {name: "Fantasy", icon: IconWand},
        {name: "Horror", icon: IconGhost2},
        {name: "Mystery", icon: IconZoomExclamation},
        {name: "Romance", icon: IconHearts},
        {name: "Sad", icon: IconMoodSad},
        {name: "Science Fiction", icon: IconUfo},
        {name: "Slice of Life", icon: IconHome},
        {name: "Speculative Fiction", icon: IconMeteor},
        {name: "Thriller", icon: IconSpy},
        {name: "Tragedy", icon: IconSkull},
    ];
</script>

<div>
    <div class="flex items-center mb-3 mx-4 md:mx-0">
        <IconBox size="30px" />
        <h3 class="text-xl md:text-2xl text-black! dark:text-white! mx-2">Genres</h3>
        <div class="flex-1"></div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 md:gap-2">
        {#each genres as genre (genre.name)}
            {@const IconComponent = genre.icon}
            <div class="flex flex-col items-center justify-center overflow-hidden px-4 py-2 border odd:border-l-0 even:border-r-0 md:odd:border-l md:even:border-r md:rounded-xl bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur border-zinc-600/25 dark:border-zinc-300/25 h-[106px]" style="box-shadow: var(--dropshadow);">
                <span class="relative">
                    <IconComponent size="2rem" />
                </span>
                <span class="text-center font-semibold all-small-caps wrap-break-word leading-relaxed">{genre.name}</span>
            </div>
        {/each}
    </div>
</div>