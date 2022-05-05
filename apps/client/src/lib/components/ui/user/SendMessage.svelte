<script lang="ts">
    import { CloseLine, MailSendLine } from 'svelte-remixicon';
    import { createForm } from 'felte';
    import { closePopup, popup } from '$lib/components/nav/popup';
    import { Button } from '$lib/components/ui/misc';

    $: items = $popup.data;

    const { form, data, isSubmitting } = createForm({
        onSubmit: (values) => {
            console.log(values);
        },
        validate: (values) => {
            const errors = {
                message: ''
            };

            if (values.message === null || values.message.length < 3 || values.message.length > 1000) {
                errors.message = 'Messages must be between 3 and 1000 characters long.';
            }

            return errors;
        },
        initialValues: {
            message: null,
        }
    })
</script>

<div class="send-message-box bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed">
    <div class="flex items-center border-b-2 border-zinc-500 px-4 py-2 w-full">
        <h3 class="font-medium text-2xl flex-1">Send Message</h3>
        <Button on:click={closePopup}>
            <CloseLine size="20px" class="button-icon no-text" />
        </Button>
    </div>
    <form class="flex-1 p-4 w-[24rem]" use:form>
        <textarea
            class="rounded-lg w-full bg-zinc-400 dark:bg-zinc-500 ring-0 placeholder-zinc-300 dark:placeholder-zinc-400 px-1.5 py-2.5 border-0 min-h-[1rem]"
            name="message"
            value={$data.message}
            placeholder="Something awesome about me is..."
        />
        <div class="flex items-center justify-center mt-2">
            <Button type="submit" isLoading={$isSubmitting}>
                <MailSendLine class="button-icon" />
                <span class="button-text">Send</span>
            </Button>
        </div>
    </form>
</div>

<style lang="scss">
    div.send-message-box {
        @apply rounded-lg max-h-screen;
        box-shadow: var(--dropshadow);
    }
</style>