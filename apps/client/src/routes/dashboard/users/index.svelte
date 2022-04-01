<script lang="ts">
    import Button from '$lib/components/ui/misc/Button.svelte';
    import type { InviteCode } from '$lib/models/accounts';
    import { generateInviteCode, sendInviteEmail } from '$lib/services/admin.service';
    import { createForm } from 'felte';
    import { CheckLine } from 'svelte-remixicon';

    let currCode: InviteCode = null;
    let loading = false;

    async function genCode() {
        loading = true;
        await generateInviteCode()
            .then((res) => {
                loading = false;
                currCode = res;
            })
            .catch(() => {
                loading = false;
            });
    }

    const { form, reset } = createForm({
        onSubmit: async (values) => {
            loading = true;
            await sendInviteEmail(values.email)
                .then(() => {
                    resetForm();
                    loading = false;
                })
                .catch(() => {
                    loading = false;
                });
        },
        initialValues: {
            email: '',
        },
        validate: (values) => {
            const errors = {
                email: '',
            };

            if (values.email === '' || values.email === null || values.email === undefined) {
                errors.email = 'You must include a valid email address!';
            }

            return errors;
        },
    });

    const resetForm = () => reset();
</script>

<div class="my-6 w-11/12 mx-auto md:max-w-7xl flex items-center flex-wrap">
    <div class="settings-block bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
        <h2>Create Invite Code</h2>
        <div class="flex-1 flex flex-col justify-center">
            {#if currCode === null}
                No code generated!
            {:else}
                {currCode._id}
            {/if}
        </div>
        <Button on:click={genCode} {loading} loadingText="Generating...">
            <span class="button-text no-icon">Create Code</span>
        </Button>
    </div>
    <div class="settings-block bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
        <h2>Send Invite Code</h2>
        <form class="flex-1 flex flex-col items-center justify-center" use:form>
            <input
                type="text"
                name="email"
                class="bg-zinc-400 dark:bg-zinc-600 rounded-lg"
                placeholder="Email Address"
            />
            <div class="my-1"><!--separator--></div>
            <Button type="submit" {loading} loadingText="Sending...">
                <CheckLine class="button-icon" />
                <span class="button-text">Send</span>
            </Button>
        </form>
    </div>
</div>

<style lang="scss">
    div.settings-block {
        @apply p-4 rounded-lg flex flex-col items-center w-80 h-72 m-4;
        h2 {
            @apply font-medium text-2xl;
        }
    }
</style>
