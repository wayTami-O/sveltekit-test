<script lang="ts">
	import { onMount } from 'svelte';
	import type { BlogPost } from '$entities/post';
	import { Button } from '$shared/ui';
	import { PostCard } from '$widgets/post-card';

	let posts: BlogPost[] = $state([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('/api/posts');
			posts = await response.json();
		} catch (error) {
			console.error('Failed', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Все посты</h1>
		<Button href="/posts/new">Создать пост</Button>
	</div>

	{#if loading}
		<div class="text-center py-12">
			<p class="text-gray-500">Загрузка...</p>
		</div>
	{:else if posts.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500 mb-4">Пока нет постов</p>
			<Button href="/posts/new">Создать первый пост</Button>
		</div>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each posts as post (post.id)}
				<PostCard {post} />
			{/each}
		</div>
	{/if}
</div>

