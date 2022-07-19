<script lang="ts">
  import {
    ArrowLeftSLine,
    ArticleLine,
    CodeLine,
    CupFill,
    DiscordFill,
    ExternalLinkLine,
    FilePaper2Line,
    GithubFill,
    HeartLine,
    Lock2Line,
    NewspaperLine,
    PatreonFill,
    QuestionLine,
    TwitterFill
  } from "svelte-remixicon";
  import { Button } from "../../../util";
  import { prevPage } from "../../guide.state";
  import { copyToClipboard, VERSION } from "../../../../util";

  const iconSize = "24px";
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
  <div class="content-container py-6">
    <div class="panel-section">
      <div>
        <button class="nav-button" on:click={() => copyToClipboard(VERSION)}>
          <CodeLine size={iconSize} />
          <span>Version</span>
          <span class="text-zinc-400" style="text-align: right;">{VERSION}</span>
        </button>
      </div>
    </div>
    <div class="panel-section">
      <div>
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
      </div>
    </div>
    <div class="panel-section">
      <div>
        <a href="https://www.patreon.com/offprintstudios" class="nav-button" target="_blank">
          <PatreonFill size={iconSize} />
          <span>Patreon</span>
          <ExternalLinkLine class="text-zinc-400" />
        </a>
        <a href="https://ko-fi.com/offprintstudios" class="nav-button" target="_blank">
          <CupFill size={iconSize} />
          <span>Ko-Fi</span>
          <ExternalLinkLine class="text-zinc-400" />
        </a>
      </div>
    </div>
    <div class="panel-section">
      <div>
        <a href="https://github.com/OffprintStudios/dragonfish" class="nav-button" target="_blank">
          <GithubFill size={iconSize} />
          <span>GitHub</span>
          <ExternalLinkLine class="text-zinc-400" />
        </a>
        <a href="https://twitter.com/offprintstudios?s=21&t=IIRYw4Wr6tug7Cg1p-CSEQ" class="nav-button" target="_blank">
          <TwitterFill size={iconSize} />
          <span>Twitter</span>
          <ExternalLinkLine class="text-zinc-400" />
        </a>
        <a href="https://discord.gg/9cnSwfn" class="nav-button" target="_blank">
          <DiscordFill size={iconSize} />
          <span>Discord</span>
          <ExternalLinkLine class="text-zinc-400" />
        </a>
      </div>
    </div>
    <span class="flex items-center justify-center">Made with <HeartLine class="mx-1.5" size="20px" /> by Offprint Studios</span>
    <span class="flex items-center justify-center">&copy; 2022 Alyx Mote</span>
  </div>
</div>

<style lang="scss">
  @use '../../Guide';
</style>