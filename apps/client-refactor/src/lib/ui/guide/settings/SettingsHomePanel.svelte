<script lang="ts">
  import {
    ArrowRightSLine,
    EarthLine,
    FilterLine,
    InformationLine,
    PaletteLine,
    ShieldUserLine,
    UserSettingsLine,
    Window2Line
  } from "svelte-remixicon";
  import { nextPage } from "../guide.state";
  import { AboutPanel, FiltersPanel, LocalizationPanel, ThemesPanel } from "./general";
  import { AccountInfoPanel, SecurityPrivacyPanel, SessionsPanel } from "./account";
  import { account } from "../../../state/account.state.js";

  const iconSize = "24px";
</script>

<div class="panel-container">
  <div class="content-container">
    <!--General Settings-->
    <div class="panel-section">
      <h3>General</h3>
      <div>
        <button class="nav-button" on:click={() => nextPage(AboutPanel)}>
          <InformationLine size={iconSize} />
          <span>About</span>
          <ArrowRightSLine class="text-zinc-400" />
        </button>
        <button class="nav-button" on:click={() => nextPage(LocalizationPanel)}>
          <EarthLine size={iconSize} />
          <span>Localization</span>
          <ArrowRightSLine class="text-zinc-400" />
        </button>
        <button class="nav-button" on:click={() => nextPage(FiltersPanel)}>
          <FilterLine size={iconSize} />
          <span>Filters</span>
          <ArrowRightSLine class="text-zinc-400" />
        </button>
        <button class="nav-button" on:click={() => nextPage(ThemesPanel)}>
          <PaletteLine size={iconSize} />
          <span>Themes</span>
          <ArrowRightSLine class="text-zinc-400" />
        </button>
      </div>
    </div>
    <!--Account Settings-->
    {#if $account.account !== null}
      <div class="panel-section">
        <h3>Account</h3>
        <div>
          <button class="nav-button" on:click={() => nextPage(AccountInfoPanel)}>
            <UserSettingsLine size={iconSize} />
            <span>Account Info</span>
            <ArrowRightSLine class="text-zinc-400" />
          </button>
          <button class="nav-button" on:click={() => nextPage(SessionsPanel)}>
            <Window2Line size={iconSize} />
            <span>Sessions</span>
            <ArrowRightSLine class="text-zinc-400" />
          </button>
          <button class="nav-button" on:click={() => nextPage(SecurityPrivacyPanel)}>
            <ShieldUserLine size={iconSize} />
            <span>Security & Privacy</span>
            <ArrowRightSLine class="text-zinc-400" />
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../Guide';
</style>