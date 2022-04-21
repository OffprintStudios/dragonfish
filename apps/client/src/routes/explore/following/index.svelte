<script lang="ts">
    import { useQuery } from '@sveltestack/svelte-query';
    import { fetchFollowing } from '$lib/services/profile.service';
    import { session } from '$lib/repo/session.repo';
    import { InformationLine } from 'svelte-remixicon';
    import UserCard from '$lib/components/ui/user/UserCard.svelte';

    const followsList = useQuery('followsList', () => fetchFollowing($session.currProfile?._id), {
        enabled: !!$session.currProfile && !!$session.account,
    });
</script>

<div class="w-11/12 mx-auto max-w-7xl">
    {#if $followsList.data}
        <h1 class="font-medium text-2xl md:text-4xl mb-6">Everyone You Follow</h1>
        <div class="flex items-center w-full">
            {#each $followsList.data as follow}
                <UserCard user={follow.itemId} />
            {:else}
                <div class="flex items-center">
                    <InformationLine size="24px" />
                    <span class="font-bold tracking-widest uppercase">
                        You haven't followed anyone yet...
                    </span>
                </div>
            {/each}
        </div>
    {/if}
</div>