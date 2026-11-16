<script lang="ts">
    import { AuthState } from "#lib/state/auth.svelte";
    import type { PageProps } from "./$types";
    import { Button, Popup } from "#lib/ui/misc";
    import { IconNewSection, IconCards, IconListDetails, IconSearch } from "@tabler/icons-svelte";

    let auth = AuthState.useState();
    let { data }: PageProps = $props();
    let showAddMenu = $state(false);
</script>

<div
    class="flex items-center justify-center w-full p-2 bg-zinc-200/50 dark:bg-zinc-700/50 backdrop-blur-lg md:rounded-b-xl border-b border-t-0 md:border-t-1 border-x-0 md:border-x-1 border-zinc-600/25 dark:border-zinc-300/25 transition"
    style="box-shadow: var(--dropshadow)"
>
    {#if data.profile!.id === auth.currProfile?.id}
        <Button
            id="add-new"
            title="Add New Blog"
            primary
            onclick={() => showAddMenu = true}
        >
            <span class="button-icon"><IconNewSection size="1.125rem" /></span>
            <span class="button-text">Add</span>
        </Button>
        <Popup
            id="add-menu"
            bind:show={showAddMenu}
        >
            <form>
                hi
            </form>
        </Popup>
        <span class="mx-2 relative -top-0.5 text-4xl font-extralight text-zinc-300 dark:text-zinc-600">|</span>
    {/if}
    <Button
        id="card-view"
        title="Card View"
    >
        <span class="button-icon no-text py-[0.075rem]!"><IconCards size="1.125rem" /></span>
    </Button>
    <span class="mx-0.5"></span>
    <Button
        id="list-view"
        title="List View"
        active
    >
        <span class="button-icon no-text py-[0.075rem]!"><IconListDetails size="1.125rem" /></span>
    </Button>
    <div class="flex-1"></div>
    <form class="flex items-center bg-zinc-300 dark:bg-zinc-600 rounded-xl overflow-hidden relative h-9.5">
        <input type="text" placeholder="Search..." class="bg-transparent border-0 focus:border-0 ring-0" />
        <button title="Search" class="px-4 py-3 hover:bg-zinc-400 dark:hover:bg-zinc-500"><IconSearch size="1rem" /></button>
    </form>
</div>