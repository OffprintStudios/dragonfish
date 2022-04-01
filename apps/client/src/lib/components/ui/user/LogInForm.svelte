<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { createForm } from 'felte';
    import { LoginCircleLine } from 'svelte-remixicon';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import Toggle from '$lib/components/forms/Toggle.svelte';
    import { login } from '$lib/repo/session.repo';
    import type { LoginForm } from '$lib/models/accounts/forms';

    let submitting = false;
    const dispatch = createEventDispatcher();

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            submitting = true;

            const formInfo: LoginForm = {
                email: values.email,
                password: values.password,
                rememberMe: values.rememberMe,
            };

            await login(formInfo).then(() => {
                submitting = false;
                dispatch('login');
            });
        },
        validate: (values) => {
            const errors = {
                email: '',
                password: '',
            };
            if (!values.email || !/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(values.email)) {
                errors.email = 'Not a valid email address.';
            }
            if (!values.password) {
                errors.password = `Aren't you forgetting something?`;
            }
            return errors;
        },
        onError: () => {
            submitting = false;
        },
    });
</script>

<form class="flex flex-col" use:form>
    <TextField
        name="email"
        type="email"
        title="Email address"
        placeholder="somebody@example.net"
        errorMessage={$errors.email}
    />
    <TextField
        name="password"
        type="password"
        title="Password"
        placeholder="••••••••••"
        errorMessage={$errors.password}
    />
    <div class="my-1">
        <a href="/" class="text-sm">Forgot your password?</a>
    </div>
    <div class="flex items-center">
        <Toggle bind:value={$data.rememberMe}>Remember me</Toggle>
        <div class="flex-1" />
        <Button type="submit" loading={submitting} loadingText="Signing in...">
            <LoginCircleLine class="button-icon" />
            <span class="button-text">Log In</span>
        </Button>
    </div>
</form>
