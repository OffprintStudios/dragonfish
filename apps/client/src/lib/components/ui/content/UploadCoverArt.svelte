<script lang="ts">
    import { CloseLine, Loader5Line } from 'svelte-remixicon';
    import { http } from '$lib/services/http';
    import { closePopup } from '$lib/components/nav/popup';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { failure, success } from '$lib/services/alerts.service';
    import { baseUrl } from '$lib/util';
    import { session } from '$lib/repo/session.repo';
    import { content } from '$lib/repo/content.repo';
    import type { Content } from '$lib/models/content';
    import type { Prose } from '$lib/models/content/works';
    import { ContentKind } from '$lib/models/content';

    let file: File = null;
    let isUploading = false;

    async function handleDrop(event: DragEvent): Promise<void> {
        const items = event.dataTransfer.items;
        const files = event.dataTransfer.files;
        if (items) {
            if (items.length > 1) {
                failure('You can only upload one image!');
                return;
            }

            file = items[0].getAsFile();
            if (
                file.type === 'image/png' ||
                file.type === 'image/jpeg' ||
                file.type === 'image/jpg'
            ) {
                await uploadImage(file);
            } else {
                failure(`Unsupported file type '${file.type}'`);
            }
        } else {
            if (files.length > 1) {
                failure('You can only upload one image!');
                return;
            }

            file = files[0];
            if (
                file.type === 'image/png' ||
                file.type === 'image/jpeg' ||
                file.type === 'image/jpg'
            ) {
                await uploadImage(file);
            } else {
                failure(`Unsupported file type '${file.type}'`);
            }
        }
    }

    async function handleFileSelected(e) {
        file = e.target.files[0];
        if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
            await uploadImage(file);
        } else {
            failure(`Unsupported file type '${file.type}'`);
        }
    }

    async function uploadImage(image: File) {
        isUploading = true;
        let formData = new FormData();
        formData.append('coverart', image);

        const url =
            $content.content.kind === ContentKind.ProseContent
                ? `${baseUrl}/content/prose/upload-coverart/${$content.content._id}?pseudId=${$session.currProfile._id}`
                : `${baseUrl}/content/poetry/upload-coverart/${$content.content._id}?pseudId=${$session.currProfile._id}`;

        await http
            .post<Content>(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 1000 * 60 * 2,
            })
            .then((res) => {
                const data = res.data;
                ($content.content as Prose).meta.coverArt = data.meta.coverArt;
                success(`Avatar updated.`);
                closePopup();
            })
            .catch((err) => {
                console.log(err);
                failure(`Something went wrong!`);
                isUploading = false;
            });
    }
</script>

<div class="upload-container bg-zinc-300 dark:bg-zinc-700 pb-4">
    <div class="flex items-center border-b-2 border-zinc-500 px-4 py-2 w-full">
        <h3 class="font-medium text-2xl flex-1">Upload Cover Art</h3>
        <Button on:click={closePopup}>
            <CloseLine size="20px" class="button-icon no-text" />
        </Button>
    </div>
    {#if isUploading}
        <div class="w-96 h-48 flex flex-col items-center justify-center">
            <div class="flex items-center justify-center">
                <Loader5Line class="animate-spin mr-2" size="24px" />
                <span class="text-xs uppercase font-bold tracking-widest">Uploading...</span>
            </div>
        </div>
    {:else}
        <div
            class="w-96 h-48 border-4 border-dashed border-zinc-500 rounded-lg flex flex-col items-center justify-center m-4 mb-0"
            on:drop|preventDefault={(e) => handleDrop(e)}
        >
            <h3 class="font-medium text-2xl">Drag & Drop</h3>
            <span class="text-sm">
                or
                <label>
                    <input
                        class="hidden"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        on:change={(e) => handleFileSelected(e)}
                    />
                    <span class="file-input">click here</span>
                </label> to pick something awesome
            </span>
        </div>
    {/if}
</div>

<style lang="scss">
    div.upload-container {
        @apply rounded-lg max-h-screen;
        box-shadow: var(--dropshadow);
    }
    span.file-input {
        @apply cursor-pointer;
        color: var(--accent);
        &:hover {
            @apply underline;
            color: var(--accent-dark);
        }
    }
</style>
