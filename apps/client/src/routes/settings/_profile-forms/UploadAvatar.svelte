<script lang="ts">
    import { http } from '$lib/services/http';
    import { baseUrl } from '$lib/util';
    import { updateAvatarForm, profileSettings } from './form-state';
    import { closePopup } from '$lib/components/nav/popup';
    import { CloseLine, Loader5Line, UploadCloudLine } from 'svelte-remixicon';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { success, failure } from '$lib/services/alerts.service';
    import Cropper from 'svelte-easy-crop';
    import getCroppedImg, { base64ToFile } from '$lib/services/image.service';
    import type { Profile } from '$lib/models/accounts';

    let file: File = null;
    let crop = { x: 0, y: 0 };
    let aspectRatio = 4 / 4;
    let isCropping = false;
    let imageSrc = null;
    let pixelCrop = null;
    let isUploading = false;

    function handleDrop(event: DragEvent): void {
        const items = event.dataTransfer.items;
        const files = event.dataTransfer.files;
        const reader = new FileReader();
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
                reader.onload = (e) => {
                    imageSrc = e.target.result;
                };
                reader.readAsDataURL(file);
                isCropping = true;
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
                reader.onload = (e) => {
                    imageSrc = e.target.result;
                };
                reader.readAsDataURL(file);
                isCropping = true;
            } else {
                failure(`Unsupported file type '${file.type}'`);
            }
        }
    }

    function handleFileSelected(e) {
        let imageFile = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            imageSrc = e.target.result;
        };
        reader.readAsDataURL(imageFile);
        isCropping = true;
    }

    function cancelUpload() {
        isCropping = false;
        imageSrc = null;
        pixelCrop = null;
        file = null;
    }

    async function uploadImage() {
        isUploading = true;
        let croppedImage = await getCroppedImg(imageSrc, pixelCrop);
        let imageToUpload = base64ToFile(croppedImage, 'avatar');
        let formData = new FormData();
        formData.append('avatar', imageToUpload);

        await http
            .post<Profile>(
                `${baseUrl}/user/upload-avatar?pseudId=${$profileSettings.currProfile._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            .then((res) => {
                const url = res.data;
                updateAvatarForm($profileSettings.currProfile._id, url);
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

<div
    class="upload-container bg-zinc-300 dark:bg-zinc-700"
    class:pb-4={!isCropping}
    class:pb-2={isCropping}
>
    <div class="flex items-center border-b-2 border-zinc-500 px-4 py-2 w-full">
        <h3 class="font-medium text-2xl flex-1">Upload Avatar</h3>
        {#if !isUploading}
            <Button on:click={closePopup}>
                <CloseLine size="20px" class="button-icon no-text" />
            </Button>
        {/if}
    </div>
    {#if isCropping}
        <div class="min-w-[24rem] min-h-[24rem] max-w-[30rem] max-h-[30rem] relative">
            <Cropper
                image={imageSrc}
                bind:crop
                aspect={aspectRatio}
                on:cropcomplete={(e) => (pixelCrop = e.detail.pixels)}
            />
        </div>
        {#if isUploading}
            <div class="mt-4 mb-2">
                <div class="flex items-center justify-center">
                    <Loader5Line class="animate-spin mr-2" size="24px" />
                    <span class="text-xs uppercase font-bold tracking-widest">Uploading...</span>
                </div>
            </div>
        {:else}
            <div class="flex items-center justify-center pt-2">
                <Button on:click={cancelUpload}>
                    <CloseLine class="button-icon" />
                    <span class="button-text">Cancel</span>
                </Button>
                <div class="mx-1"><!--spacer--></div>
                <Button on:click={uploadImage}>
                    <UploadCloudLine class="button-icon" />
                    <span class="button-text">Upload</span>
                </Button>
            </div>
        {/if}
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
