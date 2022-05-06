<script lang="ts">
    export let src: string;
    export let alt = 'avatar';
    export let size = '12rem';
    export let borderWidth = '4px';
    export let title = 'avatar';
</script>

<div
    class="rounded-full border-zinc-300 dark:border-white bg-zinc-300 dark:bg-white overflow-hidden"
    style="min-height: {size}; min-width: {size}; max-height: {size}; max-width: {size}; border-width: {borderWidth}"
    {title}
>
    <img {src} {alt} class="object-contain w-full h-full" />
</div>
