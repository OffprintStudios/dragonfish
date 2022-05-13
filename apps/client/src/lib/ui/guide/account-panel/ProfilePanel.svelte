<script lang="ts">
    import { createForm } from 'felte';
    import { close, guide, prevPage } from '$lib/ui/guide';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { AddBoxLine, ArrowLeftSLine, CheckLine, CloseLine } from 'svelte-remixicon';
    import { ProfileForm } from '$lib/models/accounts/forms';
    import { createProfile, session, setCurrentProfile } from '$lib/repo/session.repo';
    import type { Profile } from '$lib/models/accounts';
    import { TextField } from '$lib/components/forms';
    import Avatar from '$lib/components/ui/user/Avatar.svelte';

    let showAddForm = false;

    function setCurrProfile(profile: Profile) {
        setCurrentProfile(profile);
        if ($guide.currPage > 0) {
            prevPage();
        } else {
            close();
        }
    }

    const { form, errors, isSubmitting } = createForm({
        onSubmit: async (values) => {
            const formInfo: ProfileForm = {
                userTag: values.userTag.trim().split(' ').join(''),
                screenName: values.screenName,
                pronouns: [],
            };
            await createProfile(formInfo)
                .then(() => {
                    showAddForm = false;
                });
        },
        validate: () => {
            // TODO: implement errors
            return {
                userTag: '',
                screenName: '',
                pronouns: '',
            };
        },
        initialValues: {
            userTag: null,
            screenName: null,
        }
    });
</script>

<div class="h-screen max-w-[24rem] flex flex-col overflow-y-auto">
    <div class="sticky flex items-center px-4 h-16 place-content-between" style="background: var(--accent);">
        <div class="w-1/4">
            {#if $guide.currPage > 0}
                <Button kind="primary" title="Go Back" on:click={prevPage}>
                    <ArrowLeftSLine class="button-icon no-text" size="24px" />
                </Button>
            {/if}
        </div>
        <div class="text-center w-2/4 font-bold tracking-widest uppercase text-xs text-white">
            profiles
        </div>
        <div class="w-1/4">
            <!--spacer-->
        </div>
    </div>
    <div class="w-11/12 mx-auto my-6">
        {#each $session.profiles as profile}
            <div
                class="profile-box border-zinc-600 dark:border-white"
                on:click={() => setCurrProfile(profile)}
            >
                <Avatar src={profile.profile.avatar} size="64px" />
                <div class="user-info-container">
                    <h3>{profile.screenName}</h3>
                    <h5>@{profile.userTag}</h5>
                </div>
            </div>
        {/each}
        {#if $session.profiles.length < 3}
            <div
                class="add-profile-box border-zinc-600 dark:border-white"
                class:auto-height={showAddForm}
            >
                {#if showAddForm}
                    <form use:form>
                        <TextField
                            name="userTag"
                            type="text"
                            title="User Tag"
                            placeholder="ANewFace"
                            errorMessage={$errors.userTag}
                        />
                        <TextField
                            name="screenName"
                            type="text"
                            title="Display Name"
                            placeholder="A New Face"
                            errorMessage={$errors.screenName}
                        />
                        <div class="flex items-center justify-center">
                            <Button type="submit" loading={$isSubmitting} loadingText="Saving...">
                                <CheckLine class="button-icon" />
                                <span class="button-text">Submit</span>
                            </Button>
                            <div class="mx-0.5"><!--spacer--></div>
                            <Button type="button" on:click={() => (showAddForm = false)}>
                                <CloseLine class="button-icon" />
                                <span class="button-text">Cancel</span>
                            </Button>
                        </div>
                    </form>
                {:else}
                    <button class="absolute w-full h-full" on:click={() => (showAddForm = !showAddForm)}></button>
                    <AddBoxLine size="32px" class="mr-2" />
                    <span class="uppercase font-bold tracking-widest text-sm">Add profile</span>
                {/if}
            </div>
        {:else}
            <div class="empty">
                <h3 class="text-2xl">You've hit the limit!</h3>
                <p class="text-sm">Only three profiles per account, sorry folks!</p>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    div.profile-box {
        @apply relative border rounded-lg flex items-center p-2 transition transform cursor-pointer select-none mb-4;
        &:hover {
            @apply scale-105;
            background: var(--accent);

            div.user-info-container {
                h3,
                h5 {
                    @apply text-white;
                }
            }
        }

        &:active {
            @apply scale-100;
        }

        div.user-info-container {
            @apply ml-2;
            h3 {
                @apply text-2xl font-medium;
            }

            h5 {
                @apply text-sm;
                color: var(--text-color);
            }
        }
    }

    div.add-profile-box {
        @apply relative border-2 rounded-lg flex items-center p-2 transition transform cursor-pointer select-none border-dashed justify-center;
        height: 90px;

        &.auto-height {
            @apply scale-100 cursor-default;
            height: auto;

            &:hover {
                @apply scale-100;
                color: var(--text-color);
                background: var(--background);
            }
        }

        &:hover {
            @apply scale-105 text-white;
            background: var(--accent);
        }

        &:active {
            @apply scale-100;
        }
    }
</style>
