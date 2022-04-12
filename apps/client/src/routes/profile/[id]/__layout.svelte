<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
    import { profile } from '$lib/repo/profile.repo';
    import { getProfile } from '$lib/services/profile.service';

    export const load: Load = async ({ params }) => {
        const profileId: string = params.id;
        const profileModel = await getProfile(profileId);

        profile.set(profileModel);

        return {
            props: {
                profileModel,
            },
        };
    };
</script>

<script lang="ts">
    import { useQuery, useMutation } from '@sveltestack/svelte-query';
    import { page } from '$app/stores';
    import { pluralize, queryClient } from '$lib/util';
    import {
        UserFollowLine,
        UserFollowFill,
        MenuLine,
        Home5Line,
        QuillPenLine,
        CupLine,
        BarChart2Fill,
        ImageEditLine,
        ImageAddLine,
        UserSettingsLine,
    } from 'svelte-remixicon';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { session } from '$lib/repo/session.repo';
    import { openPopup } from '$lib/components/nav/popup';
    import UploadCover from './_forms/UploadCover.svelte';
    import { checkIfFollowing, followUser, unfollowUser } from '$lib/services/profile.service';
    import { goto } from '$app/navigation';

    const followingUser = useQuery(
        'followUser',
        () => checkIfFollowing($session.currProfile._id, $profile._id),
        {
            enabled: !!$session.account && !!$session.currProfile,
            refetchOnWindowFocus: false,
            cacheTime: 1000 * 15,
        },
    );

    const followUserMutation = useMutation(
        () => followUser($session.currProfile._id, $profile._id),
        {
            onSuccess: (data) => {
                queryClient.setQueryData('followUser', data);
            },
        },
    );

    const unfollowUserMutation = useMutation(
        () => unfollowUser($session.currProfile._id, $profile._id),
        {
            onSuccess: () => {
                queryClient.setQueryData('followUser', null);
            },
        },
    );
</script>

<div class="flex flex-col w-full h-screen overflow-y-auto">
    <div class="profile-header">
        {#if $profile.profile.coverPic}
            {#if $session.currProfile && $session.currProfile._id === $profile._id}
                <div class="absolute top-4 right-6 block z-20">
                    <Button kind="primary">
                        <ImageEditLine class="button-icon" />
                        <span class="button-text">Edit Cover</span>
                    </Button>
                </div>
            {/if}
            <img
                class="block object-cover w-full h-40 lg:h-[20rem]"
                src={$profile.profile.coverPic}
                alt="cover"
            />
        {:else}
            <div class="w-full h-[8rem] relative" style="background: var(--accent);">
                {#if $session.currProfile && $session.currProfile._id === $profile._id}
                    <div class="absolute top-4 right-6 block z-20">
                        <Button kind="primary" on:click={() => openPopup(UploadCover)}>
                            <ImageAddLine class="button-icon" />
                            <span class="button-text">Add Cover</span>
                        </Button>
                    </div>
                {/if}
            </div>
        {/if}
        <div class="user-info-container">
            <div class="user-info">
                <div class="avatar-container self-end">
                    <img src={$profile.profile.avatar} alt="avatar" />
                </div>
                <div class="flex-1 lg:self-end top-4 flex flex-col relative">
                    <h1 class="text-2xl lg:text-3xl text-white font-medium">
                        {$profile.screenName}
                    </h1>
                    <h3 class="text-base text-white">@{$profile.userTag}</h3>
                    <span class="text-xs mt-1">
                        <a class="text-white" href="/profile/{$profile._id}/followers">
                            {$profile.stats.followers} follower{pluralize($profile.stats.followers)}
                        </a>
                        <span class="mx-1 text-white">•</span>
                        <a class="text-white" href="/profile/{$profile._id}/following">
                            {$profile.stats.following} following
                        </a>
                    </span>
                    <div class="my-5" />
                </div>
                <div class="flex items-center">
                    {#if $session.account && $session.currProfile}
                        {#if $session.currProfile._id === $profile._id}
                            <Button kind="primary" on:click={() => goto(`/settings/profile`)}>
                                <UserSettingsLine class="button-icon" />
                                <span class="button-text">Settings</span>
                            </Button>
                        {:else if $followingUser.data}
                            <Button
                                kind="primary"
                                loading={$unfollowUserMutation.isLoading}
                                on:click={$unfollowUserMutation.mutateAsync}
                            >
                                <UserFollowFill class="button-icon" />
                                <span class="button-text">Following</span>
                            </Button>
                        {:else}
                            <Button
                                kind="primary"
                                loading={$followingUser.isLoading || $followUserMutation.isLoading}
                                on:click={$followUserMutation.mutateAsync}
                            >
                                <UserFollowLine class="button-icon" />
                                <span class="button-text">Follow</span>
                            </Button>
                        {/if}
                        <div class="mx-1" />
                        <Button kind="primary">
                            <MenuLine class="button-icon no-text" size="20px" />
                        </Button>
                    {:else}
                        <Button kind="primary" disabled>
                            <UserFollowLine class="button-icon" />
                            <span class="button-text">Follow</span>
                        </Button>
                        <div class="mx-1" />
                        <Button kind="primary" disabled>
                            <MenuLine class="button-icon no-text" size="20px" />
                        </Button>
                    {/if}
                </div>
            </div>
            <div class="user-nav">
                <a
                    href="/profile/{$profile._id}"
                    class:active={$page.url.pathname === `/profile/${$profile._id}`}
                >
                    <Home5Line size="20px" class="mr-1" />
                    <span>Home</span>
                </a>
                <a
                    href="/profile/{$profile._id}/works"
                    class:active={$page.url.pathname.includes(`works`)}
                >
                    <QuillPenLine size="20px" class="mr-1" />
                    <span>{$profile.stats.works} Work{pluralize($profile.stats.works)}</span>
                </a>
                <a
                    href="/profile/{$profile._id}/blogs"
                    class:active={$page.url.pathname.includes(`blogs`)}
                >
                    <CupLine size="20px" class="mr-1" />
                    <span>{$profile.stats.blogs} Blog{pluralize($profile.stats.blogs)}</span>
                </a>
                <a
                    href="/profile/{$profile._id}/shelves"
                    class:active={$page.url.pathname.includes(`shelves`)}
                >
                    <BarChart2Fill size="20px" class="mr-1" />
                    <span>Shelves</span>
                </a>
            </div>
        </div>
    </div>
    <slot />
</div>

<style lang="scss">
    div.profile-header {
        @apply w-full flex flex-col mb-6 relative;
        div.user-info-container {
            @apply w-full shadow-xl;
            background: var(--accent);

            div.user-info {
                @apply lg:w-7/12 w-11/12 mx-auto flex items-center flex-row relative lg:h-[7.5rem] h-[5.5rem];

                div.avatar-container {
                    @apply relative overflow-hidden bg-white max-w-[200px] rounded-full border-4 border-white mr-4 shadow-xl;
                    img {
                        @apply object-cover w-full h-full w-24 h-24 lg:w-48 lg:h-48;
                    }
                }
            }

            div.user-nav {
                @apply w-7/12 mx-auto flex items-center justify-center mb-2 mt-2;
                a {
                    @apply text-white lg:text-base text-sm flex items-center py-2 px-4 rounded-lg transition transform mx-0.5;
                    &:hover {
                        @apply scale-105 no-underline;
                        background: var(--accent-light);
                    }

                    &:active {
                        @apply scale-100;
                    }

                    &.active {
                        background: var(--accent-light);
                    }
                }
            }
        }
    }
</style>
