<script lang="ts">
    // TODO: implement create profile functionality

    import { createForm } from 'felte';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { Save2Line } from 'svelte-remixicon';
    import { ProfileForm } from '$lib/models/accounts/forms';
    import { createProfile } from '$lib/repo/session.repo';
    import { goto } from '$app/navigation';

    let submitting = false;

    const { form, errors } = createForm({
        onSubmit: async (values) => {
            submitting = true;
            const formInfo: ProfileForm = {
                userTag: values.userTag.trim().split(' ').join(''),
                screenName: values.screenName,
                pronouns: [],
            };
            await createProfile(formInfo)
                .then(() => {
                    submitting = false;
                    goto('/registration/select-profile');
                })
                .catch(() => {
                    submitting = false;
                });
        },
        validate: (values) => {
            const errors = {
                userTag: '',
                screenName: '',
                pronouns: '',
            };
            if (!values.userTag || values.userTag > 16 || values.userTag < 3) {
                errors.userTag = `User tags must be greater than 3 and no more than 16 characters long.`;
            }
            if (!values.screenName || values.screenName > 32 || values.screenName < 3) {
                errors.screenName = `Screen names must be greater than 3 and no more than 32 characters long.`;
            }
            return errors;
        },
    });
</script>

<div class="h-full w-full flex flex-col items-center justify-center p-4 h-96">
    <h2 class="text-3xl font-medium">Create Profile</h2>
    <div class="my-1" />
    <form use:form>
        <TextField
            name="screenName"
            type="text"
            title="Screen Name"
            placeholder="A Brand New Me"
            errorMessage={$errors.screenName}
        />
        <TextField
            name="userTag"
            type="text"
            title="Username"
            placeholder="ABrandNewMe"
            errorMessage={$errors.userTag}
        />
        <div class="flex items-center justify-center mt-6">
            <Button type="submit" loading={submitting} loadingText="Saving...">
                <Save2Line class="button-icon" />
                <span class="button-text">Save</span>
            </Button>
        </div>
    </form>
</div>
