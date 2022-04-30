<script lang="ts">
    import { CloseLine, DeleteBinLine } from 'svelte-remixicon';
    import { closePopup, closePopupAndConfirm } from '$lib/components/nav/popup';
    import Button from '$lib/components/ui/misc/Button.svelte';
</script>

<div class="upload-container bg-zinc-300 dark:bg-zinc-700 pb-4">
    <div class="flex items-center border-b-2 border-zinc-500 px-4 py-2 w-full">
        <h3 class="font-medium text-2xl flex-1">Are you sure you want to delete this section?</h3>
        <Button on:click={closePopup}>
            <CloseLine size="20px" class="button-icon no-text" />
        </Button>
    </div>
    <div class="flex flex-row items-center justify-center w-full">
        <Button on:click={closePopupAndConfirm}>
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
