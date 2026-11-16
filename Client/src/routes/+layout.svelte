<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.png';
	import appIcon from '#lib/assets/images/offprint-icon.png';
	import type { LayoutProps } from './$types';
	import { AppState } from '#lib/state/app.svelte.ts';
	import { AuthState } from '#lib/state/auth.svelte.ts';
	import { onNavigate } from '$app/navigation';

	let { children }: LayoutProps = $props();

	// View transitions
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// Provide app state
	const app = AppState.provideState();
	$effect(() => {
		// sets the background color for iOS
		document.body.style.backgroundColor = `rgb(${app.accentColor})`;
	});

	// Provide auth state
	AuthState.provideState();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" type="image/png" href={appIcon} />
	<meta name="theme-color" content={`${app.accentColor}`} />
	<title>Offprint</title>
</svelte:head>

<main class={`${app.compositeTheme}`}>
	{@render children()}
</main>
