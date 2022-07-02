<script lang="ts">
  import { createForm } from "felte";
  import { Checkbox, TextField } from "../../forms";
  import { Button } from "../../util";
  import { AppleFill, GoogleFill, LoginCircleLine } from "svelte-remixicon";
  import { nextPage } from "../guide.state";
  import type { LoginForm } from "../../../models/accounts/forms";
  import SignUpPanel from "./SignUpPanel.svelte";
  import toast from "svelte-french-toast";

  const { form, data, errors, isSubmitting } = createForm({
    onSubmit: async (values) => {
      const formInfo: LoginForm = {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      };

      await fetch('/api/auth/log-in', { method: 'POST', body: JSON.stringify(formInfo) })
        .then(async (data) => {
          const account = await data.json();
          console.log(account);
          toast.success('Welcome back!');
        })
        .catch(err => {
          console.log(err);
          toast.error('Something went wrong!');
        });
    }
  });
</script>

<div class="pt-12 pb-6 px-3">
  <h1 class="text-4xl mb-4">Log In</h1>
  <form use:form>
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
    <div class="my-4">
      <a href="/registration/request-password-reset" class="text-sm">Forgot your password?</a>
    </div>
    <div class="flex items-center">
      <Checkbox bind:value={$data.rememberMe}>Remember me</Checkbox>
      <div class="flex-1"></div>
      <Button kind="primary" type="submit" loading={$isSubmitting} loadingText="Signing in...">
        <LoginCircleLine class="button-icon" />
        <span class="button-text">Log In</span>
      </Button>
    </div>
  </form>
  <div class="self-center my-4 text-center text-sm">
    <button
      class="hover:underline"
      style="color: var(--accent);"
      on:click={() => nextPage(SignUpPanel)}
    >
      Not registered? Sign up today!
    </button>
  </div>
  <div class="mt-4 py-4 border-t border-zinc-300 dark:border-zinc-700">
    <button class="oauth-sign-in bg-black text-white hover:bg-zinc-800" on:click={() => toast.error('This feature is not yet available.')}>
      <AppleFill size="24px" />
      <span>Log in with Apple</span>
    </button>
    <button class="oauth-sign-in bg-blue-500 hover:bg-blue-400 text-white" on:click={() => toast.error('This feature is not yet available.')}>
      <GoogleFill size="24px" />
      <span>Log in with Google</span>
    </button>
  </div>
</div>

<style lang="scss">
  button.oauth-sign-in {
    @apply flex items-center justify-center py-4 w-full rounded-lg transition transform drop-shadow-md mb-2 last:mb-0;
    span {
      @apply relative top-[0.075rem] ml-2;
    }
  }
</style>
