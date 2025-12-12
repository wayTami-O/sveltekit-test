<script lang="ts">
	import { Button, Input, Textarea, Card, CardContent } from '$shared/ui';
	import { uploadImage } from '$features/image-upload/api.js';
	import { goto } from '$app/navigation';
	import { postFormSchema, type PostFormData } from '$entities/post/model/schema.js';

	let title = $state('');
	let content = $state('');
	let excerpt = $state('');
	let imageUrl = $state('');
	let imageFile = $state<File | null>(null);
	let imagePreview = $state('');
	let uploading = $state(false);
	let submitting = $state(false);
	let errors = $state<Partial<Record<keyof PostFormData, string>>>({});

	function generateExcerpt() {
		if (!excerpt && content) {
			excerpt = content.substring(0, 150) + '...';
		}
	}

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
			imagePreview = '';
		} finally {
			uploading = false;
		}
	}

	function removeImage() {
		imageFile = null;
		imagePreview = '';
		imageUrl = '';
	}

	function validateField(field: keyof PostFormData): void {
		const result = postFormSchema.safeParse({
			title: title.trim(),
			content: content.trim(),
			excerpt: excerpt.trim() || '',
			imageUrl: imageUrl || ''
		});

		if (!result.success) {
			const fieldError = result.error.issues.find((issue) => issue.path[0] === field);
			if (fieldError) {
				errors = { ...errors, [field]: fieldError.message };
			} else {
				const { [field]: _, ...rest } = errors;
				errors = rest;
			}
		} else {
			const { [field]: _, ...rest } = errors;
			errors = rest;
		}
	}

	function validateForm(): boolean {
		errors = {};
		
		const result = postFormSchema.safeParse({
			title: title.trim(),
			content: content.trim(),
			excerpt: excerpt.trim() || '',
			imageUrl: imageUrl || ''
		});

		if (!result.success) {
			const newErrors: Partial<Record<keyof PostFormData, string>> = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as keyof PostFormData;
				if (field) {
					newErrors[field] = issue.message;
				}
			});
			errors = newErrors;
			return false;
		}

		return true;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			console.log('Validation errors:', errors);
			return;
		}

		submitting = true;
		try {
			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: title.trim(),
					content: content.trim(),
					excerpt: excerpt.trim() || content.trim().substring(0, 150) + '...',
					imageUrl: imageUrl || undefined
				})
			});

			if (response.ok) {
				const post = await response.json();
				goto(`/posts/${post.id}`);
			} else {
				const error = await response.json();
				alert(error.error || 'Ошибка при создании поста');
			}
		} catch (error) {
			console.error('Failed to create post:', error);
			alert('Ошибка при создании поста');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-6">
		<Button href="/" variant="ghost">Назад</Button>
	</div>

	<Card>
		<CardContent class="p-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-6">Создать новый пост</h1>

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
						Заголовок *
					</label>
					<Input
						id="title"
						bind:value={title}
						placeholder="Введите заголовок поста"
						class={errors.title ? '!border-red-500 focus-visible:!ring-red-500' : ''}
						onblur={() => validateField('title')}
						required
					/>
					{#if errors.title}
						<p class="mt-1 text-sm text-red-600 font-medium">{errors.title}</p>
					{/if}
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
					{:else}
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
					{/if}
				</div>

				<div>
					<label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
						Краткое описание
					</label>
					<Textarea
						id="excerpt"
						bind:value={excerpt}
						placeholder="Краткое описание поста (будет сгенерировано автоматически, если оставить пустым)"
						class={errors.excerpt ? '!border-red-500 focus-visible:!ring-red-500' : ''}
						onblur={() => validateField('excerpt')}
						rows={3}
					/>
					{#if errors.excerpt}
						<p class="mt-1 text-sm text-red-600 font-medium">{errors.excerpt}</p>
					{/if}
				</div>

				<div>
					<label for="content" class="block text-sm font-medium text-gray-700 mb-2">
						Содержание *
					</label>
					<Textarea
						id="content"
						bind:value={content}
						placeholder="Напишите содержание поста..."
						class={errors.content ? '!border-red-500 focus-visible:!ring-red-500' : ''}
						rows={15}
						required
						oninput={generateExcerpt}
						onblur={() => validateField('content')}
					/>
					{#if errors.content}
						<p class="mt-1 text-sm text-red-600 font-medium">{errors.content}</p>
					{/if}
				</div>

				<div class="flex justify-end gap-4">
					<Button type="button" variant="outline" href="/">Отмена</Button>
					<Button type="submit" disabled={submitting}>
						{submitting ? 'Создание...' : 'Создать пост'}
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>

