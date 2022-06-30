<script lang="ts">
  import {
    ArrowLeftSLine,
    ArticleLine,
    ExternalLinkLine,
    FilePaper2Line,
    GithubLine,
    HeartLine,
    Lock2Line,
    NewspaperLine,
    QuestionLine
  } from "svelte-remixicon";
  import { Button } from "../../../util";
  import { prevPage } from "../../guide.state";

  const iconSize = "24px";
</script>

<div class="panel-container">
  <div class="topbar">
    <div class="left-button">
      <Button kind="primary" on:click={prevPage}>
        <ArrowLeftSLine class="button-icon no-text" size="20px" />
      </Button>
    </div>
    <div class="header">
      About
    </div>
    <div class="right-button">
      <!--spacer-->
    </div>
  </div>
  <div class="content-container text-center py-6 flex flex-col">
    <div class="mb-6">
      <a href="https://offprint.notion.site/Terms-of-Service-131ffadce0eb4e8a947144ddc70ef89b" class="nav-button" target="_blank">
        <NewspaperLine size={iconSize} />
        <span>Terms of Service</span>
        <ExternalLinkLine class="text-zinc-400" />
      </a>
      <a href="https://offprint.notion.site/Privacy-Policy-f22e8ccb9e9043dca23a29a7089c72f4" class="nav-button" target="_blank">
        <Lock2Line size={iconSize} />
        <span>Privacy Policy</span>
        <ExternalLinkLine class="text-zinc-400" />
      </a>
      <a href="https://offprint.notion.site/The-Offprint-Constitution-ae58c23db7264280a319d1cdfa10bc41" class="nav-button" target="_blank">
        <FilePaper2Line size={iconSize} />
        <span>Offprint Constitution</span>
        <ExternalLinkLine class="text-zinc-400" />
      </a>
      <a href="https://offprint.notion.site/Offprint-Omnibus-23ef302b8f7f4dd0bda13ba6e2471007" class="nav-button" target="_blank">
        <ArticleLine size={iconSize} />
        <span>Offprint Omnibus</span>
        <ExternalLinkLine class="text-zinc-400" />
      </a>
      <a href="https://offprint.notion.site/What-is-Offprint-ac292f99beb1463c9cdaeb7f53557c74" class="nav-button" target="_blank">
        <QuestionLine size={iconSize} />
        <span>What is Offprint?</span>
        <ExternalLinkLine class="text-zinc-400" />
      </a>
      <a href="https://github.com/OffprintStudios/dragonfish" class="nav-button" target="_blank">
        <GithubLine size={iconSize} />
        <span>Repository</span>
        <ExternalLinkLine class="text-zinc-400" />
      </a>
    </div>

    <span>Offprint is built entirely with open source software. All licenses are available on our repository.</span>
    <span class="my-2">Contributions and Stars are welcome!</span>
    <div class="my-4"></div>
    <span class="flex items-center justify-center">Made with <HeartLine class="mx-1.5" size="20px" /> by Offprint Studios</span>
    <span>&copy; 2022 Alyx Mote</span>
    <span>v1.0.0-alpha.010</span>
  </div>
</div>

<style lang="scss">
  @use '../../Guide';

  button.nav-button, a.nav-button {
    @apply flex items-center block no-underline p-4 border-b border-zinc-300 dark:border-zinc-700 w-full last:border-0 first:rounded-t-lg last:rounded-b-lg bg-zinc-200 dark:bg-zinc-500;
    color: var(--text-color);
    &:hover {
      @apply bg-zinc-300;
    }
    span {
      @apply ml-2 flex-1 text-left;
    }
  }
</style>