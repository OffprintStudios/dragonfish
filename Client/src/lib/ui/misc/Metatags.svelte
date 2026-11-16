<script lang="ts">
	import DefaultImage from '#lib/assets/images/beatriz.png';

    interface Props {
        title: string;
        desc: string;
        username?: string | null;
        url: string;
        image?: string;
    }

    let { title, desc, username = null, url = "https://offprint.cafe/", image = DefaultImage }: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<!-- Primary Meta Tags -->
	<meta name="title" content={title} />
	<meta name="description" content={desc} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="profile" />
	<meta property="profile:username" content={username} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={desc} />
	<meta property="twitter:image" content={image} />
</svelte:head>