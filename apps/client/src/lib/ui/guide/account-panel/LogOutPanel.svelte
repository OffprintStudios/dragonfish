<script lang="ts">
    import { close, prevPage } from '$lib/ui/guide';
    import { ArrowLeftSLine, CheckLine, CloseLine } from 'svelte-remixicon';
    import { Button } from '$lib/components/ui/misc';
    import { logout } from '$lib/repo/session.repo';

    async function logOut() {
        await logout().then(() => {
            close();
        });
    }
</script>

<div class="h-screen max-w-[24rem] flex flex-col overflow-y-auto">
    <div class="sticky flex items-center px-4 h-16 place-content-between" style="background: var(--accent);">
        <div class="w-1/4">
            <Button kind="primary" title="Go Back" on:click={prevPage}>
                <ArrowLeftSLine class="button-icon no-text" size="24px" />
            </Button>
        </div>
        <div class="text-center w-2/4 font-bold tracking-widest uppercase text-xs text-white">
            log out
        </div>
        <div class="w-1/4">
            <!--spacer-->
        </div>
    </div>
    <div class="mt-16">
        <div class="empty">
            <h3 class="text-2xl">Going so soon?</h3>
            <p class="text-sm">Are you sure you want to log out?</p>
        </div>
        <div class="flex items-center w-full justify-center mt-8">
            <Button on:click={logOut}>
                <CheckLine class="button-icon" />
                <span class="button-text">Yes</span>
            </Button>
            <div class="mx-2"><!--spacer--></div>
            <Button on:click={prevPage}>
                <CloseLine class="button-icon" />
                <span class="button-text">No</span>
            </Button>
        </div>
    </div>
</div>
