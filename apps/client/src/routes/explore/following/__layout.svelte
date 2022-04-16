<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import { get } from 'svelte/store';
    import { fetchFollowing } from '$lib/services/profile.service';
    import { session } from '$lib/repo/session.repo';

    export const load: Load = async () => {
        const currProfile = get(session).currProfile;

        if (currProfile === null || currProfile === undefined) {
            return {
                status: 307,
                redirect: '/explore'
            }
        } else {
            return {
                props: {
                    following: await fetchFollowing(currProfile._id),
                }
            }
        }
    }
</script>

<script lang="ts">
    import type { FollowingUser } from '$lib/models/activity';
    import { useQuery } from '@sveltestack/svelte-query';
    import { Loader5Line, CloseLine, InformationLine, Apps2Line } from 'svelte-remixicon';

    export let following: FollowingUser[];

    const followsList = useQuery('followsList', () => fetchFollowing($session.currProfile?._id), {
        enabled: !!$session.currProfile && !!$session.account,
        initialData: following,
    });
</script>

<div class="w-full">
    {#if $followsList.isLoading}
        <div class="h-32 flex flex-col items-center justify-center">
            <div class="flex items-center justify-center">
                <Loader5Line class="mr-2 animate-spin" size="24px" />
                <span class="font-bold tracking-widest uppercase text-sm">Loading...</span>
            </div>
        </div>
    {:else if $followsList.isError}
        <div class="h-32 flex flex-col items-center justify-center">
            <div class="flex items-center justify-center">
                <CloseLine class="mr-2" size="24px" />
                <span class="font-bold tracking-widest uppercase text-sm">Error fetching follows</span>
            </div>
        </div>
    {:else if $followsList.data.length === 0}
        <div class="h-32 flex flex-col items-center justify-center">
            <div class="flex items-center justify-center">
                <Loader5Line class="mr-2" size="24px" />
                <span class="font-bold tracking-widest uppercase text-sm">You haven't followed anyone yet</span>
            </div>
        </div>
    {:else}
        <div class="flex items-center overflow-x-auto px-12">
            <a>
                <Apps2Line size="40px" />
            </a>
            <!--TODO: finish implementing row of avatars for follows-->
        </div>
    {/if}
</div>

<slot />
