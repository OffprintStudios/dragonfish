<script lang="ts">
  import { Compass3Line, Home5Line, NavigationFill, TeamLine } from "svelte-remixicon";

  const iconSize = "24px";
</script>

<div class="panel-container">
  <div class="content-container">
    <div class="panel-section">
      <h3 class="title">Navigate</h3>
      <div>
        <a href="/" class="nav-button">
          <Home5Line size={iconSize} />
          <span>Home</span>
          <NavigationFill class="text-zinc-400" />
        </a>
        <a href="/explore" class="nav-button">
          <Compass3Line size={iconSize} />
          <span>Explore</span>
          <NavigationFill class="text-zinc-400" />
        </a>
        <a href="/social" class="nav-button">
          <TeamLine size={iconSize} />
          <span>Social</span>
          <NavigationFill class="text-zinc-400" />
        </a>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../Guide';
</style>