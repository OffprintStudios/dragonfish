<script lang="ts">
  import { ArrowLeftSLine } from "svelte-remixicon";
  import { Button } from "../../../util";
  import { prevPage } from "../../guide.state";
</script>

<div class="panel-container">
  <div class="topbar">
    <div class="left-button">
      <Button kind="primary" on:click={prevPage}>
        <ArrowLeftSLine class="button-icon no-text" size="20px" />
      </Button>
    </div>
    <div class="header">
      Security & Privacy
    </div>
    <div class="right-button">
      <!--spacer-->
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