<script lang="ts">
    import type { FullAutoFill } from "svelte/elements";

    interface Props {
        name: string;
        label: string;
        type: 'text' | 'email' | 'password';
        placeholder: string;
        hint: string | null;
        errorMsg: string | null;
        autocomplete: FullAutoFill | null | undefined;
        required: boolean;
    }

    let { name, label, type = 'text', placeholder = 'Enter Text Here', hint = null, errorMsg = null, autocomplete = 'off', required = false}: Props = $props();
</script>

<div>
    <label for={name} class="flex items-center all-small-caps font-bold tracking-wide relative left-2 select-none">
        {label}<span class="text-red-600 text-xl relative top-0.5 ml-1">{required ? "*" : ""}</span>
        <span class="flex-1"></span>
        <span class="italic text-zinc-500 dark:text-zinc-400 relative right-4">{hint}</span>
    </label>
    <input
        id={name}
        {name}
        {type}
        {placeholder}
        {autocomplete}
        {required}
        class="transition w-full rounded-xl border-2 border-x-transparent border-t-transparent focus:border-x-transparent focus:border-t-transparent focus:ring-0 border-zinc-400 dark:border-b-zinc-500 bg-zinc-300/50 dark:bg-zinc-600/50 backdrop-blur-lg focus:border-b-accent dark:focus:border-b-accent"
    />
    <div class="flex pt-1">
        <span class="flex-1"></span>
        <span class="w-full text-right text-red-600 text-xs relative mr-2">{errorMsg}</span>
    </div>
</div>