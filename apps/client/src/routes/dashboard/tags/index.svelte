<script lang="ts">
    import { TagKind, TagsModel, TagsTree } from "$lib/models/content/works";

    import { tags } from "$lib/services";
    import { formatTagName, slugify } from "$lib/util";

    import { onMount } from "svelte";
    import { openPopup, PopupOnConfirm } from '$lib/components/nav/popup';
    import DashboardTagsForm from "$lib/components/ui/content/DashboardTagsForm.svelte";
    import { DeleteBinLine } from "svelte-remixicon";
    import DashboardConfirmDeleteTag from "$lib/components/ui/content/DashboardConfirmDeleteTag.svelte";

    class AlphabeticalTags {
        tags: TagsTree[] = [];
        constructor(public letter: string) {
        }
    }

    let alphabeticalTags: AlphabeticalTags[] = [];

    onMount(() => {
        loadTags()
    })

    function loadTags() {
        tags.fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
            let savedLetter: string;
            let currentAlphaTags: AlphabeticalTags;
            alphabeticalTags = [];
            for (const tag of tagTrees) {
                // If first letter doesn't match saved letter, save letter and move to new section
                // Then either way, add to that letter's array
                if (savedLetter !== tag.name[0].toUpperCase()) {
                    if (currentAlphaTags) {
                        alphabeticalTags = [... alphabeticalTags, currentAlphaTags]
                    }
                    savedLetter = tag.name[0].toUpperCase();
                    currentAlphaTags = new AlphabeticalTags(tag.name[0].toUpperCase());
                }
                currentAlphaTags.tags.push(tag);
            }
            // Add last set
            if (currentAlphaTags) {
                alphabeticalTags = [... alphabeticalTags, currentAlphaTags]
            }
        });
    }

    function getChildrenWithWorks(tagsTree: TagsTree): TagsModel[] {
        const childrenWithWorks: TagsModel[] = [];
        for (const child of tagsTree.children) {
            childrenWithWorks.push(child);
        }
        return childrenWithWorks;
    }

    class OnConfirmRefresh implements PopupOnConfirm {
        onConfirm(): void {
            loadTags();
        }
    }
</script>

<svelte:head>
    <title>Tags Management &mdash; Offprint</title>
</svelte:head>

<div class="w-full min-h-screen md:h-screen overflow-y-auto flex flex-col mx-auto p-2">
    <div class="flex flex-wrap items-center justify-center text-2xl">
        {#each alphabeticalTags as section, index}
            {#if index !== 0}
                &nbsp;
            {/if}
            <a href="tags#{section.letter}">
                {section.letter}
            </a>
        {/each}
    </div>
    <p>
    <button on:click={() => openPopup(DashboardTagsForm, new OnConfirmRefresh(), {isCreate: true})}>
        CREATE TAG
    </button>
    <p>
    {#each alphabeticalTags as section}
        <h3 class="text-2xl">
            <a id="{section.letter}">
                {section.letter}
            </a>
        </h3>
        {#each section.tags as tag}
            <div>
                <a
                    href="/tag/{tag._id}/{slugify(tag.name)}"
                >
                    {formatTagName(tag)}
                </a>
                ({tag.taggedWorks ? tag.taggedWorks : 0})
                <button on:click={() => openPopup(DashboardTagsForm, new OnConfirmRefresh(), {isCreate: false, tag: tag})}>
                    EDIT
                </button>
                <button on:click={() => openPopup(DashboardConfirmDeleteTag, new OnConfirmRefresh(), {tag: tag})}>
                    <DeleteBinLine class="button-icon no-text" />
                </button>
                <ul>
                    {#each getChildrenWithWorks(tag) as child}
                        <div>
                            <li>
                                <a
                                    href="/tag/{child._id}/{slugify(child.name)}"
                                >
                                    {child.name}
                                </a>
                                ({child.taggedWorks ? child.taggedWorks : 0})
                                <button on:click={() => openPopup(DashboardTagsForm, new OnConfirmRefresh(), {isCreate: false, tag: child})}>
                                    EDIT
                                </button>
                                <button on:click={() => openPopup(DashboardConfirmDeleteTag, new OnConfirmRefresh(), {tag: child})}>
                                    <DeleteBinLine class="button-icon no-text" />
                                </button>
                            </li>
                        </div>
                    {/each}
                </ul>
            </div>
        {/each}
        <p>
    {/each}
</div>

<style lang="scss">
    ul {
        list-style: disc;
        list-style-position: inside;
        padding-left: 1rem;
    }
</style>
