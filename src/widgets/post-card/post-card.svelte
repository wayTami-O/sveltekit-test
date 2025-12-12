<script lang="ts">
	import type { BlogPost } from '$entities/post';
	import { Card, CardContent } from '$shared/ui';

	let { post }: { post: BlogPost } = $props();

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<Card>
	{#if post.imageUrl}
		<a href="/posts/{post.id}">
			<img src={post.imageUrl} alt={post.title} class="w-full h-48 object-cover rounded-t-lg" />
		</a>
	{/if}
	<CardContent class="p-6">
		<h2 class="text-xl font-semibold mb-2">
			<a href="/posts/{post.id}" class="hover:text-blue-600">{post.title}</a>
		</h2>
		<p class="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
		<div class="flex justify-between items-center text-sm text-gray-500">
			<span>{formatDate(post.createdAt)}</span>
			<a href="/posts/{post.id}" class="text-blue-600 hover:text-blue-800">Читать</a>
		</div>
	</CardContent>
</Card>

