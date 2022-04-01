<script lang="ts">
    import { session } from '$lib/repo/session.repo';
    import UserCard from '$lib/components/ui/user/UserCard.svelte';
    import Checkbox from '$lib/components/forms/Checkbox.svelte';
    import { ChangeAvatar, ChangeDisplayName, UpdateBio } from './_profile-forms';
    import {
        profileSettings,
        setProfileSettings,
        setCurrProfile,
    } from './_profile-forms/form-state';

    setProfileSettings($session.profiles);
</script>

<div class="w-full py-10">
    <div class="md:mx-auto max-w-4xl flex justify-start md:justify-center overflow-x-auto">
        {#each $profileSettings.profiles as profile}
            <div class="mx-2">
                <UserCard user={profile} showOptions={false} />
                <div class="flex items-center justify-center mt-6">
                    <Checkbox
                        value={$profileSettings.currProfile
                            ? $profileSettings.currProfile._id === profile._id
                            : false}
                        on:check={() => setCurrProfile(profile._id)}
                    />
                </div>
            </div>
        {/each}
    </div>
</div>

{#if $profileSettings.currProfile}
    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mx-auto my-6 w-11/12 max-w-7xl"
    >
        <ChangeAvatar />
        <ChangeDisplayName />
        <UpdateBio />
    </div>
{:else}
    <div class="w-full h-56 md:h-96 flex flex-col items-center justify-center">
        <div class="flex items-center justify-center uppercase font-bold tracking-wider">
            Select A Profile To See Options
        </div>
    </div>
{/if}

<style lang="scss">
    div.settings-box {
        @apply p-2 border rounded-md shadow-xl m-4 flex flex-col;
    }
</style>
