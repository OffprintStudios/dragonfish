<script lang="ts">
    import { Metatags } from "#lib/ui/misc";
    import type { PageProps } from "./$types";
    import { AuthState } from "#lib/state/auth.svelte.ts";
    import { IconPlus } from "@tabler/icons-svelte";
	import { resolve } from "$app/paths";
	import { enhance } from "$app/forms";

    let { data }: PageProps = $props();
    let auth = AuthState.useState();
</script>

<Metatags
    title="Switch Profile — Offprint"
    desc="So, who's gonna be with us today?"
    url="https://offprint.cafe/switch-profile"
/>

<div class="bg-zinc-200/75 dark:bg-zinc-700/75 backdrop-blur-lg border border-zinc-300/25 dark:border-zinc-600/25 md:rounded-xl max-w-2xl p-6 md:p-12 w-full h-full md:h-fit" style="box-shadow: var(--dropshadow);">
    <div class="flex flex-col items-center justify-center pb-4">
        <h1 class="text-3xl mb-4">Select a Profile</h1>
        <span class="text-zinc-500 dark:text-zinc-400 text-lg font-bold font-header">
            Who's gonna be with us today?
        </span>
    </div>
    <div class="flex items-center justify-center w-full">
        {#each data.profiles as profile (profile.id)}
            <form method="post" action="?/select" use:enhance>
                <input type="hidden" name="profileID" value={profile.id} />
                <button
                    class="flex flex-col items-center rounded-xl p-4 mx-2 w-45 h-52.5 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition cursor-pointer"
                    type="submit"
                    onclick={() => {
                        auth.profiles = data.profiles;
                        auth.currProfile = profile;
                    }}
                >
                    <img class="rounded-full border-2 object-cover w-31.25 h-31.25" src={profile.avatar} alt={`${profile.username}'s Avatar`} />
                    <span class="pt-3 all-small-caps font-semibold tracking-wide text-xl truncate max-w-30">
                        {profile.username}
                    </span>
                </button>
            </form>
        {/each}
        {#if data.profiles.length < 3}
            <a
                class="flex flex-col items-center rounded-xl text-default hover:text-default hover:no-underline p-4 mx-2 w-35 h-42.5 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
                href={resolve("/(auth)/create-profile")}
            >
                <div class="flex flex-col items-center justify-center w-25 h-25 rounded-full border-2 border-dotted">
                    <IconPlus size="36px" />
                </div>
                <span class="pt-3 font-header text-xl">
                    Add New
                </span>
            </a>
        {/if}
    </div>
</div>