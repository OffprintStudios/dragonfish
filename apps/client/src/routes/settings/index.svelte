<script lang="ts">
    import Button from '$lib/components/ui/misc/Button.svelte';
    import Toggle from '$lib/components/forms/Toggle.svelte';
    import SelectMenu from '$lib/components/forms/SelectMenu.svelte';
    import {
        app,
        setOfAge,
        setFilter,
        setTheme,
        setDarkMode,
        setCardSize,
    } from '$lib/repo/app.repo';
    import { CardSize, ThemePref } from '$lib/models/site';

    let enableMature = false;
    let enableExplicit = false;
    let enableDarkMode = $app.darkMode;

    const themes = Object.entries(ThemePref).map(([key, value]) => ({ value: value, label: key }));
    let currTheme = themes.filter((theme) => {
        return theme.value === $app.theme;
    })[0];

    const cardSizes = Object.entries(CardSize).map(([key, value]) => ({
        value: value,
        label: key,
    }));
    let currSize = cardSizes.filter((size) => {
        return size.value === $app.cardSize;
    })[0];

    $: {
        setFilter(enableMature, enableExplicit);
        setDarkMode(enableDarkMode);
    }

    function changeTheme(themePref: string): void {
        setTheme(ThemePref[themePref]);
    }

    function changeCardSize(cardSize: string): void {
        setCardSize(CardSize[cardSize]);
    }
</script>

<div class="w-full flex-1">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mx-auto my-6 w-11/12">
        <div class="p-2 border border-gray-600 dark:border-white rounded-md shadow-xl">
            <h3 class="text-xl font-medium text-center">Theme</h3>
            <span class="text-center text-sm italic w-full block">Change Offprint's theme</span>
            <div class="my-4" />
            <SelectMenu
                items={themes}
                value={currTheme}
                label="Theme"
                on:select={(event) => changeTheme(event.detail.label)}
            />
            <div class="flex flex-col items-center mt-4">
                <Toggle bind:value={enableDarkMode}>Dark Mode</Toggle>
            </div>
        </div>
        <div class="p-2 border border-gray-600 dark:border-white rounded-md shadow-xl">
            <h3 class="text-xl font-medium text-center">Ratings Filter</h3>
            <span class="text-center text-sm italic w-full block"
                >Set what content you're willing to see</span
            >
            {#if $app.isOfAge}
                <div class="flex flex-col items-center mt-4">
                    <Toggle bind:value={enableMature}>Enable Mature</Toggle>
                    <Toggle bind:value={enableExplicit}>Enable Explicit</Toggle>
                    <div class="my-2"><!--spacer--></div>
                </div>
            {:else}
                <div class="flex flex-col items-center mt-4">
                    <p class="text-sm text-center">
                        Changing this setting may expose you to content not suitable for people
                        under the age of 18.<br />Are you sure you want to proceed?
                    </p>
                    <Button on:click={setOfAge}>
                        <span class="button-text">I'm old enough, I can take it</span>
                    </Button>
                </div>
            {/if}
        </div>
        <div class="p-2 border border-gray-600 dark:border-white rounded-md shadow-xl">
            <h3 class="text-xl font-medium text-center">Card Size</h3>
            <span class="text-center text-sm italic w-full block"
                >Change the size of work cards on certain pages</span
            >
            <div class="my-4" />
            <SelectMenu
                items={cardSizes}
                value={currSize}
                label="Card Size"
                on:select={(event) => changeCardSize(event.detail.label)}
            />
        </div>
    </div>
</div>
