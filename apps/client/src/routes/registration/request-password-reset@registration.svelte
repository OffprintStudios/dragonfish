<script lang="ts">
    import { createForm } from 'felte';
    import { CheckLine } from 'svelte-remixicon';
    import { TextField } from '$lib/components/forms';
    import { Button } from '$lib/components/ui/misc';
    import { initiatePasswordReset } from '$lib/repo/session.repo';
    import { failure, success } from '$lib/services/alerts.service';

    let submitting = false;

    const { form, errors, reset } = createForm({
        onSubmit: async (values) => {
            submitting = true;

            await initiatePasswordReset(values.email)
                .then(() => {
                    submitting = false;
                    resetForm();
                    success(`Check your email for instructions.`);
                })
                .catch((err) => {
                    console.log(err);
                    submitting = false;
                    failure(`Something went wrong!`);
                });
        },
        validate: (values) => {
            const errors = {
                email: '',
            };
            if (!values.email || !/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(values.email)) {
                errors.email = 'Not a valid email address.';
            }
            return errors;
        },
    });

    function resetForm() {
        reset();
    }
</script>

<div class="h-full w-full flex flex-col items-center justify-center p-4 h-96">
    <h2 class="text-3xl font-medium">Reset Your Password</h2>
    <h3 class="text-lg italic text-center" style="color: var(--text-color);">
        Enter your email below.<br />If we find an account attached to it, we'll send you a reset
        link.
    </h3>
    <div class="my-1"><!--spacer--></div>
    <form use:form>
        <TextField
            name="email"
            type="text"
            title="Email Address"
            placeholder="somebody@example.com"
            errorMessage={$errors.email}
        />
        <div class="flex items-center justify-center mt-6">
            <Button type="submit" loading={submitting} loadingText="Checking...">
                <CheckLine class="button-icon" />
                <span class="button-text">Submit</span>
            </Button>
        </div>
    </form>
</div>
