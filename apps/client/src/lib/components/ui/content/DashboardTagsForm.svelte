<script lang="ts">
    import { CloseLine, DeleteBinLine, Save2Line } from 'svelte-remixicon';
    import { closePopup, closePopupAndConfirm, getData } from '$lib/components/nav/popup';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { TagKind, TagsModel } from '$lib/models/content/works';
    import { onMount } from 'svelte';
    import { tags } from '$lib/services';
    import { createForm } from 'felte';
    import type { TagsForm } from '$lib/models/content/works/forms';
    import { Editor, SelectMenu, TextField } from '$lib/components/forms';
    import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from '$lib/util';

    const NO_PARENT = { value: null, label: "No Parent" };
    var parentOptions = [ NO_PARENT ];
    var currentParentOption: {value: string, label: string};
    var parentError = '';

    onMount(() => {
        tags.fetchTagsTrees(TagKind.Fandom).subscribe((tagTrees) => {
            for (const tree of tagTrees) {
                parentOptions = [...parentOptions, { value: tree._id, label: tree.name }];
            }
            currentParentOption = mapTag(isCreate() ? null : getTag().parent as string);
            $data.parent = currentParentOption;
        })
    })

    const { form, data, errors, isSubmitting } = createForm({
        onSubmit: async (values) => {
            parentError = '';

            const formInfo: TagsForm = {
                name: values.name.trim(),
                desc: values.desc ? values.desc.trim() : null,
                parent: currentParentOption ? currentParentOption.value : null,
            };

            if (isCreate()) {
                tags.createTag(TagKind.Fandom, formInfo).subscribe({
                    next: () => {
                        closePopupAndConfirm();
                    },
                    error: (e: Error) => {
                        parentError = e.message;
                    }
                })
            } else {
                tags.updateTag(getTag()._id, formInfo).subscribe({
                    next: () => {
                        closePopupAndConfirm();
                    },
                    error: (e: Error) => {
                        parentError = e.message;
                    }
                });
            }
        },
        validate: ((values) => {
            const errors = {
                name: '',
            };

            if (
                !values.name ||
                values.name.length < MIN_TITLE_LENGTH ||
                values.name.length > MAX_TITLE_LENGTH
            ) {
                errors.name = `Names must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`;
            }

            return errors;
        }),
        initialValues: {
            name: isCreate() ? null : getTag().name,
            desc: isCreate() ? null : getTag().desc,
            parent: mapTag(isCreate() ? null : getTag().parent as string),
        },
    });

    function mapTag(tagId: string): {value: string, label: string} {
        if (!tagId) tagId = null;
        return parentOptions.find((item) => {
            return item.value === tagId;
        });
    }

    function isCreate(): boolean {
        return getData().isCreate as boolean;
    }

    function getTag(): TagsModel {
        return getData().tag as TagsModel;
    }
</script>

<form use:form>
    <div class="upload-container bg-zinc-300 dark:bg-zinc-700 pb-4">
        <div class="flex items-center border-b-2 border-zinc-500 px-4 py-2 w-full">
            <h3 class="font-medium text-2xl flex-1">
                {#if isCreate()}
                    Create Tag
                {:else}
                    Edit Tag
                {/if}
            </h3>
            <Button on:click={closePopup}>
                <CloseLine size="20px" class="button-icon no-text" />
            </Button>
        </div>
        <TextField
            name="name"
            type="text"
            title="Name"
            placeholder="A Brand New World"
            errorMessage={$errors.name}
        />
        <Editor label="Description (Optional)" bind:value={$data.desc} />
        <SelectMenu
            items={parentOptions}
            label="Parent"
            bind:value={$data.parent}
            on:select={(e) => {
                currentParentOption = e.detail;
                $data.parent = e.detail;
            }}
            errorMessage={parentError}
        />
        <div class="flex flex-row items-center justify-center w-full">
            <Button type="submit" loading={$isSubmitting} loadingText="Saving...">
                <Save2Line class="button-icon" />
                <span class="button-text">Save</span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button on:click={closePopup}>
                <CloseLine class="button-icon" />
                <span class="button-text">Cancel</span>
            </Button>
        </div>
    </div>
</form>
