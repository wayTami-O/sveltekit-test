<script lang="ts">
	import type { BlogPost } from '$entities/post';
	import { Button } from '$shared/ui';
	import { goto } from '$app/navigation';
	import { deletePost } from '$features/post-delete';

	let { data }: { data: { post: BlogPost } } = $props();

	let deleting = $state(false);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function handleDelete() {
		if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;

		deleting = true;
		try {
			await deletePost(data.post.id);
			goto('/');
		} catch (error) {
			console.error('Failed to delete post:', error);
			alert('Ошибка при удалении поста');
		} finally {
			deleting = false;
		}
	}
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-6">
		<Button href="/" variant="ghost">Назад</Button>
	</div>

	<article class="bg-white rounded-lg shadow-sm p-8">
		<div class="mb-6 flex justify-between items-start">
			<div>
				<h1 class="text-4xl font-bold text-gray-900 mb-4">{data.post.title}</h1>
				<p class="text-gray-500 text-sm">
					Опубликовано: {formatDate(data.post.createdAt)}
					{#if data.post.updatedAt !== data.post.createdAt}
						<br />
						Обновлено: {formatDate(data.post.updatedAt)}
					{/if}
				</p>
			</div>
			<div class="flex gap-2">
				<Button href="/posts/{data.post.id}/edit" variant="outline">Редактировать</Button>
				<Button variant="destructive" onclick={handleDelete} disabled={deleting}>
					{deleting ? 'Удаление...' : 'Удалить'}
				</Button>
			</div>
		</div>

		{#if data.post.imageUrl}
			<div class="mb-6">
				<img src={data.post.imageUrl} alt={data.post.title} class="w-full h-auto rounded-lg object-cover" />
			</div>
		{/if}

		<div class="prose max-w-none">
			{#each data.post.content.split('\n') as paragraph}
				{#if paragraph.trim()}
					<p class="text-gray-700 mb-4">{paragraph}</p>
				{/if}
			{/each}
		</div>
	</article>
</div>
