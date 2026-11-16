<script lang="ts">
    import { IconChevronLeft, IconMoonFilled, IconMoon, IconSunFilled, IconSun, IconDeviceDesktop, IconDeviceDesktopFilled, IconCheck, IconSettings } from "@tabler/icons-svelte";
    import { Button, LinkBlock } from "#lib/ui/misc";
    import { AppState } from "#lib/state/app.svelte";
    import { capitalize } from "#lib/util/functions";
    import { VALID_THEMES } from "#lib/models/util/themes";

    let { cancel }: { cancel: () => void } = $props();
    let app = AppState.useState();
</script>

<div class="mb-4 flex flex-col">
    <div class="flex items-center px-2 pt-2">
        <Button
            id="back-button"
            title="Go Back"
            onclick={cancel}
        >
            <span class="button-icon"><IconChevronLeft size="1rem" /></span>
            <span class="button-text">Back</span>
        </Button>
    </div>
    <div class="py-4">
		<h3 class="all-small-caps mb-4 text-xl text-center" style="color: var(--text-color)">
            {capitalize(app.theme)}
        </h3>
        <div class="flex items-center justify-center">
            {#each VALID_THEMES as theme, index (theme)}
                <div class={`mx-1 ${theme}`} title={capitalize(theme)}>
                    <button
                        id={`theme-${index}`}
                        class="flex items-center justify-center h-12 w-12 rounded-full border bg-accent cursor-pointer"
                        onclick={() => app.theme = theme}
                    >
                        {#if app.theme === theme}
                            <span class="relative top-[0.075rem] text-white">
                                <IconCheck size="20px" />
                            </span>
                        {/if}
                    </button>
                </div>
            {/each}
        </div>
	</div>
    <div class="flex items-center justify-center py-4">
		<button
            class="mode-toggle"
            class:active={app.brightness === 'system'}
            onclick={() => app.brightness = 'system'}
        >
            {#if app.brightness === 'system'}
                <IconDeviceDesktopFilled size="24px" />
            {:else}
                <IconDeviceDesktop size="24px" />
            {/if}
            <span>System</span>
        </button>
        <button
            class="mode-toggle"
            class:active={app.brightness === 'light'}
            onclick={() => app.brightness = 'light'}
        >
            {#if app.brightness === 'light'}
                <IconSunFilled size="24px" />
            {:else}
                <IconSun size="24px" />
            {/if}
            <span>Lights On</span>
        </button>
        <button
            class="mode-toggle"
            class:active={app.brightness === 'dark'}
            onclick={() => app.brightness = 'dark'}
        >
            {#if app.brightness === 'dark'}
                <IconMoonFilled size="24px" />
            {:else}
                <IconMoon size="24px" />
            {/if}
            <span>Lights Off</span>
        </button>
	</div>
    <div class="px-4 pt-4">
        <LinkBlock
            id="more-settings"
            title="More Settings"
            href="/settings"
            primary
            fullWidth
        >
            <span class="button-icon"><IconSettings size="1rem" /></span>
            <span class="button-text">More Settings</span>
        </LinkBlock>
    </div>
</div>
