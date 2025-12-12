<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Navigation } from '$widgets/navigation';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Мини-блог</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<Navigation />
	<main>
		{@render children()}
	</main>
</div>
