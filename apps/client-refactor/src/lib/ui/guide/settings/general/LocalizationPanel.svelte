<script lang="ts">
  import { ArrowLeftSLine } from "svelte-remixicon";
  import { Button } from "../../../util";
  import { prevPage } from "../../guide.state";
</script>

<div class="panel-container">
  <div class="topbar">
    <div class="left-button">
      <Button on:click={prevPage}>
        <ArrowLeftSLine class="button-icon" />
        <span class="button-text">Settings</span>
      </Button>
    </div>
  </div>
  <div class="content-container">
    <div class="empty">
      <h3>Pardon the dust—</h3>
      <p>This feature is not yet available.</p>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../Guide';
</style>