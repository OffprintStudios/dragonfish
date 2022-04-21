<script lang="ts">
    import { profile } from '$lib/repo/profile.repo';
    import { fetchFollowing } from '$lib/services/profile.service';
    import { Loader5Line, CloseLine, InformationLine } from 'svelte-remixicon';
    import UserCard from '$lib/components/ui/user/UserCard.svelte';
</script>

<svelte:head>
    <title>{$profile.screenName}'s Followers &mdash; Offprint</title>
    <!-- Primary Meta Tags -->
    <meta name="title" content="{$profile.screenName}'s Follows on Offprint" />
    <meta name="description" content="Taking a look at {$profile.screenName}'s follows" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://offprint.net/profile/{$profile._id}" />
    <meta property="og:title" content="{$profile.screenName}'s Follows on Offprint" />
    <meta property="og:description" content="Taking a look at {$profile.screenName}'s follows" />
    <meta property="og:image" content={$profile.profile.avatar} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://offprint.net/profile/{$profile._id}" />
    <meta property="twitter:title" content="{$profile.screenName}'s Follows on Offprint" />
    <meta
        property="twitter:description"
        content="Taking a look at {$profile.screenName}'s follows"
    />
    <meta property="twitter:image" content={$profile.profile.avatar} />
</svelte:head>

{#await fetchFollowing($profile._id)}
    <div class="flex flex-col items-center justify-center h-96">
        <div class="flex items-center justify-center">
            <Loader5Line class="mr-2" size="24px" />
            <span class="font-bold uppercase tracking-widest">Loading...</span>
        </div>
    </div>
{:then data}
    <div
        class="flex items-center justify-center md:justify-start flex-wrap my-6 w-11/12 mx-auto max-w-7xl"
    >
        {#each data as follow}
            <UserCard user={follow.itemId} showOptions={true} />
        {:else}
            <div class="flex flex-col items-center justify-center h-96">
                <div class="flex items-center justify-center">
                    <InformationLine class="mr-2" size="24px" />
                    <span class="font-bold uppercase tracking-widest"
                        >This user hasn't followed anyone yet...</span
                    >
                </div>
            </div>
        {/each}
    </div>
{:catch error}
    <div class="flex flex-col items-center justify-center h-96">
        <div class="flex items-center justify-center">
            <CloseLine class="mr-2" size="24px" />
            <span class="font-bold uppercase tracking-widest">Error Fetching Follows</span>
        </div>
    </div>
{/await}
