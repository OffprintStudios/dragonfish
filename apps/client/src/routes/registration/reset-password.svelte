<script lang="ts">
    import { page } from '$app/stores';
    import { createForm } from 'felte';
    import { Save2Line } from 'svelte-remixicon';
    import { TextField } from '$lib/components/forms';
    import { Button } from '$lib/components/ui/misc';
    import { resetPassword } from '$lib/repo/session.repo';
    import { failure, success } from '$lib/services/alerts.service';
    import type { ResetPassword } from '$lib/models/accounts/forms';
    import { goto } from '$app/navigation';

    let submitting = false;
    let userId = $page.url.searchParams.get('userId');
    let token = $page.url.searchParams.get('token');
    let canView = !(!userId && !token);

    const { form, errors } = createForm({
        onSubmit: async (values) => {
            submitting = true;
            const resetInfo: ResetPassword = {
                accountId: userId,
                resetCode: token,
                newPassword: values.confirmPassword,
            };

            await resetPassword(resetInfo)
                .then(() => {
                    submitting = false;
                    success(`Your password has been updated.`);
                    goto('/registration');
                })
                .catch((err) => {
                    console.log(err);
                    submitting = false;
                    failure(`Something went wrong!`);
                });
        },
        validate: (values) => {
            const errors = {
                password: '',
                confirmPassword: '',
            };
            if (!values.password) {
                errors.password = `Aren't you forgetting something?`;
            }
            if (values.password && values.password.length < 8) {
                errors.password = `Passwords must be at least 8 characters long.`;
            }
            if (!values.confirmPassword || values.password !== values.confirmPassword) {
                errors.confirmPassword = `Passwords must match.`;
            }
            return errors;
        },
    });
</script>

<div class="h-full w-full flex flex-col items-center justify-center p-4 h-96">
    {#if canView}
        <h2 class="text-3xl font-medium">Reset Your Password</h2>
        <h3 class="text-lg italic text-center" style="color: var(--text-color);">
            Enter your new password below.
        </h3>
        <div class="my-1"><!--spacer--></div>
        <form use:form>
            <TextField
                name="password"
                type="password"
                title="Password"
                placeholder="••••••••••"
                errorMessage={$errors.password}
            />
            <TextField
                name="confirmPassword"
                type="password"
                title="Confirm Password"
                placeholder="••••••••••"
                errorMessage={$errors.confirmPassword}
            />
            <div class="flex items-center justify-center mt-6">
                <Button type="submit" loading={submitting} loadingText="Saving...">
                    <Save2Line class="button-icon" />
                    <span class="button-text">Save</span>
                </Button>
            </div>
        </form>
    {:else}
        <div class="empty">
            <h3>You don't have permission to view this page</h3>
            <p>Come back when you do.</p>
        </div>
    {/if}
</div>
