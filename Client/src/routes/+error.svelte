<script lang="ts">
    import backpacker from "#lib/assets/images/backpacker.jpg";
    import { page } from "$app/state";

    const ErrorMessages = {
        NotFound: "You are lost in a sea of faces, friend. Where will you go next?",
        Unauthorized: "You shouldn't toy with fate like that",
        Forbidden: "The ancient ways shall remain unknown to you, traveler",
        ServerError: "Look, this page isn't a bug—it's a feature",
        ServiceUnavailable: "Cleaning the espresso machines, be back soon"
    } as const;
</script>

<div
    class="flex flex-col items-center justify-center w-full h-svh bg-cover bg-center relative z-0"
    style:background-image={backpacker}
>
    <div class="bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg border border-zinc-300/25 dark:border-zinc-600/25 md:rounded-xl max-w-md p-6 md:p-12 w-full h-full md:h-fit" style="box-shadow: var(--dropshadow);">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl mb-4">{page.status}: {page.error?.message}</h1>
            <span class="text-zinc-500 dark:text-zinc-400 font-bold text-center font-header">
                {#if page.error}
                    {#if page.status === 404}
                        {ErrorMessages.NotFound}
                    {:else if page.status === 401}
                        {ErrorMessages.Unauthorized}
                    {:else if page.status === 403}
                        {ErrorMessages.Forbidden}
                    {:else if page.status === 500}
                        {ErrorMessages.ServerError}
                    {:else if page.status === 503}
                        {ErrorMessages.ServiceUnavailable}
                    {:else}
                        {page.error.message}
                    {/if}
                {/if}
            </span>
        </div>
    </div>
</div>