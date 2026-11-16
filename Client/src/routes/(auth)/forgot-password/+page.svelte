<script lang="ts">
    import { TextField } from "#lib/ui/forms";
    import { Button } from "#lib/ui/misc";
    import { slide } from "svelte/transition";
    import { IconInfoCircle, IconMailFast, IconRestore } from "@tabler/icons-svelte";
	import type { PageProps } from "./$types";
	import { enhance } from "$app/forms";
    import { resolve } from "$app/paths";

    let { form, data }: PageProps = $props();
</script>

{#if data.missing}
    <div class="flex flex-col justify-center bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit overflow-y-scroll">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl mb-2">Forgot your password?</h1>
            <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pb-4 font-header">
                Don't worry—we've got you covered
            </span>
        </div>
        {#if form?.message}
            <div class="text-sm flex flex-col bg-blue-600/25 border border-blue-600/75 rounded-xl p-4 mb-4" transition:slide>
                <div class="flex items-center mb-1">
                    <span class="mr-1"><IconInfoCircle size="20px" /></span>
                    <span class="font-bold">Head's Up!</span>
                </div>
                <span>{form?.message}</span>
            </div>
        {/if}
        <form class="flex flex-col" method="post" action="?/sendEmail" use:enhance>
            <TextField
                name="email"
                label="Email Address"
                type="email"
                placeholder="somebody@example.net"
                autocomplete="email"
                required
            />
            <div class="my-2"></div>
            <Button
                id="send-request-button"
                title="Send Reset Request"
                type="submit"
                primary
                fullWidth
            >
                <span class="button-icon"><IconMailFast size="1.2rem" /></span>
                <span class="button-text">Send Reset Request</span>
            </Button>
            <div class="my-1.5"></div>
            <a class="text-center w-full pt-2 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href={resolve("/(auth)/log-in")}>
                Came here by mistake?
            </a>
        </form>
    </div>
{:else}
    <div class="flex flex-col justify-center bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit overflow-y-scroll">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl">Reset Your Password</h1>
            <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pb-4" style="font-family: var(--header-text);">
                Enter your new password below
            </span>
        </div>
        <form class="flex flex-col" method="post" action="?/resetPassword" use:enhance>
            <TextField
                name="new-password"
                label="New Password"
                type="password"
                placeholder="•••••••••••"
                autocomplete="new-password"
                required
            />
            <div class="my-1.5"></div>
            <TextField
                name="repeat-password"
                label="Repeat Password"
                type="password"
                placeholder="•••••••••••"
                autocomplete="new-password"
                required
            />
            <div class="my-2"></div>
            <Button
                id="send-request-button"
                title="Send Reset Request"
                type="submit"
                primary
                fullWidth
            >
                <span class="button-icon"><IconRestore /></span>
                <span class="button-text">Reset Password</span>
            </Button>
        </form>
    </div>
{/if}
