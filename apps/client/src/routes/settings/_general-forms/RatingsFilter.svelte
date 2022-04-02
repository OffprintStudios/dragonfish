<script lang="ts">
    import { Toggle } from '$lib/components/forms';
    import { app, setFilter, setOfAge } from '$lib/repo/app.repo';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { ContentFilter } from '$lib/models/content';

    let enableMature = false;
    let enableExplicit = false;

    if ($app.filter === ContentFilter.Default) {
        enableMature = false;
        enableExplicit = false;
    } else if ($app.filter === ContentFilter.MatureEnabled) {
        enableMature = true;
        enableExplicit = false;
    } else if ($app.filter === ContentFilter.ExplicitEnabled) {
        enableMature = false;
        enableExplicit = true;
    } else if ($app.filter === ContentFilter.Everything) {
        enableMature = true;
        enableExplicit = true;
    }

    $: setFilter(enableMature, enableExplicit);
</script>

<div class="settings-box bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
    <h3 class="text-xl font-medium text-center">Ratings Filter</h3>
    <span class="text-center text-sm italic w-full block">
        Set what content you're willing to see
    </span>
    {#if $app.isOfAge}
        <div class="flex flex-col items-center mt-4">
            <Toggle bind:value={enableMature}>Enable Mature</Toggle>
            <Toggle bind:value={enableExplicit}>Enable Explicit</Toggle>
            <div class="my-2"><!--spacer--></div>
        </div>
    {:else}
        <div class="flex flex-col items-center mt-4">
            <p class="text-sm text-center">
                Changing this setting may expose you to content not suitable for people under the
                age of 18.<br />Are you sure you want to proceed?
            </p>
            <Button on:click={setOfAge}>
                <span class="button-text">I'm old enough, I can take it</span>
            </Button>
        </div>
    {/if}
</div>

<style lang="scss">
    div.settings-box {
        @apply p-2 rounded-lg shadow-xl m-4 flex flex-col;
    }
</style>
