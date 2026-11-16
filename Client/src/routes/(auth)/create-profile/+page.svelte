<script lang="ts">
    import { enhance } from "$app/forms";
    import { TextField } from "#lib/ui/forms";
    import { Button, LinkBlock, Metatags } from "#lib/ui/misc";
    import { IconPlus, IconX, IconInfoCircle } from "@tabler/icons-svelte";
	import type { PageProps } from "./$types";
	import { slide } from "svelte/transition";

    let { form }: PageProps = $props();
</script>

<Metatags
    title="Create a Profile — Offprint"
    desc="Let's make a whole new you"
    url="https://offprint.cafe/create-profile"
    image="/images/beatriz.png"
/>

<div class="bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg border border-zinc-300/25 dark:border-zinc-600/25 md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit" style="box-shadow: var(--dropshadow);">
    <div class="flex flex-col items-center justify-center pb-4">
        <h1 class="text-3xl mb-2">Create a Profile</h1>
        <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold font-header">
            Put a name to a face
        </span>
    </div>
    {#if form?.message}
        <div class="text-sm flex flex-col bg-red-600/25 border border-red-600/75 rounded-xl p-4 mb-4" transition:slide>
            <div class="flex items-center mb-1">
                <span class="mr-1"><IconInfoCircle size="20px" /></span>
                <span class="font-bold">Head's Up!</span>
            </div>
            <span>{form?.message}</span>
        </div>
    {/if}
    <form class="flex flex-col w-full" method="post" use:enhance>
        <div class="flex items-center justify-center w-full mb-4">
            <img src="https://images.offprint.net/avatars/avatar.png" class="w-37.5 h-37.5 rounded-full object-cover" alt="Default Avatar" />
        </div>
        <TextField
            name="username"
            label="Username"
            placeholder="Somebody New"
            type="text"
            required
        />
        <div class="flex flex-col w-full mt-4">
            <Button
                id="add-profile"
                title="Add Profile"
                type="submit"
                primary
                fullWidth
            >
                <span class="button-icon"><IconPlus size="1rem" /></span>
                <span class="button-text">Add Profile</span>
            </Button>
            <div class="my-1"></div>
            <LinkBlock
                id="cancel-action"
                title="Cancel"
                href="/switch-profile"
                fullWidth
            >
                <span class="button-icon"><IconX size="1rem" /></span>
                <span class="button-text">Cancel</span>
            </LinkBlock>
        </div>
    </form>
</div>