<script lang="ts">
  import { AppleFill, ArrowRightSLine, GoogleFill, LoginCircleLine, UserAddLine } from "svelte-remixicon";
  import { toast } from "@zerodevx/svelte-toast";
  import { nextPage } from "../guide.state";
  import LoginPanel from "./LoginPanel.svelte";
  import SignUpPanel from "./SignUpPanel.svelte";

  const iconSize = "24px";
</script>

<div class="panel-container flex flex-col" style="height: calc(100vh - 96px);">
  <div class="flex-1 flex flex-col items-center justify-center">
    <h1 class="text-3xl px-4 py-2">Welcome to Offprint</h1>
    <img src="/images/Beatriz.png" class="object-cover max-h-72" />
  </div>
  <div class="content-container">
    <div class="panel-section">
      <button class="nav-button" on:click={() => nextPage(LoginPanel)}>
        <LoginCircleLine size={iconSize} />
        <span>Log in with Email</span>
        <ArrowRightSLine class="text-zinc-400" />
      </button>
      <button class="nav-button" on:click={() => nextPage(SignUpPanel)}>
        <UserAddLine size={iconSize} />
        <span>Sign up with Email</span>
        <ArrowRightSLine class="text-zinc-400" />
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
</div>

<style lang="scss">
  @use '../Guide';

  button.oauth-sign-in {
    @apply flex items-center justify-center py-4 w-full rounded-lg transition transform drop-shadow-md mb-2 last:mb-0;
    span {
      @apply relative top-[0.075rem] ml-2;
    }
  }
</style>