<script lang="ts">
    import { IconMailCheck, IconMailX } from "@tabler/icons-svelte";
    import { resolve } from "$app/paths";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

{#if data.missing}
    <div class="bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit overflow-y-scroll">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl mb-4">Check your inbox!</h1>
            <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pb-8 font-header">
                We've sent a confirmation email.
            </span>
            <span><IconMailCheck size="150px" /></span>
            <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pt-8 font-header">
                Your account will remain locked<br/>until you confirm it.
            </span>
            <a class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href={resolve("/(auth)/log-in")}>
                After that, just log on in!
            </a>
        </div>
    </div>
{:else}
    <div class="flex flex-col justify-center bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit overflow-y-scroll">
        <div class="flex flex-col items-center justify-center">
            {#if data.success}
                <h1 class="text-3xl">Email confirmed!</h1>
                <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pb-8 font-header">
                    Welcome to Offprint
                </span>
                <span class="text-green-500"><IconMailCheck size="150px" /></span>
                <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pt-8 font-header">
                    Looks like you're ready to get started.
                </span>
                <a class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href={resolve("/(auth)/log-in")}>
                    Without further ado, yeah?
                </a>
            {:else}
                <h1 class="text-3xl">Uh-oh...</h1>
                <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pb-8 font-header">
                    Something went wrong
                </span>
                <span class="text-red-500"><IconMailX size="150px" /></span>
                <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold text-center pt-8 font-header">
                    Seems like there's been a hiccup on our end.
                </span>
                <a class="text-center w-full pt-4 text-zinc-500 dark:text-zinc-400 text-sm hover:underline" href="/settings">
                    Get in touch with our mod team.
                </a>
            {/if}
        </div>
    </div>
{/if}
