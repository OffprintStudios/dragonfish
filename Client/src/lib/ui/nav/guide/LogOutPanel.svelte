<script lang="ts">
    import { Button } from "#lib/ui/misc";
    import { IconCheck, IconX } from "@tabler/icons-svelte";

    let { cancel }: { cancel: () => void } = $props();
</script>

<div class="mx-4 mb-4 mt-8 flex flex-col h-90">
    <div class="flex-1"></div>
    <h2 class="mb-8 text-center text-3xl">Log Out</h2>
    <p
        class="mb-8 text-center font-body"
        style="color: var(--text-color)"
    >
        Are you sure you want to log out?
    </p>
    <div class="flex-1"></div>
    <Button
        id="yes-button"
        title="Yes"
        primary
        fullWidth
    >
        <span class="button-icon"><IconCheck size="1rem" /></span>
        <span class="button-text">Yes</span>
    </Button>
    <div class="my-1"></div>
    <Button
        id="no-button"
        title="No"
        fullWidth
        onclick={cancel}
    >
        <span class="button-icon"><IconX size="1rem" /></span>
        <span class="button-text">No</span>
    </Button>
</div>