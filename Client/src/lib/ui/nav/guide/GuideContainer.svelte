<script lang="ts">
	import { afterNavigate } from "$app/navigation";
    import { AuthState } from "#lib/state/auth.svelte";
    import { slide } from "svelte/transition";
    import MainPanel from "./MainPanel.svelte";
    import LogOutPanel from "./LogOutPanel.svelte";
    import SettingsPanel from "./SettingsPanel.svelte";

    let auth = AuthState.useState();

    let button = $state<HTMLButtonElement | null>(null);
    let guideMenu = $state<HTMLDivElement | null>(null);
    let open = $state(false);
    let offset = $state("0px");
    let width = $state(0);

    type Panels = 'main' | 'logout' | 'settings';
    let currPanel = $state<Panels>('main');

    $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        width;

        if (typeof window !== "undefined" && button) {
            const scrollX = window.scrollX;
            const isMinWidth = window.matchMedia("(min-width: 768px)").matches;
            if (isMinWidth) {
                offset = `${button.getBoundingClientRect().left + scrollX - 325}px`;
            } else {
                offset = "0px";
            }
            return;
        }
        offset = "0px";
    });

    afterNavigate(() => {
        if (guideMenu && open) {
            currPanel = 'main';
            guideMenu.togglePopover();
        }
    });
</script>

<svelte:window bind:innerWidth={width} />

<button 
    class="relative mx-1 md:mr-0 p-2 rounded-t-lg transition transform hover:cursor-pointer"
    bind:this={button} 
    popovertarget="guide-menu"
>
    <div class="w-10 h-10 z-1 relative rounded-full border-2 border-white overflow-hidden">
        <img src={auth.currProfile?.avatar} class="w-full h-full object-cover" alt="avatar" />
    </div>
</button>

<div
    id="guide-menu"
    class="[&:popover-open]:inset-[unset] [&:popover-open]:top-14 md:[&:popover-open]:w-93.75 [&:popover-open]:w-full [&:popover-open]:m-0 bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur border-b md:border md:border-t-0 border-zinc-600/25 dark:border-zinc-300/25 md:rounded-b-xl overflow-hidden transition-[height] duration-200 ease-in-out"
    style="box-shadow: var(--dropshadow); color: var(--text-color);"
    style:left={offset}
    popover="auto"
    onbeforetoggle={(event) => {
        if (event.newState === 'open') {
            open = true;
        } else {
            open = false;
            currPanel = 'main';
        }
    }}
    bind:this={guideMenu}
>
    <div class="overflow-hidden">
        {#if currPanel === 'main'}
            <div transition:slide={{ duration: 200 }}>
                <MainPanel logout={() => currPanel = 'logout'} settings={() => currPanel = 'settings'} />
            </div>
        {:else if currPanel === 'logout'}
            <div transition:slide={{ duration: 200 }}>
                <LogOutPanel cancel={() => currPanel = 'main'} />
            </div>
        {:else if currPanel === 'settings'}
            <div transition:slide={{ duration: 200 }}>
                <SettingsPanel cancel={() => currPanel = 'main'} />
            </div>
        {/if}
    </div>
</div>

<style>
    [popover] {
        animation: fadeIn 0.15s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>