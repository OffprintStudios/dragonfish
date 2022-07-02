import toast from "svelte-french-toast";

export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied!');
  });
}
