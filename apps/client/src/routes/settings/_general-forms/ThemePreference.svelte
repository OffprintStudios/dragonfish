<script lang="ts">
    import Select from 'svelte-select';
    import { Toggle } from '$lib/components/forms';
    import { app, setTheme } from '$lib/repo/app.repo';
    import { ThemePref } from '$lib/models/site';

    const themes = Object.entries(ThemePref).map(([key, value]) => ({ value: value, label: key }));
    let currTheme = themes.filter((theme) => {
        return theme.value === $app.theme;
    })[0];
</script>

<div class="settings-box bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
    <h3 class="text-xl font-medium text-center">Theme</h3>
    <span class="text-center text-sm italic w-full block">Change Offprint's theme</span>
    <div class="search-select my-4">
        <Select
            items={themes}
            value={currTheme}
            placeholder="Select Theme"
            isClearable={false}
            on:select={(event) => setTheme(ThemePref[event.detail.label])}
        />
    </div>
    <div class="flex flex-col items-center mt-4">
        <Toggle bind:value={$app.darkMode}>Dark Mode</Toggle>
    </div>
</div>

<style lang="scss">
    div.settings-box {
        @apply p-2 rounded-lg shadow-xl m-4 flex flex-col;
    }
    div.search-select {
        @apply flex-1;
        color: white;
        --tw-bg-opacity: 1;
        --tw-placeholder-opacity: 1;
        --borderRadius: 0.5rem;
        --background: rgb(113 113 122 / var(--tw-bg-opacity));
        --inputColor: white;
        --listBackground: rgb(113 113 122 / var(--tw-bg-opacity));
        --itemHoverBG: var(--accent);
        --itemHoverColor: white;
        --placeholderColor: rgb(161 161 170 / var(--tw-placeholder-opacity));
        --border: none;
        --multiItemBG: var(--accent);
        --multiItemColor: white;
        --multiItemActiveBG: var(--accent-light);
    }
</style>
