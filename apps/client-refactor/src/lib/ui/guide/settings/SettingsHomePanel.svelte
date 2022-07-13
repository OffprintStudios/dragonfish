<script lang="ts">
  import { ArrowRightSLine, EarthLine, FilterLine, InformationLine, PaletteLine } from "svelte-remixicon";
  import { nextPage } from "../guide.state";
  import { AboutPanel, FiltersPanel, LocalizationPanel, ThemesPanel } from "./general";

  const iconSize = "24px";
</script>

<div class="panel-container">
  <div class="content-container">
    <h1 class="title">Settings</h1>
    <!--General Settings-->
    <div class="panel-section">
      <h3 class="title">General</h3>
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
    <!--<div class="panel-section">
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
    </div>-->
  </div>
</div>

<style lang="scss">
  @use '../Guide';
</style>