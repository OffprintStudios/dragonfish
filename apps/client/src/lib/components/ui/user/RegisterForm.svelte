<script lang="ts">
    // TODO: verify that the registration form works correctly

    import { createEventDispatcher } from 'svelte';
    import { createForm } from 'felte';
    import { UserAddLine } from 'svelte-remixicon';
    import TextField from '$lib/components/forms/TextField.svelte';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import Toggle from '$lib/components/forms/Toggle.svelte';
    import { register } from '$lib/repo/session.repo';
    import type { RegisterForm } from '$lib/models/accounts/forms';

    let submitting = false;
    const dispatch = createEventDispatcher();

    const { form, data, errors } = createForm({
        onSubmit: async (values) => {
            console.log("Submitting registration form");
            submitting = true;
            const formInfo: RegisterForm = {
                email: values.email,
                password: values.password,
                inviteCode: values.inviteCode,
                termsAgree: values.termsAgree,
            };

            await register(formInfo).then(() => {
                console.log("Finished registering, should redirect to profile screen");
                submitting = false;
                dispatch('register');
            });
        },
        validate: (values) => {
            const errors = {
                email: '',
                password: '',
                repeatPassword: '',
                inviteCode: '',
                ageCheck: '',
                termsAgree: '',
            };
            if (!values.email || !/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(values.email)) {
                errors.email = `That's not a valid email address.`;
            }
            if (!values.password) {
                errors.password = `Aren't you forgetting something?`;
            }
            if (values.password && values.password.length < 8) {
                errors.password = `Passwords must be at least 8 characters long.`;
            }
            if (!values.repeatPassword || values.password !== values.repeatPassword) {
                errors.repeatPassword = `Passwords must match.`;
            }
            if (!values.inviteCode) {
                errors.inviteCode = `You must provide an invite code.`;
            }
            if (values.ageCheck === false) {
                errors.ageCheck = `You must be at least 13 years or older to join.`;
            }
            if (values.termsAgree === false) {
                errors.termsAgree = `You must agree in order to join.`;
            }
            return errors;
        },
        onError: (error) => {
            console.log("Registration error: " + error);
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
    <TextField
        name="repeatPassword"
        type="password"
        title="Repeat Password"
        placeholder="••••••••••"
        errorMessage={$errors.repeatPassword}
    />
    <TextField
        name="inviteCode"
        type="text"
        title="Invite Code"
        placeholder="myInviteCode"
        errorMessage={$errors.inviteCode}
    />
    <div class="my-0.5" />
    <Toggle bind:value={$data.ageCheck}>I am 13 years of age or older.</Toggle>
    <Toggle bind:value={$data.termsAgree}>
        I agree to the Terms & Conditions, Privacy Policy, and Code of Conduct.
    </Toggle>
    <div class="flex items-center">
        <div class="flex-1" />
        <Button type="submit" loading={submitting} loadingText="Signing up...">
            <UserAddLine class="button-icon" />
            <span class="button-text">Sign up</span>
        </Button>
    </div>
</form>
