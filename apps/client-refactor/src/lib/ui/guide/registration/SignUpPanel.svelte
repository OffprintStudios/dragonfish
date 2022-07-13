<script lang="ts">
  import { createForm } from "felte";
  import { UserAddLine } from "svelte-remixicon";
  import { Checkbox, TextField } from "../../forms";
  import { Button } from "../../util";
  import type { RegisterForm } from "../../../models/accounts/forms";
  import toast from "svelte-french-toast";

  const termsUrl = 'https://offprint.notion.site/Terms-of-Service-131ffadce0eb4e8a947144ddc70ef89b';
  const privacyUrl = 'https://offprint.notion.site/Privacy-Policy-f22e8ccb9e9043dca23a29a7089c72f4';
  const constitutionUrl = 'https://offprint.notion.site/The-Offprint-Constitution-ae58c23db7264280a319d1cdfa10bc41';

  const { form, data, errors, isSubmitting } = createForm({
    onSubmit: async (values) => {
      const formInfo: RegisterForm = {
        email: values.email,
        password: values.password,
        inviteCode: values.inviteCode,
        termsAgree: values.termsAgree,
      };

      await fetch('/api/auth/sign-up', { method: 'POST', body: JSON.stringify(formInfo), credentials: 'include' })
        .then(async (response) => {
          const data = await response.json();

          if (response.status === 422) {
            toast.error(data.message);
          } else if (response.status === 200) {
            console.log(data);
          } else {
            toast.error('Something went wrong! Try again in a little bit.');
          }
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
  });
</script>

<form class="flex flex-col pt-12 pb-6 px-3" use:form>
  <h1 class="text-4xl">Sign Up</h1>
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
  <div class="my-0.5"></div>
  <Checkbox bind:value={$data.ageCheck}>I am at least 13 years of age or older.</Checkbox>
  <Checkbox bind:value={$data.termsAgree}>
    I agree to the <a href={termsUrl} target="_blank">Terms of Service</a>, <a href={privacyUrl} target="_blank">Privacy Policy</a>, and <a href={constitutionUrl} target="_blank">Offprint Constitution</a>.
  </Checkbox>
  <div class="flex items-center mt-6">
    <div class="flex-1"></div>
    <Button kind="primary" type="submit" loading={$isSubmitting} loadingText="Signing up...">
      <UserAddLine class="button-icon" />
      <span class="button-text">Sign up</span>
    </Button>
  </div>
</form>