<script lang="ts">
    import { DEFAULT_SLOGANS } from "#lib/models/util/slogans";
    import { IconSearch } from "@tabler/icons-svelte";

    let currSlogan = DEFAULT_SLOGANS[Math.floor(Math.random() * DEFAULT_SLOGANS.length)];
</script>

<div class="w-full relative">
    <button
        class="hidden lg:flex w-11/12 h-9 mx-auto items-center justify-center rounded-xl border-2 border-x-transparent border-t-transparent border-zinc-300 bg-zinc-300/40 backdrop-blur py-1 text-white transitiofirefox:bg-accent-light hover:firefox:bg-accent-light/75"
    >
        <span class="mr-2 relative"><IconSearch size="1rem" /></span>
        <span class="text-xs">{currSlogan}</span>
    </button>
</div>
