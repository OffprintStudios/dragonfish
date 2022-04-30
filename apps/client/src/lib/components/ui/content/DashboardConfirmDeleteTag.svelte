<script lang="ts">
    import { CloseLine, DeleteBinLine } from 'svelte-remixicon';
    import { closePopup, closePopupAndConfirm, getData } from '$lib/components/nav/popup';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { TextField } from '$lib/components/forms';
    import { createForm } from 'felte';
    import type { TagsModel } from '$lib/models/content/works';
    import { tags } from '$lib/services';
    import { pluralize } from '$lib/util';

    const { form, data, errors, isSubmitting } = createForm({
        onSubmit: async () => {
            tags.deleteTag(getTag()._id).subscribe(() => {
                closePopupAndConfirm();
            })
        },
        validate: ((values) => {
            const errors = {
                name: '',
            };

            if (values.name !== getTag().name) {
                errors.name = 'Incorrect tag name';
            }

            return errors;
        }),
    });

    function getTag(): TagsModel {
        return getData().tag as TagsModel;
    }
</script>

<form use:form>
    <div class="upload-container bg-zinc-300 dark:bg-zinc-700 pb-4">
        <div class="flex items-center border-b-2 border-zinc-500 px-4 py-2 w-full">
            <h3 class="font-medium text-2xl flex-1">Are you sure you want to delete this tag?</h3>
            <Button on:click={closePopup}>
                <CloseLine size="20px" class="button-icon no-text" />
            </Button>
        </div>
        <div class="items-center px-4 py-2 w-full">
            This has {getTag().taggedWorks} tagged work{pluralize(getTag().taggedWorks)}. Type in {getTag().name} to delete it.
        </div>
        <TextField
                name="name"
                type="text"
                placeholder="Tag name"
                errorMessage={$errors.name}
            />
        <div class="flex flex-row items-center justify-center w-full">
            <Button type="submit" loading={$isSubmitting} loadingText="Deleting...">
                <DeleteBinLine class="button-icon" />
                <span class="button-text">Yes, delete</span>
            </Button>
            <div class="mx-0.5"><!--separator--></div>
            <Button on:click={closePopup}>
                <CloseLine class="button-icon" />
                <span class="button-text">No, cancel</span>
            </Button>
        </div>
    </div>
</form>
