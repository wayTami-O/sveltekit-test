<script lang="ts">
	import type { BlogPost } from '$entities/post';
	import { Button, Input, Textarea, Card, CardContent } from '$shared/ui';
	import { uploadImage } from '$features/image-upload/api.js';
	import { goto } from '$app/navigation';

	let { data }: { data: { post: BlogPost } } = $props();

	let title = $state('');
	let content = $state('');
	let excerpt = $state('');
	let imageUrl = $state('');
	let imageFile = $state<File | null>(null);
	let imagePreview = $state('');
	let uploading = $state(false);
	let submitting = $state(false);

	$effect(() => {
		const post = data.post;
		title = post.title;
		content = post.content;
		excerpt = post.excerpt;
		imageUrl = post.imageUrl || '';
		imagePreview = post.imageUrl || '';
	});

	async function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			alert('Пожалуйста, выберите изображение');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			alert('Размер файла не должен превышать 5MB');
			return;
		}

		imageFile = file;
		imagePreview = URL.createObjectURL(file);

		uploading = true;
		try {
			imageUrl = await uploadImage(file);
		} catch (error) {
			console.error('Failed to upload image:', error);
			alert('Ошибка при загрузке изображения');
			imageFile = null;
			if (!data.post.imageUrl) {
				imagePreview = '';
			} else {
				imagePreview = data.post.imageUrl;
			}
		} finally {
			uploading = false;
		}
	}

	function removeImage() {
		imageFile = null;
		imageUrl = '';
		if (!data.post.imageUrl) {
			imagePreview = '';
		} else {
			imagePreview = data.post.imageUrl;
		}
	}

	async function handleSubmit() {
		if (!title.trim() || !content.trim()) {
			alert('Заполните все обязательные поля');
			return;
		}

		submitting = true;
		try {
			const response = await fetch(`/api/posts/${data.post.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: title.trim(),
					content: content.trim(),
					excerpt: excerpt.trim() || content.trim().substring(0, 150) + '...',
					imageUrl: imageUrl || ''
				})
			});

			if (response.ok) {
				goto(`/posts/${data.post.id}`);
			} else {
				const error = await response.json();
				alert(error.error || 'Ошибка при обновлении поста');
			}
		} catch (error) {
			console.error('Failed to update post:', error);
				alert('Ошибка при обновлении поста');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-6">
		<Button href="/posts/{data.post.id}" variant="ghost">Назад</Button>
	</div>

	<Card>
		<CardContent class="p-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-6">Редактировать пост</h1>

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
						Заголовок *
					</label>
					<Input id="title" bind:value={title} placeholder="Введите заголовок поста" required />
				</div>

				<div>
					<label for="image" class="block text-sm font-medium text-gray-700 mb-2">
						Изображение
					</label>
					{#if imagePreview}
						<div class="mb-4 relative">
							<img src={imagePreview} alt="Preview" class="w-full h-64 object-cover rounded-lg mb-2" />
							<Button type="button" variant="destructive" size="sm" onclick={removeImage}>
								Удалить изображение
							</Button>
						</div>
					{/if}
					<input
						type="file"
						id="image"
						accept="image/*"
						onchange={handleImageUpload}
						disabled={uploading}
						class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
					{#if uploading}
						<p class="mt-2 text-sm text-gray-500">Загрузка изображения...</p>
					{/if}
				</div>

				<div>
					<label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
						Краткое описание
					</label>
					<Textarea
						id="excerpt"
						bind:value={excerpt}
						placeholder="Краткое описание поста"
						rows={3}
					/>
				</div>

				<div>
					<label for="content" class="block text-sm font-medium text-gray-700 mb-2">
						Содержание *
					</label>
					<Textarea
						id="content"
						bind:value={content}
						placeholder="Напишите содержание поста..."
						rows={15}
						required
					/>
				</div>

				<div class="flex justify-end gap-4">
					<Button type="button" variant="outline" href="/posts/{data.post.id}">Отмена</Button>
					<Button type="submit" disabled={submitting}>
						{submitting ? 'Сохранение...' : 'Сохранить изменения'}
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>

