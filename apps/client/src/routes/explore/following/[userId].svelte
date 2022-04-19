<script lang="ts">
    import { page } from '$app/stores';
    import { useQuery } from '@sveltestack/svelte-query';
    import { fetchFollowing } from '$lib/services/profile.service';
    import { session } from '$lib/repo/session.repo';
    import type { Profile } from '$lib/models/accounts';

    const userId = $page.params.userId;

    const followsList = useQuery('followsList', () => fetchFollowing($session.currProfile?._id), {
        enabled: !!$session.currProfile && !!$session.account,
    });

    $: currFollow = $followsList.data && $followsList.data.length > 0 ? $followsList.data.find(follow => (follow.itemId as Profile)._id === userId) : null;
</script>

<div class="w-11/12 mx-auto max-w-7xl">
    {#if $followsList.data && currFollow !== null}
        <h1 class="font-medium text-2xl md:text-4xl">{currFollow.itemId.screenName}'s Latest</h1>
    {/if}
</div>