<script lang="ts">
    import { session } from '$lib/repo/session.repo';
    import { approvalQueue, approveItem, rejectItem } from '$lib/repo/approval-queue.repo';
    import { isAllowed } from '$lib/services/auth.service';
    import { Roles } from '$lib/models/accounts';
    import Button from '$lib/components/ui/misc/Button.svelte';
    import { CheckLine, CloseLine } from 'svelte-remixicon';
    import { Decision } from '$lib/models/admin/approval-queue';

    async function submitApproval() {
        const decision: Decision = {
            docId: $approvalQueue.currItem._id,
            workId: $approvalQueue.currItem.workToApprove._id,
            authorId: $approvalQueue.currItem.workToApprove.author._id,
        };

        await approveItem($session.currProfile._id, decision);
    }

    async function submitRejection() {
        const decision: Decision = {
            docId: $approvalQueue.currItem._id,
            workId: $approvalQueue.currItem.workToApprove._id,
            authorId: $approvalQueue.currItem.workToApprove.author._id,
        };

        await rejectItem($session.currProfile._id, decision);
    }
</script>

{#if $session.currProfile && $approvalQueue.currItem}
    {#if isAllowed($session.currProfile.roles, [Roles.Admin, Roles.Moderator, Roles.WorkApprover])}
        {#if $approvalQueue.currItem.claimedBy && $approvalQueue.currItem.claimedBy._id === $session.currProfile._id}
            <div
                class="flex items-center justify-center w-11/12 mx-auto md:max-w-3xl p-4 rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:highlight-shadowed"
            >
                <Button kind="primary" on:click={submitApproval}>
                    <CheckLine class="button-icon" />
                    <span class="button-text">Approve</span>
                </Button>
                <div class="mx-1"><!--separator--></div>
                <Button on:click={submitRejection}>
                    <CloseLine class="button-icon" />
                    <span class="button-text">Reject</span>
                </Button>
            </div>
        {/if}
    {/if}
{/if}
